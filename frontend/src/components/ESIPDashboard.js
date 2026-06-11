import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Chip, Button, Avatar, 
  IconButton, Tooltip, ToggleButtonGroup, ToggleButton, List, ListItem,
  ListItemText, ListItemAvatar, Divider, Paper, LinearProgress, Badge
} from '@mui/material';
import {
  TrendingUp, TrendingDown, Person, Notifications, Settings, MyLocation,
  FilterList, Today, DateRange, CalendarMonth, AllInclusive, Warning,
  CheckCircle, Schedule, Build, LocationOn, Speed, Battery4Bar
} from '@mui/icons-material';
import { LineChart, Line, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Cell, PieChart, Pie } from 'recharts';

const ESIPDashboard = () => {
  const [timeFilter, setTimeFilter] = useState('today');
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  // Mock data
  const sparklineData = [
    { value: 12 }, { value: 19 }, { value: 15 }, { value: 27 }, { value: 32 }, { value: 28 }, { value: 35 }
  ];

  const liveTechnicians = [
    { id: 1, name: 'Raj Kumar', lat: 19.0760, lng: 72.8777, status: 'en_route', eta: '8 min', ticket: 'ECO-2024-001' },
    { id: 2, name: 'Amit Singh', lat: 19.0896, lng: 72.8656, status: 'repairing', eta: '45 min', ticket: 'ECO-2024-002' },
    { id: 3, name: 'Priya Sharma', lat: 19.0728, lng: 72.8826, status: 'delayed', eta: '15 min', ticket: 'ECO-2024-003' }
  ];

  const failureHeatmapData = [
    { component: 'Battery', mon: 5, tue: 3, wed: 8, thu: 2, fri: 6, sat: 4, sun: 1 },
    { component: 'BMS', mon: 2, tue: 4, wed: 1, thu: 7, fri: 3, sat: 2, sun: 5 },
    { component: 'Motor', mon: 3, tue: 2, wed: 5, thu: 1, fri: 4, sat: 6, sun: 2 },
    { component: 'Software', mon: 1, tue: 6, wed: 2, thu: 4, fri: 1, sat: 3, sun: 8 },
    { component: 'Water Damage', mon: 0, tue: 1, wed: 0, thu: 2, fri: 1, sat: 0, sun: 1 }
  ];

  const systemHealth = [
    { name: 'API Gateway', status: 'healthy', uptime: '99.9%', response: '45ms' },
    { name: 'Database', status: 'healthy', uptime: '99.8%', response: '12ms' },
    { name: 'Notification Service', status: 'warning', uptime: '98.2%', response: '156ms' },
    { name: 'GPS Tracking', status: 'healthy', uptime: '99.7%', response: '23ms' }
  ];

  const appleCardStyle = {
    background: 'rgba(255,255,255,0.6)',
    backdropFilter: 'blur(20px)',
    borderRadius: '22px',
    border: '1px solid rgba(255,255,255,0.4)',
    boxShadow: '0 8px 40px rgba(0,0,0,0.06)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 12px 48px rgba(0,0,0,0.1)'
    }
  };

  const getHeatmapColor = (value) => {
    if (value === 0) return '#f8fafc';
    if (value <= 2) return '#dcfce7';
    if (value <= 4) return '#bbf7d0';
    if (value <= 6) return '#86efac';
    return '#ef4444';
  };

  const getTechnicianStatusColor = (status) => {
    const colors = {
      en_route: '#3b82f6',
      repairing: '#f59e0b',
      delayed: '#ef4444',
      available: '#10b981'
    };
    return colors[status] || '#6b7280';
  };

  // Load Leaflet map
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => {
      if (mapRef.current && window.L && !mapInstance.current) {
        try {
          mapInstance.current = window.L.map(mapRef.current).setView([19.0760, 72.8777], 11);
          
          window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(mapInstance.current);
          
          addTechnicianMarkers();
        } catch (error) {
          console.error('Map initialization error:', error);
        }
      }
    };
    document.head.appendChild(script);
  }, []);
  
  const addTechnicianMarkers = () => {
    if (!mapInstance.current || !window.L) return;
    
    liveTechnicians.forEach((tech) => {
      const color = getTechnicianStatusColor(tech.status);
      const icon = window.L.divIcon({
        html: `<div style="background: ${color}; color: white; border-radius: 50%; width: 25px; height: 25px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); font-size: 10px;">${tech.name.split(' ').map(n => n[0]).join('')}</div>`,
        iconSize: [25, 25],
        className: 'custom-marker-icon'
      });
      
      const marker = window.L.marker([tech.lat, tech.lng], { icon })
        .addTo(mapInstance.current);
      
      marker.bindPopup(`<b>${tech.name}</b><br>Status: ${tech.status.replace('_', ' ')}<br>Ticket: ${tech.ticket}<br>ETA: ${tech.eta}`);
    });
  };

  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      minHeight: '100vh',
      p: 3
    }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h3" sx={{ 
            fontWeight: 300, 
            color: '#1e293b',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'
          }}>
            EV Service Intelligence Platform ⚡
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b', mt: 0.5 }}>
            Real-time insights for electric vehicle service operations
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={2}>
          <Badge badgeContent={3} color="error">
            <IconButton sx={{ 
              background: 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(10px)',
              '&:hover': { background: 'rgba(255,255,255,0.9)' }
            }}>
              <Notifications />
            </IconButton>
          </Badge>
          <Avatar sx={{ 
            width: 44, height: 44,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}>
            V
          </Avatar>
        </Box>
      </Box>

      {/* Quick Filters */}
      <Box mb={4}>
        <ToggleButtonGroup
          value={timeFilter}
          exclusive
          onChange={(e, value) => value && setTimeFilter(value)}
          sx={{
            '& .MuiToggleButton-root': {
              border: 'none',
              borderRadius: '16px',
              px: 3,
              py: 1,
              mx: 0.5,
              background: 'rgba(255,255,255,0.6)',
              backdropFilter: 'blur(10px)',
              color: '#64748b',
              '&.Mui-selected': {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }
              }
            }
          }}
        >
          <ToggleButton value="today" startIcon={<Today />}>Today</ToggleButton>
          <ToggleButton value="week" startIcon={<DateRange />}>Last 7 days</ToggleButton>
          <ToggleButton value="month" startIcon={<CalendarMonth />}>This month</ToggleButton>
          <ToggleButton value="all" startIcon={<AllInclusive />}>All</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={appleCardStyle}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Box>
                  <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                    Active Tickets
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 300, color: '#1e293b', mt: 1 }}>
                    24
                  </Typography>
                </Box>
                <Box sx={{ width: 60, height: 30 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sparklineData}>
                      <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </Box>
              <Box display="flex" alignItems="center">
                <TrendingUp sx={{ color: '#10b981', fontSize: 16, mr: 0.5 }} />
                <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 500 }}>
                  +12% from yesterday
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={appleCardStyle}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Box>
                  <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                    SLA Breaches
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 300, color: '#ef4444', mt: 1 }}>
                    3
                  </Typography>
                </Box>
                <Box sx={{ width: 60, height: 30 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sparklineData.map(d => ({ value: d.value - 5 }))}>
                      <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </Box>
              <Box display="flex" alignItems="center">
                <Warning sx={{ color: '#ef4444', fontSize: 16, mr: 0.5 }} />
                <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 500 }}>
                  2 critical alerts
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={appleCardStyle}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Box>
                  <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                    Avg Resolution
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 300, color: '#1e293b', mt: 1 }}>
                    2h 12m
                  </Typography>
                </Box>
                <Box sx={{ width: 60, height: 30 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sparklineData.map(d => ({ value: d.value - 3 }))}>
                      <Line type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </Box>
              <Box display="flex" alignItems="center">
                <TrendingDown sx={{ color: '#10b981', fontSize: 16, mr: 0.5 }} />
                <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 500 }}>
                  15m faster than target
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={appleCardStyle}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Box>
                  <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                    System Health
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 300, color: '#10b981', mt: 1 }}>
                    99.2%
                  </Typography>
                </Box>
                <Box sx={{ width: 60, height: 30 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sparklineData.map(d => ({ value: d.value + 10 }))}>
                      <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </Box>
              <Box display="flex" alignItems="center">
                <CheckCircle sx={{ color: '#10b981', fontSize: 16, mr: 0.5 }} />
                <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 500 }}>
                  All systems operational
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Live Technician Tracking */}
        <Grid item xs={12} md={6}>
          <Card sx={appleCardStyle}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 600, 
                color: '#1e293b', 
                mb: 3,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'
              }}>
                🔵 Live Technician Tracking
              </Typography>
              
              {/* Live Tracking Map */}
              <Box 
                ref={mapRef}
                sx={{ 
                  height: 200, 
                  borderRadius: '16px',
                  position: 'relative',
                  mb: 2,
                  overflow: 'hidden',
                  background: '#f0f8ff'
                }}
              />
                
                {/* Technician Markers */}


              <List sx={{ p: 0 }}>
                {liveTechnicians.map((tech) => (
                  <ListItem key={tech.id} sx={{ px: 0, py: 1 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ 
                        width: 32, height: 32,
                        background: getTechnicianStatusColor(tech.status),
                        fontSize: '12px'
                      }}>
                        {tech.name.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="body2" fontWeight={600}>
                            {tech.name}
                          </Typography>
                          <Chip 
                            label={tech.status.replace('_', ' ')} 
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: '10px',
                              background: `${getTechnicianStatusColor(tech.status)}20`,
                              color: getTechnicianStatusColor(tech.status),
                              border: 'none'
                            }}
                          />
                        </Box>
                      }
                      secondary={
                        <Typography variant="caption" color="#64748b">
                          {tech.ticket} • ETA: {tech.eta}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* System Health + Failure Spikes Heatmap */}
        <Grid item xs={12} md={6}>
          <Card sx={appleCardStyle}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 600, 
                color: '#1e293b', 
                mb: 3,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'
              }}>
                🔥 Failure Spike Heatmap
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Grid container spacing={1}>
                  <Grid item xs={2}>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>
                      Component
                    </Typography>
                  </Grid>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                    <Grid item xs={1.4} key={day}>
                      <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500, fontSize: '10px' }}>
                        {day}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
                
                {failureHeatmapData.map((row) => (
                  <Grid container spacing={1} key={row.component} sx={{ mt: 0.5 }}>
                    <Grid item xs={2}>
                      <Typography variant="caption" sx={{ fontSize: '10px', fontWeight: 500 }}>
                        {row.component}
                      </Typography>
                    </Grid>
                    {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map(day => (
                      <Grid item xs={1.4} key={day}>
                        <Box sx={{
                          width: '100%',
                          height: 20,
                          borderRadius: '4px',
                          background: getHeatmapColor(row[day]),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '10px',
                          fontWeight: 600,
                          color: row[day] > 4 ? 'white' : '#374151'
                        }}>
                          {row[day]}
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                ))}
              </Box>

              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 2, fontSize: '14px' }}>
                System Health Status
              </Typography>
              
              {systemHealth.map((service) => (
                <Box key={service.name} display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Box display="flex" alignItems="center">
                    <Box sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: service.status === 'healthy' ? '#10b981' : '#f59e0b',
                      mr: 1
                    }} />
                    <Typography variant="body2" sx={{ fontSize: '12px' }}>
                      {service.name}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ color: '#64748b', fontSize: '10px' }}>
                      {service.uptime}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', fontSize: '10px' }}>
                      {service.response}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ESIPDashboard;