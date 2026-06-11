import React, { useState } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Chip, Avatar, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, LinearProgress, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, MenuItem, List, ListItem, ListItemText,
  ListItemAvatar, Divider, Alert, Badge
} from '@mui/material';
import {
  Person as PersonIcon, Star as StarIcon, Schedule as ScheduleIcon,
  Assignment as AssignmentIcon, Phone as PhoneIcon, Email as EmailIcon,
  Work as WorkIcon, TrendingUp as TrendingUpIcon, Warning as WarningIcon
} from '@mui/icons-material';

const Technicians = () => {
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const technicians = [
    {
      id: 1, name: 'Amit Singh', phone: '+91-9876543220', email: 'amit.singh@ola.com',
      skills: ['Battery', 'Motor', 'Software'], experience: '5 years', rating: 4.6,
      status: 'available', currentTickets: 3, maxCapacity: 5, completedToday: 2,
      avgResolutionTime: '2h 15m', successRate: 94, delayedTickets: 2,
      workload: 60, location: 'Mumbai Central', shift: '9 AM - 6 PM',
      performance: { thisMonth: 45, lastMonth: 42, target: 50 }
    },
    {
      id: 2, name: 'Raj Kumar', phone: '+91-9876543221', email: 'raj.kumar@ola.com',
      skills: ['Motor', 'General', 'Electrical'], experience: '3 years', rating: 4.8,
      status: 'on_duty', currentTickets: 2, maxCapacity: 4, completedToday: 3,
      avgResolutionTime: '1h 45m', successRate: 97, delayedTickets: 0,
      workload: 50, location: 'Mumbai East', shift: '10 AM - 7 PM',
      performance: { thisMonth: 38, lastMonth: 35, target: 40 }
    },
    {
      id: 3, name: 'Priya Sharma', phone: '+91-9876543222', email: 'priya.sharma@ola.com',
      skills: ['Software', 'Battery', 'General'], experience: '4 years', rating: 4.4,
      status: 'on_break', currentTickets: 4, maxCapacity: 6, completedToday: 1,
      avgResolutionTime: '2h 30m', successRate: 89, delayedTickets: 3,
      workload: 67, location: 'Mumbai West', shift: '8 AM - 5 PM',
      performance: { thisMonth: 32, lastMonth: 38, target: 45 }
    },
    {
      id: 4, name: 'Vikash Yadav', phone: '+91-9876543223', email: 'vikash.yadav@ola.com',
      skills: ['Battery', 'Charging'], experience: '2 years', rating: 4.2,
      status: 'on_ticket', currentTickets: 1, maxCapacity: 3, completedToday: 4,
      avgResolutionTime: '3h 10m', successRate: 85, delayedTickets: 1,
      workload: 33, location: 'Mumbai South', shift: '11 AM - 8 PM',
      performance: { thisMonth: 28, lastMonth: 25, target: 30 }
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      available: 'success', on_duty: 'primary', on_break: 'warning', on_ticket: 'info'
    };
    return colors[status] || 'default';
  };

  const getWorkloadColor = (workload) => {
    if (workload >= 80) return 'error';
    if (workload >= 60) return 'warning';
    return 'success';
  };

  const handleViewTechnician = (technician) => {
    setSelectedTechnician(technician);
    setOpenDialog(true);
  };

  const availableTechnicians = technicians.filter(t => t.status === 'available').length;
  const overloadedTechnicians = technicians.filter(t => t.workload >= 80).length;
  const avgRating = (technicians.reduce((sum, t) => sum + t.rating, 0) / technicians.length).toFixed(1);

  return (
    <Box>
      <Typography variant="h4" mb={3}>👨🔧 Technician Management</Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#e8f5e8' }}>
            <CardContent>
              <Typography color="textSecondary">Available Technicians</Typography>
              <Typography variant="h4">{availableTechnicians}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#e3f2fd' }}>
            <CardContent>
              <Typography color="textSecondary">Total Technicians</Typography>
              <Typography variant="h4">{technicians.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#fff3e0' }}>
            <CardContent>
              <Typography color="textSecondary">Average Rating</Typography>
              <Typography variant="h4">{avgRating} ⭐</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#ffebee' }}>
            <CardContent>
              <Typography color="textSecondary">Overloaded</Typography>
              <Typography variant="h4" color="error">{overloadedTechnicians}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Alerts */}
      {overloadedTechnicians > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }} icon={<WarningIcon />}>
          <Typography variant="h6">⚠️ Workload Alert</Typography>
          <Typography>{overloadedTechnicians} technician(s) are overloaded. Consider redistributing tickets.</Typography>
        </Alert>
      )}

      {/* Technicians Grid */}
      <Grid container spacing={3} mb={3}>
        {technicians.map((technician) => (
          <Grid item xs={12} md={6} lg={4} key={technician.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar sx={{ mr: 2, bgcolor: getStatusColor(technician.status) === 'success' ? 'success.main' : 'warning.main' }}>
                    {technician.name.split(' ').map(n => n[0]).join('')}
                  </Avatar>
                  <Box flex={1}>
                    <Typography variant="h6">{technician.name}</Typography>
                    <Chip 
                      label={technician.status.replace('_', ' ')} 
                      color={getStatusColor(technician.status)} 
                      size="small" 
                    />
                  </Box>
                  <Badge badgeContent={technician.currentTickets} color="primary">
                    <AssignmentIcon />
                  </Badge>
                </Box>

                <Box mb={2}>
                  <Typography variant="body2" color="textSecondary">📍 {technician.location}</Typography>
                  <Typography variant="body2" color="textSecondary">🕒 {technician.shift}</Typography>
                  <Typography variant="body2" color="textSecondary">📞 {technician.phone}</Typography>
                </Box>

                <Box mb={2}>
                  <Typography variant="body2" mb={1}>Skills:</Typography>
                  <Box display="flex" flexWrap="wrap" gap={0.5}>
                    {technician.skills.map((skill) => (
                      <Chip key={skill} label={skill} size="small" variant="outlined" />
                    ))}
                  </Box>
                </Box>

                <Box mb={2}>
                  <Box display="flex" justifyContent="space-between" mb={0.5}>
                    <Typography variant="body2">Workload</Typography>
                    <Typography variant="body2">{technician.workload}%</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={technician.workload} 
                    color={getWorkloadColor(technician.workload)}
                  />
                </Box>

                <Grid container spacing={1} mb={2}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary">Rating</Typography>
                    <Typography variant="body2">⭐ {technician.rating}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary">Success Rate</Typography>
                    <Typography variant="body2">{technician.successRate}%</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary">Avg Time</Typography>
                    <Typography variant="body2">{technician.avgResolutionTime}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary">Completed Today</Typography>
                    <Typography variant="body2">{technician.completedToday}</Typography>
                  </Grid>
                </Grid>

                <Button 
                  fullWidth 
                  variant="outlined" 
                  onClick={() => handleViewTechnician(technician)}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Performance Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" mb={2}>📊 Performance Overview</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Technician</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Current Load</TableCell>
                  <TableCell>This Month</TableCell>
                  <TableCell>Success Rate</TableCell>
                  <TableCell>Avg Time</TableCell>
                  <TableCell>Delayed</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {technicians.map((tech) => (
                  <TableRow key={tech.id}>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar sx={{ mr: 2, width: 32, height: 32 }}>
                          {tech.name.split(' ').map(n => n[0]).join('')}
                        </Avatar>
                        <Box>
                          <Typography variant="body2">{tech.name}</Typography>
                          <Typography variant="caption" color="textSecondary">{tech.experience}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={tech.status.replace('_', ' ')} color={getStatusColor(tech.status)} size="small" />
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">{tech.currentTickets}/{tech.maxCapacity}</Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={(tech.currentTickets / tech.maxCapacity) * 100} 
                          sx={{ width: 60 }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{tech.performance.thisMonth}/{tech.performance.target}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color={tech.successRate >= 90 ? 'success.main' : 'warning.main'}>
                        {tech.successRate}%
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{tech.avgResolutionTime}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color={tech.delayedTickets > 0 ? 'error.main' : 'success.main'}>
                        {tech.delayedTickets}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Technician Detail Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <Avatar sx={{ mr: 2 }}>
              {selectedTechnician?.name.split(' ').map(n => n[0]).join('')}
            </Avatar>
            <Box>
              <Typography variant="h6">{selectedTechnician?.name}</Typography>
              <Chip 
                label={selectedTechnician?.status.replace('_', ' ')} 
                color={getStatusColor(selectedTechnician?.status)} 
                size="small" 
              />
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedTechnician && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" mb={2}>👤 Personal Information</Typography>
                <Typography>📞 {selectedTechnician.phone}</Typography>
                <Typography>📧 {selectedTechnician.email}</Typography>
                <Typography>🎓 Experience: {selectedTechnician.experience}</Typography>
                <Typography>📍 Location: {selectedTechnician.location}</Typography>
                <Typography>🕒 Shift: {selectedTechnician.shift}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" mb={2}>📊 Performance Metrics</Typography>
                <Typography>⭐ Rating: {selectedTechnician.rating}/5</Typography>
                <Typography>✅ Success Rate: {selectedTechnician.successRate}%</Typography>
                <Typography>⏱️ Avg Resolution: {selectedTechnician.avgResolutionTime}</Typography>
                <Typography>🎯 This Month: {selectedTechnician.performance.thisMonth}/{selectedTechnician.performance.target}</Typography>
                <Typography color={selectedTechnician.delayedTickets > 0 ? 'error' : 'success'}>
                  ⚠️ Delayed Tickets: {selectedTechnician.delayedTickets}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" mb={2}>🛠️ Skills & Expertise</Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {selectedTechnician.skills.map((skill) => (
                    <Chip key={skill} label={skill} color="primary" />
                  ))}
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
          <Button variant="contained">Assign Ticket</Button>
          <Button variant="outlined">Edit Profile</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Technicians;