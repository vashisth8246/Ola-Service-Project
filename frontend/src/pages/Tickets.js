import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Chip, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, TextField, MenuItem, Dialog, DialogTitle,
  DialogContent, DialogActions, LinearProgress, Avatar, Stepper, Step, StepLabel,
  Alert, Badge, IconButton, Tabs, Tab
} from '@mui/material';
import {
  Add as AddIcon, Visibility as ViewIcon, Edit as EditIcon, Warning as WarningIcon,
  Schedule as ScheduleIcon, CheckCircle as CheckIcon, Cancel as CancelIcon,
  Assignment as AssignIcon, Photo as PhotoIcon, Edit as SignatureIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Tickets = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [filters, setFilters] = useState({ status: 'all', issue: 'all', sla: 'all' });

  // Mock data
  const mockTickets = [
    {
      id: 1, ticketNumber: 'ECO-2024-001', customer: 'Rahul Sharma', phone: '+91-9876543210',
      model: 'EcoRide E1 Pro', issue: 'Battery Issues', status: 'in_progress', priority: 'high',
      technician: 'Amit Singh', created: '2024-01-15T09:00:00', eta: '2h 30m', slaStatus: 'on_track',
      timeline: [
        { step: 'Created', time: '09:00 AM', status: 'completed' },
        { step: 'Assigned', time: '09:15 AM', status: 'completed' },
        { step: 'Diagnosed', time: '10:30 AM', status: 'completed' },
        { step: 'Parts Requested', time: '11:00 AM', status: 'completed' },
        { step: 'Repair Started', time: '12:00 PM', status: 'active' },
        { step: 'Completed', time: 'Pending', status: 'pending' }
      ]
    },
    {
      id: 2, ticketNumber: 'ECO-2024-002', customer: 'Priya Patel', phone: '+91-9876543211',
      model: 'EcoRide E1', issue: 'Motor Issues', status: 'awaiting_parts', priority: 'medium',
      technician: 'Raj Kumar', created: '2024-01-15T10:30:00', eta: '4h 15m', slaStatus: 'breach',
      timeline: [
        { step: 'Created', time: '10:30 AM', status: 'completed' },
        { step: 'Assigned', time: '10:45 AM', status: 'completed' },
        { step: 'Diagnosed', time: '11:30 AM', status: 'completed' },
        { step: 'Parts Requested', time: '12:00 PM', status: 'active' },
        { step: 'Repair Started', time: 'Pending', status: 'pending' },
        { step: 'Completed', time: 'Pending', status: 'pending' }
      ]
    }
  ];

  useEffect(() => {
    setTickets(mockTickets);
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      open: 'warning', assigned: 'info', in_progress: 'primary',
      awaiting_parts: 'warning', completed: 'success', cancelled: 'error'
    };
    return colors[status] || 'default';
  };

  const getPriorityColor = (priority) => {
    const colors = { high: 'error', medium: 'warning', low: 'success' };
    return colors[priority] || 'default';
  };

  const getSLAColor = (slaStatus) => {
    const colors = { on_track: 'success', at_risk: 'warning', breach: 'error' };
    return colors[slaStatus] || 'default';
  };

  const filteredTickets = tickets.filter(ticket => {
    return (filters.status === 'all' || ticket.status === filters.status) &&
           (filters.issue === 'all' || ticket.issue === filters.issue) &&
           (filters.sla === 'all' || ticket.slaStatus === filters.sla);
  });

  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setOpenDialog(true);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">🎫 Service Tickets Management</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/create-ticket')}>
          Create New Ticket
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#e3f2fd' }}>
            <CardContent>
              <Typography color="textSecondary">Total Tickets</Typography>
              <Typography variant="h4">{tickets.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#fff3e0' }}>
            <CardContent>
              <Typography color="textSecondary">In Progress</Typography>
              <Typography variant="h4">{tickets.filter(t => t.status === 'in_progress').length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#e8f5e8' }}>
            <CardContent>
              <Typography color="textSecondary">Completed Today</Typography>
              <Typography variant="h4">{tickets.filter(t => t.status === 'completed').length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#ffebee' }}>
            <CardContent>
              <Typography color="textSecondary">SLA Breaches</Typography>
              <Typography variant="h4" color="error">{tickets.filter(t => t.slaStatus === 'breach').length}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" mb={2}>🔍 Filters</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                select fullWidth label="Status" value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="open">Open</MenuItem>
                <MenuItem value="assigned">Assigned</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="awaiting_parts">Awaiting Parts</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                select fullWidth label="Issue Type" value={filters.issue}
                onChange={(e) => setFilters({...filters, issue: e.target.value})}
              >
                <MenuItem value="all">All Issues</MenuItem>
                <MenuItem value="Battery Issues">Battery Issues</MenuItem>
                <MenuItem value="Motor Issues">Motor Issues</MenuItem>
                <MenuItem value="Software Issues">Software Issues</MenuItem>
                <MenuItem value="Charging Problems">Charging Problems</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                select fullWidth label="SLA Status" value={filters.sla}
                onChange={(e) => setFilters({...filters, sla: e.target.value})}
              >
                <MenuItem value="all">All SLA</MenuItem>
                <MenuItem value="on_track">On Track</MenuItem>
                <MenuItem value="at_risk">At Risk</MenuItem>
                <MenuItem value="breach">SLA Breach</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tickets Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" mb={2}>📋 All Tickets</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ticket #</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Issue</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Technician</TableCell>
                  <TableCell>SLA</TableCell>
                  <TableCell>ETA</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell>
                      <Typography fontWeight="bold">{ticket.ticketNumber}</Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">{ticket.customer}</Typography>
                        <Typography variant="caption" color="textSecondary">{ticket.phone}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">{ticket.issue}</Typography>
                        <Typography variant="caption" color="textSecondary">{ticket.model}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={ticket.status.replace('_', ' ')} color={getStatusColor(ticket.status)} size="small" />
                    </TableCell>
                    <TableCell>
                      <Chip label={ticket.priority} color={getPriorityColor(ticket.priority)} size="small" />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar sx={{ width: 24, height: 24, mr: 1, fontSize: 12 }}>
                          {ticket.technician?.split(' ').map(n => n[0]).join('')}
                        </Avatar>
                        <Typography variant="body2">{ticket.technician}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Badge badgeContent={ticket.slaStatus === 'breach' ? '!' : null} color="error">
                        <Chip label={ticket.slaStatus.replace('_', ' ')} color={getSLAColor(ticket.slaStatus)} size="small" />
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{ticket.eta}</Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleViewTicket(ticket)} size="small">
                        <ViewIcon />
                      </IconButton>
                      <IconButton size="small">
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small">
                        <AssignIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Ticket Detail Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">🎫 {selectedTicket?.ticketNumber}</Typography>
            <Chip label={selectedTicket?.status.replace('_', ' ')} color={getStatusColor(selectedTicket?.status)} />
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedTicket && (
            <Box>
              <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 2 }}>
                <Tab label="Details" />
                <Tab label="Timeline" />
                <Tab label="Media" />
              </Tabs>

              {tabValue === 0 && (
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2">Customer Information</Typography>
                    <Typography>👤 {selectedTicket.customer}</Typography>
                    <Typography>📞 {selectedTicket.phone}</Typography>
                    <Typography>🛵 {selectedTicket.model}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2">Service Information</Typography>
                    <Typography>🔧 {selectedTicket.issue}</Typography>
                    <Typography>👨‍🔧 {selectedTicket.technician}</Typography>
                    <Typography>⏰ ETA: {selectedTicket.eta}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Alert severity={selectedTicket.slaStatus === 'breach' ? 'error' : 'info'}>
                      SLA Status: {selectedTicket.slaStatus.replace('_', ' ')}
                    </Alert>
                  </Grid>
                </Grid>
              )}

              {tabValue === 1 && (
                <Box>
                  <Typography variant="h6" mb={2}>📅 Service Timeline</Typography>
                  <Stepper orientation="vertical">
                    {selectedTicket.timeline.map((step, index) => (
                      <Step key={index} active={step.status === 'active'} completed={step.status === 'completed'}>
                        <StepLabel>
                          <Box>
                            <Typography>{step.step}</Typography>
                            <Typography variant="caption" color="textSecondary">{step.time}</Typography>
                          </Box>
                        </StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </Box>
              )}

              {tabValue === 2 && (
                <Box textAlign="center" py={4}>
                  <PhotoIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                  <Typography variant="h6" color="textSecondary">📸 Media Upload</Typography>
                  <Typography variant="body2" color="textSecondary" mb={2}>
                    Upload damage photos, repair videos, or customer signature
                  </Typography>
                  <Button variant="outlined" startIcon={<PhotoIcon />} sx={{ mr: 1 }}>
                    Upload Photos
                  </Button>
                  <Button variant="outlined" startIcon={<SignatureIcon />}>
                    Customer Signature
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
          <Button variant="contained">Update Status</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Tickets;