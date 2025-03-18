import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Download as DownloadIcon,
  History as HistoryIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import * as XLSX from 'xlsx';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { useLanguage } from '../contexts/LanguageContext';

function Reports() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { t } = useLanguage();

  const handleDownloadWaterLevelHistory = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Get water level history from Firestore
      const waterLevelRef = collection(db, 'waterLevels');
      const q = query(waterLevelRef, orderBy('timestamp', 'desc'), limit(1000));
      const querySnapshot = await getDocs(q);
      
      const waterLevelData = querySnapshot.docs.map(doc => ({
        timestamp: doc.data().timestamp?.toDate().toLocaleString(),
        level: doc.data().level,
        status: doc.data().status,
        location: doc.data().location,
      }));

      // Create Excel workbook
      const worksheet = XLSX.utils.json_to_sheet(waterLevelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Water Level History');

      // Save the file
      XLSX.writeFile(workbook, 'water_level_history.xlsx');
      setSuccess('Water level history downloaded successfully');
    } catch (error) {
      console.error('Error downloading water level history:', error);
      setError('Failed to download water level history');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadResidents = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Get residents from Firestore
      const residentsRef = collection(db, 'residents');
      const querySnapshot = await getDocs(residentsRef);
      
      const residentsData = querySnapshot.docs.map(doc => ({
        name: doc.data().name,
        address: doc.data().address,
        contact: doc.data().contact,
        email: doc.data().email,
        notificationPreferences: {
          email: doc.data().notificationPreferences?.email ? 'Yes' : 'No',
          sms: doc.data().notificationPreferences?.sms ? 'Yes' : 'No',
          push: doc.data().notificationPreferences?.push ? 'Yes' : 'No',
        },
      }));

      // Create Excel workbook
      const worksheet = XLSX.utils.json_to_sheet(residentsData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Residents');

      // Save the file
      XLSX.writeFile(workbook, 'residents_list.xlsx');
      setSuccess('Residents list downloaded successfully');
    } catch (error) {
      console.error('Error downloading residents list:', error);
      setError('Failed to download residents list');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <HistoryIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h6">Water Level History</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Download the last 1000 water level readings with timestamps and status
                  </Typography>
                </Box>
              </Box>
            </CardContent>
            <CardActions>
              <Button
                startIcon={loading ? <CircularProgress size={20} /> : <DownloadIcon />}
                variant="contained"
                onClick={handleDownloadWaterLevelHistory}
                disabled={loading}
              >
                Download History
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PeopleIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h6">Residents List</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Download complete list of residents with contact information
                  </Typography>
                </Box>
              </Box>
            </CardContent>
            <CardActions>
              <Button
                startIcon={loading ? <CircularProgress size={20} /> : <DownloadIcon />}
                variant="contained"
                onClick={handleDownloadResidents}
                disabled={loading}
              >
                Download Residents
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Reports; 