import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Box,
  Divider
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Assignment as TicketsIcon,
  Build as TechniciansIcon,
  Inventory as InventoryIcon,
  Analytics as AnalyticsIcon,
  Feedback as FeedbackIcon,
  Settings as SettingsIcon,
  LocationOn as LiveTrackingIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const Navbar = () => {
  const navigate = useNavigate();
  
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Live Tracking', icon: <LiveTrackingIcon />, path: '/live-tracking' },
    { text: 'Tickets', icon: <TicketsIcon />, path: '/tickets' },
    { text: 'Technicians', icon: <TechniciansIcon />, path: '/technicians' },
    { text: 'Parts Inventory', icon: <InventoryIcon />, path: '/inventory' },
    { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
    { text: 'Customer Feedback', icon: <FeedbackIcon />, path: '/feedback' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' }
  ];
  
  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            ⚡ EV Service Intelligence Platform
          </Typography>
          <Button color="inherit" onClick={() => navigate('/create-ticket')}>
            ➕ New Ticket
          </Button>
        </Toolbar>
      </AppBar>
      
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems.map((item) => (
              <ListItem 
                button 
                key={item.text} 
                onClick={() => navigate(item.path)}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  }
                }}
              >
                <ListItemIcon sx={{ color: '#1976d2' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <Box sx={{ p: 2, bgcolor: '#f5f5f5', m: 2, borderRadius: 1 }}>
            <Typography variant="caption" color="textSecondary">
              🔥 System Status
            </Typography>
            <Typography variant="body2" color="success.main">
              ✅ All systems operational
            </Typography>
            <Typography variant="caption" display="block">
              Last updated: Just now
            </Typography>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export { drawerWidth };

export default Navbar;