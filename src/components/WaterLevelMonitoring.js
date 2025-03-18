import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  addDoc,
  serverTimestamp,
  getDocs,
  doc,
} from 'firebase/firestore';
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from '@mui/material';
import {
  Download as DownloadIcon,
} from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { keyframes } from '@emotion/react';
import { styled } from '@mui/material/styles';
import CupangMap from './CupangMap';
import WaterLevelAlert from './WaterLevelAlert';
import NotificationSettings from './NotificationSettings';
import NotificationService from '../services/NotificationService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const drawerWidth = 240;

const wave = keyframes`
  0% {
    transform: translateX(0) translateZ(0) scaleY(1);
  }
  50% {
    transform: translateX(-25%) translateZ(0) scaleY(0.55);
  }
  100% {
    transform: translateX(-50%) translateZ(0) scaleY(1);
  }
`;

// Update water level thresholds (in inches)
const WATER_LEVELS = {
  NORMAL: { max: 8, color: '#2e7d32', label: 'Normal' },
  LOW: { min: 9, max: 13, color: '#ff9800', label: 'Low' },
  HIGH: { min: 14, max: 18, color: '#ed6c02', label: 'High' },
  CRITICAL: { min: 19, max: 30, color: '#d32f2f', label: 'Critical' }
};

// Function to determine water level status
const getWaterLevelStatus = (level) => {
  if (level <= WATER_LEVELS.NORMAL.max) return WATER_LEVELS.NORMAL;
  if (level <= WATER_LEVELS.LOW.max) return WATER_LEVELS.LOW;
  if (level <= WATER_LEVELS.HIGH.max) return WATER_LEVELS.HIGH;
  return WATER_LEVELS.CRITICAL;
};

const WaterTank = styled(Box)(({ theme, level }) => ({
  position: 'relative',
  width: '200px',
  height: '250px',
  background: 'transparent',
  border: '2px solid #1976d2',
  borderRadius: '10px',
  overflow: 'hidden',
  margin: '20px auto',
  '&::before': {
    content: '""',
    position: 'absolute',
    width: '200%',
    height: '200%',
    top: `${100 - Math.min(Math.max((level / 30) * 100, 0), 100)}%`,
    left: '-50%',
    borderRadius: '40%',
    background: ({ level }) => {
      const status = getWaterLevelStatus(level);
      return status ? `${status.color}80` : 'rgba(25, 118, 210, 0.5)';
    },
    animation: `${wave} 5s infinite linear`,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    width: '204%',
    height: '204%',
    top: `${100 - Math.min(Math.max((level / 30) * 100, 0), 100)}%`,
    left: '-52%',
    borderRadius: '40%',
    background: ({ level }) => {
      const status = getWaterLevelStatus(level);
      return status ? `${status.color}50` : 'rgba(25, 118, 210, 0.3)';
    },
    animation: `${wave} 5s infinite linear`,
    animationDelay: '0.1s',
  }
}));

const LevelIndicator = styled(Box)({
  position: 'absolute',
  right: '-40px',
  height: '100%',
  width: '30px',
  background: '#f5f5f5',
  border: '1px solid #1976d2',
  borderRadius: '5px',
  '& .marker': {
    position: 'absolute',
    width: '100%',
    borderTop: '1px dashed #1976d2',
    '& span': {
      position: 'absolute',
      right: '-25px',
      transform: 'translateY(-50%)',
      color: '#1976d2',
    },
  },
});

function WaterLevelMonitoring() {
  const [waterLevels, setWaterLevels] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(null);
  const [lastAlertSent, setLastAlertSent] = useState(null);
  const ALERT_COOLDOWN = 1800000; // 30 minutes in milliseconds
  const [waterLevel, setWaterLevel] = useState(0);
  const [alertComponent] = useState(() => new WaterLevelAlert());

  // Add these helper functions at the top of the component
  const formatDate = (date) => {
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      time: date.toLocaleTimeString(),
      fullDate: date.toLocaleDateString(),
    };
  };

  const shouldRecordReading = (lastReading) => {
    if (!lastReading) return true;
    const now = new Date();
    const lastReadingTime = lastReading.timestamp.toDate();
    const timeDiff = now - lastReadingTime;
    return timeDiff >= 30 * 60 * 1000; // 30 minutes in milliseconds
  };

  useEffect(() => {
    // Query to get organized water level readings
    const q = query(
      collection(db, 'waterLevels'),
      orderBy('timestamp', 'desc'),
      limit(1000) // Increased limit to get more historical data
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const organizedLevels = {};
      snapshot.forEach((doc) => {
        const data = doc.data();
        const date = data.timestamp.toDate();
        const { year, month, day, time, fullDate } = formatDate(date);

        // Create nested structure if it doesn't exist
        if (!organizedLevels[year]) {
          organizedLevels[year] = {};
        }
        if (!organizedLevels[year][month]) {
          organizedLevels[year][month] = {};
        }
        if (!organizedLevels[year][month][day]) {
          organizedLevels[year][month][day] = {
            date: fullDate,
            readings: []
          };
        }

        // Add reading to the appropriate day
        organizedLevels[year][month][day].readings.push({
          id: doc.id,
          ...data,
          time: time,
          tideLevel: data.tideLevel || 'High: 1.2m | Low: 0.3m'
        });
      });

      setWaterLevels(organizedLevels);
      
      // Get the most recent reading for current level display
      const allReadings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (allReadings.length > 0) {
        setCurrentLevel(allReadings[0]);
      }
    });

    // Monitor water level changes
    const waterLevelUnsubscribe = onSnapshot(doc(db, 'sensors', 'waterLevel'), async (doc) => {
      if (doc.exists()) {
        const level = doc.data().level;
        setWaterLevel(level);
        
        // Get the last reading to check if we should record
        const lastReadingQuery = query(
          collection(db, 'waterLevels'),
          orderBy('timestamp', 'desc'),
          limit(1)
        );
        const lastReadingSnapshot = await getDocs(lastReadingQuery);
        const lastReading = lastReadingSnapshot.docs[0]?.data();

        // Only record if 30 minutes have passed since last reading
        if (shouldRecordReading(lastReading)) {
          try {
            await addDoc(collection(db, 'waterLevels'), {
              level: level,
              timestamp: serverTimestamp(),
              tideLevel: 'High: 1.2m | Low: 0.3m',
              status: getWaterLevelStatus(level).label
            });
          } catch (error) {
            console.error('Error recording water level:', error);
          }
        }
        
        // Check water level and send alerts if necessary
        alertComponent.checkWaterLevel(level);
      }
    });

    return () => {
      unsubscribe();
      waterLevelUnsubscribe();
    };
  }, [alertComponent]);

  const handleDownloadPDF = async () => {
    try {
      // Create new PDF document
      const doc = new jsPDF();
      
      // Add header with logo and title
      doc.setFontSize(20);
      doc.setTextColor(25, 118, 210); // primary blue color
      doc.text('Water Level Monitoring System', 105, 20, { align: 'center' });
      
      // Add report information
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text('Report Generated:', 14, 35);
      doc.text(new Date().toLocaleString(), 50, 35);
      doc.text('Location:', 14, 42);
      doc.text('Cupang Proper, Balanga City', 50, 42);

      // Add Water Level Data section
      doc.setFontSize(16);
      doc.setTextColor(25, 118, 210);
      doc.text('Water Level History', 14, 55);
      
      // Format water level data for table
      const waterLevelData = waterLevels.map((level) => [
        new Date(level.timestamp.toDate()).toLocaleString(),
        `${level.level}"`,
        getWaterLevelStatus(level.level).label,
        getWaterLevelStatus(level.level).label === 'Critical' ? 'Immediate Action Required' : 
        getWaterLevelStatus(level.level).label === 'High' ? 'Monitor Closely' : 'Normal'
      ]);

      // Add water levels table
      doc.autoTable({
        startY: 60,
        head: [['Date & Time', 'Level', 'Status', 'Action Required']],
        body: waterLevelData,
        headStyles: { fillColor: [25, 118, 210] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { top: 60 },
      });

      // Add Residents Information on a new page
      doc.addPage();
      doc.setFontSize(16);
      doc.setTextColor(25, 118, 210);
      doc.text('Residents Information', 14, 20);

      // Fetch residents data
      const residentsSnapshot = await getDocs(collection(db, 'residents'));
      const residentsData = [];
      residentsSnapshot.forEach((doc) => {
        residentsData.push({ id: doc.id, ...doc.data() });
      });

      // Create residents table
      doc.autoTable({
        startY: 25,
        head: [['Name', 'Address', 'Contact Number', 'Email']],
        body: residentsData.map((resident) => [
          resident.name,
          resident.address,
          resident.contact,
          resident.email || 'N/A'
        ]),
        headStyles: { fillColor: [25, 118, 210] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { top: 25 },
      });

      // Add summary section
      const lastY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(14);
      doc.setTextColor(25, 118, 210);
      doc.text('Summary', 14, lastY);
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Total Water Level Readings: ${waterLevels.length}`, 14, lastY + 8);
      doc.text(`Total Residents: ${residentsData.length}`, 14, lastY + 16);
      
      // Add current water level status
      if (currentLevel) {
        const status = getWaterLevelStatus(currentLevel.level);
        doc.text(`Current Water Level: ${currentLevel.level}" (${status.label})`, 14, lastY + 24);
      }

      // Add footer with page numbers
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(128, 128, 128);
        doc.text(
          `Page ${i} of ${pageCount}`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
      }

      // Save the PDF
      doc.save('water-level-monitoring-report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  // Update the chart data preparation
  const prepareChartData = () => {
    const chartLabels = [];
    const chartValues = [];

    // Flatten the organized data for the chart
    Object.entries(waterLevels).forEach(([year, months]) => {
      Object.entries(months).forEach(([month, days]) => {
        Object.entries(days).forEach(([day, dayData]) => {
          dayData.readings.forEach((reading) => {
            chartLabels.push(reading.time);
            chartValues.push(reading.level);
          });
        });
      });
    });

    return {
      labels: chartLabels.slice(-10), // Show last 10 readings
      datasets: [
        {
          label: 'Water Level (inches)',
          data: chartValues.slice(-10), // Show last 10 readings
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        },
      ],
    };
  };

  const chartData = prepareChartData();

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Water Level Monitoring - Cupang Proper',
      },
    },
    scales: {
      y: {
        min: 0,
        max: 30,
        ticks: {
          stepSize: 2,
          callback: (value) => `${value}"`,
          autoSkip: false,
          maxTicksLimit: 16
        },
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          autoSkip: true,
          maxTicksLimit: 6
        },
        grid: {
          display: true,
          drawBorder: true,
        }
      }
    },
    maintainAspectRatio: false
  };

  // Function to send SMS alerts
  const sendAlerts = async (level, status) => {
    if (!lastAlertSent || Date.now() - lastAlertSent > ALERT_COOLDOWN) {
      try {
        // Get all residents from the database
        const residentsSnapshot = await getDocs(collection(db, 'residents'));
        const residents = [];
        residentsSnapshot.forEach((doc) => {
          residents.push({ id: doc.id, ...doc.data() });
        });

        // Prepare the alert message
        const message = `ALERT: Water level at Cupang Proper is ${level} inches (${status.label}). Please take necessary precautions.`;

        // For each resident with a contact number, send SMS
        residents.forEach(async (resident) => {
          if (resident.contact) {
            try {
              // Add the alert to Firebase
              await addDoc(collection(db, 'alerts'), {
                recipient: resident.contact,
                message: message,
                level: level,
                status: status.label,
                timestamp: serverTimestamp(),
              });
            } catch (error) {
              console.error('Error sending alert:', error);
            }
          }
        });

        setLastAlertSent(Date.now());
      } catch (error) {
        console.error('Error fetching residents:', error);
      }
    }
  };

  return (
    <Box>
      <Box 
        sx={{ 
          bgcolor: 'primary.main', 
          color: 'white', 
          py: 3,
          px: 2,
          textAlign: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
          Water Level Monitoring - Cupang Proper
        </Typography>
        {currentLevel && (
          <Typography variant="subtitle1" sx={{ mt: 1, opacity: 0.9 }}>
            Last Update: {new Date(currentLevel.timestamp.toDate()).toLocaleTimeString()}
          </Typography>
        )}
      </Box>
      <Container 
        maxWidth="lg" 
        sx={{ 
          mt: 4, 
          mb: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          px: { xs: 2, sm: 3 },
        }}
      >
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={8}>
            <Paper 
              sx={{ 
                p: 4, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                minHeight: '400px',
              }}
            >
              <Typography variant="h6" gutterBottom align="center" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                Live Water Level Chart
              </Typography>
              <Box sx={{ width: '100%', height: '300px', position: 'relative' }}>
                {Object.keys(waterLevels).length > 0 ? (
                  <Line options={chartOptions} data={chartData} />
                ) : (
                  <Typography variant="body1" sx={{ textAlign: 'center', mt: 10 }}>
                    No water level data available
                  </Typography>
                )}
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper 
              sx={{ 
                p: 3, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                position: 'relative',
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              <Typography variant="h6" gutterBottom align="center" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                Current Water Level
              </Typography>
              {currentLevel && (
                <>
                  <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', my: 2 }}>
                    <WaterTank level={currentLevel.level}>
                      <Typography
                        variant="h4"
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          color: '#fff',
                          zIndex: 1,
                          fontWeight: 'bold',
                          textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                        }}
                      >
                        {currentLevel.level}"
                      </Typography>
                    </WaterTank>
                    <LevelIndicator>
                      {[30, 25, 20, 15, 10, 5, 0].map((mark) => (
                        <Box
                          key={mark}
                          className="marker"
                          sx={{
                            bottom: `${(mark / 30) * 100}%`,
                          }}
                        >
                          <span>{mark}"</span>
                        </Box>
                      ))}
                    </LevelIndicator>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                    Last updated: {new Date(currentLevel.timestamp.toDate()).toLocaleString()}
                  </Typography>
                  <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: getWaterLevelStatus(currentLevel.level).color,
                        fontWeight: 'bold',
                      }}
                    >
                      {getWaterLevelStatus(currentLevel.level).label}
                    </Typography>
                  </Box>
                </>
              )}
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper 
              sx={{ 
                p: 3, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                height: 400,
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 3, 
                width: '100%',
              }}>
                <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                  Water Level History
                </Typography>
              </Box>
              <Box sx={{ bgcolor: 'primary.main', p: 2, borderRadius: 1, color: 'white', mb: 2, width: '100%', textAlign: 'center' }}>
                <Typography variant="h6" align="center">
                  Bataan Tide Information
                </Typography>
                <Typography variant="body1" align="center">
                  High Tide: 1.2m (3.9ft) | Low Tide: 0.3m (1ft)
                </Typography>
                <Typography variant="caption" align="center" display="block" sx={{ mt: 0.5 }}>
                  * Based on average tide levels in Bataan
                </Typography>
              </Box>
              <TableContainer sx={{ width: '100%', maxHeight: 250 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>Date</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>Time</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>Level (inches)</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>Status</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>Tide Level</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(waterLevels).reverse().map(([year, months]) => (
                      Object.entries(months).reverse().map(([month, days]) => (
                        Object.entries(days).reverse().map(([day, dayData]) => (
                          dayData.readings.map((reading, index) => (
                            <TableRow key={reading.id} hover>
                              <TableCell align="center">{dayData.date}</TableCell>
                              <TableCell align="center">{reading.time}</TableCell>
                              <TableCell align="center">{reading.level}</TableCell>
                              <TableCell align="center">
                                <Chip
                                  label={getWaterLevelStatus(reading.level).label}
                                  color={
                                    getWaterLevelStatus(reading.level).label === 'High'
                                      ? 'error'
                                      : getWaterLevelStatus(reading.level).label === 'Medium'
                                      ? 'warning'
                                      : 'success'
                                  }
                                  size="small"
                                  sx={{ fontWeight: 'bold' }}
                                />
                              </TableCell>
                              <TableCell align="center">{reading.tideLevel}</TableCell>
                            </TableRow>
                          ))
                        ))
                      ))
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default WaterLevelMonitoring; 