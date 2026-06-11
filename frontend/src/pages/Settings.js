import React, { useState } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, TextField, Button, Switch,
  FormControlLabel, Tabs, Tab, List, ListItem, ListItemText, ListItemSecondaryAction,
  Chip, Divider
} from '@mui/material';

const Settings = () => {
  const [tabValue, setTabValue] = useState(0);
  const [settings, setSettings] = useState({
    slaAssignTime: 15,
    slaResponseTime: 30,
    slaArrivalTime: 120,
    slaServiceTime: 240,
    autoAssign: true,
    emailNotifications: true,
    smsNotifications: true,
    workingHoursStart: '09:00',
    workingHoursEnd: '18:00'
  });

  const users = [
    { id: 1, name: 'Admin User', email: 'admin@ola.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Amit Singh', email: 'amit@ola.com', role: 'Technician', status: 'Active' },
    { id: 3, name: 'Support Agent', email: 'support@ola.com', role: 'Support', status: 'Active' }
  ];

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Box>
      <Typography variant="h4" mb={3}>⚙️ System Settings</Typography>
      
      <Card>
        <CardContent>
          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 3 }}>
            <Tab label="SLA Configuration" />
            <Tab label="User Management" />
            <Tab label="System Config" />
            <Tab label="Data Management" />
          </Tabs>

          {tabValue === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" mb={2}>⏱️ SLA Time Limits (minutes)</Typography>
                <TextField
                  fullWidth
                  label="Ticket Assignment Time"
                  type="number"
                  value={settings.slaAssignTime}
                  onChange={(e) => handleSettingChange('slaAssignTime', e.target.value)}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Response Time"
                  type="number"
                  value={settings.slaResponseTime}
                  onChange={(e) => handleSettingChange('slaResponseTime', e.target.value)}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Arrival Time"
                  type="number"
                  value={settings.slaArrivalTime}
                  onChange={(e) => handleSettingChange('slaArrivalTime', e.target.value)}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Service Completion Time"
                  type="number"
                  value={settings.slaServiceTime}
                  onChange={(e) => handleSettingChange('slaServiceTime', e.target.value)}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" mb={2}>🔄 Auto-Assignment Rules</Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.autoAssign}
                      onChange={(e) => handleSettingChange('autoAssign', e.target.checked)}
                    />
                  }
                  label="Enable Auto-Assignment"
                />
                <Typography variant="body2" color="textSecondary" mt={2}>
                  When enabled, tickets will be automatically assigned to available technicians based on:
                </Typography>
                <List dense>
                  <ListItem>• Technician skills and expertise</ListItem>
                  <ListItem>• Current workload</ListItem>
                  <ListItem>• Geographic proximity</ListItem>
                  <ListItem>• Priority level of the ticket</ListItem>
                </List>
              </Grid>
            </Grid>
          )}

          {tabValue === 1 && (
            <Box>
              <Typography variant="h6" mb={2}>👥 User Management</Typography>
              <List>
                {users.map((user) => (
                  <ListItem key={user.id} divider>
                    <ListItemText
                      primary={user.name}
                      secondary={`${user.email} • ${user.role}`}
                    />
                    <ListItemSecondaryAction>
                      <Chip 
                        label={user.status} 
                        color={user.status === 'Active' ? 'success' : 'default'} 
                        size="small" 
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
              <Button variant="contained" sx={{ mt: 2 }}>
                Add New User
              </Button>
            </Box>
          )}

          {tabValue === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" mb={2}>📧 Notification Settings</Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.emailNotifications}
                      onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                    />
                  }
                  label="Email Notifications"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.smsNotifications}
                      onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
                    />
                  }
                  label="SMS Notifications"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" mb={2}>🕒 Working Hours</Typography>
                <TextField
                  fullWidth
                  label="Start Time"
                  type="time"
                  value={settings.workingHoursStart}
                  onChange={(e) => handleSettingChange('workingHoursStart', e.target.value)}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="End Time"
                  type="time"
                  value={settings.workingHoursEnd}
                  onChange={(e) => handleSettingChange('workingHoursEnd', e.target.value)}
                  margin="normal"
                />
              </Grid>
            </Grid>
          )}

          {tabValue === 3 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" mb={2}>💾 Data Management</Typography>
                <Button variant="outlined" fullWidth sx={{ mb: 2 }}>
                  📥 Export Data (CSV)
                </Button>
                <Button variant="outlined" fullWidth sx={{ mb: 2 }}>
                  🔄 Backup Database
                </Button>
                <Button variant="outlined" fullWidth sx={{ mb: 2 }}>
                  📋 View System Logs
                </Button>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" mb={2}>📊 System Status</Typography>
                <List>
                  <ListItem>
                    <ListItemText primary="Database Status" />
                    <Chip label="Online" color="success" size="small" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Redis Cache" />
                    <Chip label="Online" color="success" size="small" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Notification Service" />
                    <Chip label="Online" color="success" size="small" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Last Backup" />
                    <Typography variant="body2">2024-01-15 03:00 AM</Typography>
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          )}

          <Divider sx={{ my: 3 }} />
          <Button variant="contained" sx={{ mr: 2 }}>
            Save Settings
          </Button>
          <Button variant="outlined">
            Reset to Defaults
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Settings;