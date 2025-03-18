import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
  Grid,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  FormControlLabel,
  Checkbox,
  Snackbar,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  WaterDrop as WaterDropIcon,
  People as PeopleIcon,
  Logout as LogoutIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Upload as UploadIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import * as XLSX from 'xlsx';

const drawerWidth = 240;

function Residents() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [residents, setResidents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedResident, setSelectedResident] = useState(null);
  const [error, setError] = useState('');
  const [editedResident, setEditedResident] = useState(null);
  const [newResident, setNewResident] = useState({
    name: '',
    address: 'Sitio Toto, Cupang Proper, Balanga City',
    contact: '',
    email: '',
    notificationPreferences: {
      email: true,
      push: true,
      sms: true
    }
  });
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [pendingChanges, setPendingChanges] = useState(null);

  useEffect(() => {
    fetchResidents();
  }, []);

  const fetchResidents = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'residents'));
      const residentsData = [];
      querySnapshot.forEach((doc) => {
        residentsData.push({ id: doc.id, ...doc.data() });
      });
      setResidents(residentsData);
    } catch (error) {
      console.error('Error fetching residents:', error);
      showSnackbar('Error fetching residents', 'error');
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setError('');

    if (name === 'contact') {
      let cleanNumber = value.replace(/\D/g, '').replace(/^63/, '');
      cleanNumber = cleanNumber.replace(/^0+/, '');
      cleanNumber = cleanNumber.slice(0, 10);
      const formattedNumber = cleanNumber ? `+63${cleanNumber}` : '';
      
      if (openEditDialog) {
        setEditedResident(prev => ({
          ...prev,
          contact: formattedNumber
        }));
      } else {
        setNewResident(prev => ({
          ...prev,
          contact: formattedNumber
        }));
      }
    } else if (name === 'email') {
      // Check if the email already contains a domain
      const hasDomain = value.includes('@');
      const formattedEmail = hasDomain ? value : `${value}@gmail.com`;
      
      if (openEditDialog) {
        setEditedResident(prev => ({
          ...prev,
          email: formattedEmail
        }));
      } else {
        setNewResident(prev => ({
          ...prev,
          email: formattedEmail
        }));
      }
    } else if (name.startsWith('notification.')) {
      const notificationType = name.split('.')[1];
      if (openEditDialog) {
        setEditedResident(prev => ({
          ...prev,
          notificationPreferences: {
            ...prev.notificationPreferences,
            [notificationType]: value === 'true'
          }
        }));
      } else {
        setNewResident(prev => ({
          ...prev,
          notificationPreferences: {
            ...prev.notificationPreferences,
            [notificationType]: value === 'true'
          }
        }));
      }
    } else {
      if (openEditDialog) {
        setEditedResident(prev => ({
          ...prev,
          [name]: value
        }));
      } else {
        setNewResident(prev => ({
          ...prev,
          [name]: value
        }));
      }
    }
  };

  const validatePhoneNumber = (number) => {
    const phoneRegex = /^\+639\d{9}$/;
    return phoneRegex.test(number);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isDuplicateContact = (contact, excludeId = null) => {
    return residents.some(resident => 
      resident.contact === contact && resident.id !== excludeId
    );
  };

  const isDuplicateEmail = (email, excludeId = null) => {
    return residents.some(resident => 
      resident.email === email && resident.id !== excludeId
    );
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
    setError('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewResident({
      name: '',
      address: 'Sitio Toto, Cupang Proper, Balanga City',
      contact: '',
      email: '',
      notificationPreferences: {
        email: true,
        push: true,
        sms: true
      }
    });
    setError('');
  };

  const handleOpenEditDialog = (resident) => {
    // Store the original resident data for comparison
    setSelectedResident(resident);
    setEditedResident({ 
      ...resident,
      notificationPreferences: resident.notificationPreferences || {
        email: true,
        push: true,
        sms: true
      }
    });
    setOpenEditDialog(true);
    setError('');
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditedResident(null);
    setError('');
  };

  const handleOpenDeleteDialog = (resident) => {
    setSelectedResident(resident);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedResident(null);
  };

  const handleSubmit = async () => {
    if (!validatePhoneNumber(newResident.contact)) {
      setError('Please enter a valid Philippine mobile number (+63 followed by 10 digits)');
      return;
    }

    if (!validateEmail(newResident.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (isDuplicateContact(newResident.contact)) {
      setError('This contact number is already registered');
      return;
    }

    if (isDuplicateEmail(newResident.email)) {
      setError('This email address is already registered');
      return;
    }

    try {
      await addDoc(collection(db, 'residents'), {
        ...newResident,
        timestamp: serverTimestamp(),
      });
      handleCloseDialog();
      fetchResidents();
      showSnackbar('Resident added successfully', 'success');
    } catch (error) {
      console.error('Error adding resident:', error);
      setError('Failed to add resident. Please try again.');
      showSnackbar('Error adding resident', 'error');
    }
  };

  const handleEdit = async () => {
    if (!validatePhoneNumber(editedResident.contact)) {
      setError('Please enter a valid Philippine mobile number (+63 followed by 10 digits)');
      return;
    }

    if (!validateEmail(editedResident.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (isDuplicateContact(editedResident.contact, editedResident.id)) {
      setError('This contact number is already registered');
      return;
    }

    if (isDuplicateEmail(editedResident.email, editedResident.id)) {
      setError('This email address is already registered');
      return;
    }

    // Store the changes and show confirmation dialog
    setPendingChanges(editedResident);
    setOpenConfirmDialog(true);
  };

  const handleConfirmSave = async () => {
    try {
      const residentRef = doc(db, 'residents', pendingChanges.id);
      await updateDoc(residentRef, {
        name: pendingChanges.name,
        address: pendingChanges.address,
        contact: pendingChanges.contact,
        email: pendingChanges.email,
        notificationPreferences: pendingChanges.notificationPreferences,
        updatedAt: serverTimestamp(),
      });
      handleCloseEditDialog();
      setOpenConfirmDialog(false);
      setSelectedResident(null); // Clear the selected resident
      fetchResidents();
      showSnackbar('Resident updated successfully', 'success');
    } catch (error) {
      console.error('Error updating resident:', error);
      setError('Failed to update resident. Please try again.');
      showSnackbar('Error updating resident', 'error');
    }
  };

  const handleCancelSave = () => {
    setOpenConfirmDialog(false);
    setPendingChanges(null);
    setSelectedResident(null); // Clear the selected resident
  };

  const handleDelete = async () => {
    if (!selectedResident) return;
    
    try {
      await deleteDoc(doc(db, 'residents', selectedResident.id));
      handleCloseDeleteDialog();
      fetchResidents();
      showSnackbar('Resident deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting resident:', error);
      showSnackbar('Error deleting resident', 'error');
    }
  };

  const handleImportExcel = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const workbook = XLSX.read(e.target.result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);

        // Validate and format the data
        const formattedData = data.map(row => ({
          name: row.name || row.Name || '',
          address: row.address || row.Address || '',
          contact: (row.contact || row.Contact || '').toString(),
          email: row.email || row.Email || '',
        }));

        // Filter out empty rows
        const validData = formattedData.filter(row => 
          row.name && row.address && (row.contact || row.email)
        );

        if (validData.length === 0) {
          showSnackbar('No valid data found in Excel file', 'error');
          return;
        }

        // Add each resident to Firestore
        for (const resident of validData) {
          await addDoc(collection(db, 'residents'), resident);
        }

        await fetchResidents();
        showSnackbar(`Successfully imported ${validData.length} residents`, 'success');
      } catch (error) {
        console.error('Error importing Excel file:', error);
        showSnackbar('Error importing Excel file', 'error');
      }
    };

    if (file) {
      reader.readAsBinaryString(file);
    }
  };

  const handleExportExcel = () => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(residents);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Residents');
      XLSX.writeFile(workbook, 'residents.xlsx');
      showSnackbar('Successfully exported residents to Excel', 'success');
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      showSnackbar('Error exporting to Excel', 'error');
    }
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Water Monitoring
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        <ListItem button onClick={() => navigate('/dashboard')}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button onClick={() => navigate('/monitoring')}>
          <ListItemIcon>
            <WaterDropIcon />
          </ListItemIcon>
          <ListItemText primary="Water Level" />
        </ListItem>
        <ListItem button onClick={() => navigate('/residents')}>
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Residents" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </div>
  );

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

  return (
    <Box>
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 2, px: 3 }}>
        <Typography variant="h6">
          Residents Management
        </Typography>
      </Box>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">
            Residents List
          </Typography>
          <Box>
            <input
              type="file"
              accept=".xlsx,.xls"
              style={{ display: 'none' }}
              id="excel-file-input"
              onChange={handleImportExcel}
            />
            <label htmlFor="excel-file-input">
              <Tooltip title="Import from Excel">
                <Button
                  component="span"
                  variant="contained"
                  startIcon={<UploadIcon />}
                  sx={{ mr: 1 }}
                >
                  Import
                </Button>
              </Tooltip>
            </label>
            <Tooltip title="Export to Excel">
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={handleExportExcel}
                sx={{ mr: 1 }}
              >
                Export
              </Button>
            </Tooltip>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenDialog}
            >
              Add Resident
            </Button>
          </Box>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Notifications</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {residents.map((resident) => (
                <TableRow key={resident.id}>
                  <TableCell>{resident.name}</TableCell>
                  <TableCell>{resident.address}</TableCell>
                  <TableCell>{resident.contact}</TableCell>
                  <TableCell>{resident.email}</TableCell>
                  <TableCell>
                    {resident.notificationPreferences?.email && 'Email '}
                    {resident.notificationPreferences?.sms && 'SMS '}
                    {resident.notificationPreferences?.push && 'Push'}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenEditDialog(resident)}
                      size="small"
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleOpenDeleteDialog(resident)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add New Resident</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={newResident.name}
            onChange={handleInputChange}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Address"
            name="address"
            value={newResident.address}
            onChange={handleInputChange}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Contact Number"
            name="contact"
            value={newResident.contact}
            onChange={handleInputChange}
            required
            helperText="Format: +639XXXXXXXXX (Used for SMS alerts)"
            error={!!error}
          />
          <TextField
            fullWidth
            label="Email Address"
            name="email"
            value={newResident.email}
            onChange={handleInputChange}
            required
            helperText="Enter email or username (will automatically add @gmail.com)"
          />
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Notification Preferences</Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={newResident.notificationPreferences.email}
                  onChange={(e) => handleInputChange({
                    target: {
                      name: 'notification.email',
                      value: e.target.checked
                    }
                  })}
                />
              }
              label="Email Notifications"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={newResident.notificationPreferences.sms}
                  onChange={(e) => handleInputChange({
                    target: {
                      name: 'notification.sms',
                      value: e.target.checked
                    }
                  })}
                />
              }
              label="SMS Alerts"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={newResident.notificationPreferences.push}
                  onChange={(e) => handleInputChange({
                    target: {
                      name: 'notification.push',
                      value: e.target.checked
                    }
                  })}
                />
              }
              label="Push Notifications"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={!newResident.name || !newResident.address || !newResident.contact || !validatePhoneNumber(newResident.contact)}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit Resident</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {editedResident && (
            <>
              <TextField
                autoFocus
                margin="dense"
                name="name"
                label="Full Name"
                type="text"
                fullWidth
                value={editedResident.name}
                onChange={handleInputChange}
                required
              />
              <TextField
                margin="dense"
                name="address"
                label="Address"
                type="text"
                fullWidth
                value={editedResident.address}
                onChange={handleInputChange}
                required
              />
              <TextField
                margin="dense"
                name="contact"
                label="Contact Number"
                type="text"
                fullWidth
                value={editedResident.contact}
                onChange={handleInputChange}
                required
                helperText="Format: +63XXXXXXXXXX (Used for SMS alerts)"
              />
              <TextField
                margin="dense"
                name="email"
                label="Email Address"
                type="email"
                fullWidth
                value={editedResident.email}
                onChange={handleInputChange}
                required
                helperText="Enter email or username (will automatically add @gmail.com)"
              />
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>Notification Preferences</Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={editedResident.notificationPreferences.email}
                      onChange={(e) => handleInputChange({
                        target: {
                          name: 'notification.email',
                          value: e.target.checked
                        }
                      })}
                    />
                  }
                  label="Email Notifications"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={editedResident.notificationPreferences.sms}
                      onChange={(e) => handleInputChange({
                        target: {
                          name: 'notification.sms',
                          value: e.target.checked
                        }
                      })}
                    />
                  }
                  label="SMS Alerts"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={editedResident.notificationPreferences.push}
                      onChange={(e) => handleInputChange({
                        target: {
                          name: 'notification.push',
                          value: e.target.checked
                        }
                      })}
                    />
                  }
                  label="Push Notifications"
                />
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button onClick={handleEdit} variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {selectedResident?.name}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openConfirmDialog} onClose={handleCancelSave}>
        <DialogTitle>Confirm Changes</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Are you sure you want to save the following changes?
          </Typography>
          {pendingChanges && selectedResident && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" color="primary">Previous Information:</Typography>
              <Typography variant="body2">Name: {selectedResident.name}</Typography>
              <Typography variant="body2">Address: {selectedResident.address}</Typography>
              <Typography variant="body2">Contact: {selectedResident.contact}</Typography>
              <Typography variant="body2">Email: {selectedResident.email}</Typography>
              <Typography variant="body2">
                Notifications: {selectedResident.notificationPreferences?.email ? 'Email ' : ''}
                {selectedResident.notificationPreferences?.sms ? 'SMS ' : ''}
                {selectedResident.notificationPreferences?.push ? 'Push' : ''}
              </Typography>
              <Typography variant="subtitle2" color="primary" sx={{ mt: 2 }}>New Information:</Typography>
              <Typography variant="body2">Name: {pendingChanges.name}</Typography>
              <Typography variant="body2">Address: {pendingChanges.address}</Typography>
              <Typography variant="body2">Contact: {pendingChanges.contact}</Typography>
              <Typography variant="body2">Email: {pendingChanges.email}</Typography>
              <Typography variant="body2">
                Notifications: {pendingChanges.notificationPreferences?.email ? 'Email ' : ''}
                {pendingChanges.notificationPreferences?.sms ? 'SMS ' : ''}
                {pendingChanges.notificationPreferences?.push ? 'Push' : ''}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelSave}>Cancel</Button>
          <Button onClick={handleConfirmSave} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Residents; 