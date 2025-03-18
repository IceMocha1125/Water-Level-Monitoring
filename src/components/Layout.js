import React, { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  WaterDrop as WaterDropIcon,
  People as PeopleIcon,
  Logout as LogoutIcon,
  Description as DocumentationIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import Logo from './Logo';

const drawerWidth = 240;

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const theme = useTheme();
  const { t } = useLanguage();
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  const drawerItems = [
    { text: t('dashboard'), icon: <DashboardIcon />, path: '/' },
    { text: t('waterLevel'), icon: <WaterDropIcon />, path: '/monitoring' },
    { text: t('residents'), icon: <PeopleIcon />, path: '/residents' },
    { text: t('helpAndSupport'), icon: <DocumentationIcon />, path: '/documentation' },
    { text: t('notifications'), icon: <NotificationsIcon />, path: '/notifications' },
    { text: 'Reports', icon: <AssessmentIcon />, path: '/reports' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogoutClick = () => {
    setOpenLogoutDialog(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const handleLogoutCancel = () => {
    setOpenLogoutDialog(false);
  };

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <Drawer
        variant="permanent"
        sx={{
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: 'background.paper',
            borderRight: `1px solid ${theme.palette.divider}`,
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
          },
        }}
      >
        <Box 
          sx={{ 
            p: 2,
            cursor: 'pointer'
          }}
          onClick={() => handleNavigation('/')}
        >
          <Logo />
        </Box>
        <Divider />
        <List sx={{ mt: 2 }}>
          {drawerItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => handleNavigation(item.path)}
              selected={location.pathname === item.path}
              sx={{
                mb: 1,
                borderRadius: '0 8px 8px 0',
                mr: 2,
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                },
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <ListItemIcon 
                sx={{ 
                  minWidth: 40,
                  color: location.pathname === item.path ? 'white' : 'primary.main'
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
        <Box sx={{ flexGrow: 1 }} />
        <Divider />
        <List>
          <ListItem 
            button 
            onClick={() => handleNavigation('/settings')}
            selected={location.pathname === '/settings'}
            sx={{
              mb: 1,
              '&:hover': {
                backgroundColor: 'action.hover',
              },
              '&.Mui-selected': {
                backgroundColor: 'primary.main',
                color: 'white',
                '& .MuiListItemIcon-root': {
                  color: 'white',
                },
              },
            }}
          >
            <ListItemIcon 
              sx={{ 
                minWidth: 40,
                color: location.pathname === '/settings' ? 'white' : 'primary.main'
              }}
            >
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary={t('settings')} />
          </ListItem>
          <ListItem 
            button 
            onClick={handleLogoutClick}
            sx={{
              mb: 2,
              '&:hover': {
                backgroundColor: 'error.main',
                color: 'white',
                '& .MuiListItemIcon-root': {
                  color: 'white',
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'error.main' }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary={t('logout')} />
          </ListItem>
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          marginLeft: `${drawerWidth}px`,
          minHeight: '100vh',
          backgroundColor: 'background.default',
        }}
      >
        <Outlet />
      </Box>

      {/* Logout Confirmation Dialog */}
      <Dialog open={openLogoutDialog} onClose={handleLogoutCancel}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to log out of the system?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogoutCancel}>Cancel</Button>
          <Button onClick={handleLogoutConfirm} color="error" variant="contained">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Layout; 