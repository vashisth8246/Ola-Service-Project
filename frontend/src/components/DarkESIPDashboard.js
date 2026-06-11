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

const DarkESIPDashboard = () => {
  const [timeFilter, setTimeFilter] = useState('today');
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  const sparklineData = [
    { value: 12 }, { value: 19 }, { value: 15 }, { value: 27 }, { value: 32 }, { value: 28 }, { value: 35 }
  ];

  const liveTechnicians = [
    { id: 1, name: 'Raj Kumar', lat: 19.0760, lng: 72.8777, status: 'en_route', eta: '8 min', ticket: 'ECO-2024-001' },
    { id: 2, name: 'Amit Singh', lat: 19.0896, lng: 72.8656, status: 'repairing', eta: '45 min', ticket: 'ECO-2024-002' },
    { id: 3, name: 'Priya Sharma', lat: 19.0728, lng: 72.8826, status: 'delayed', eta: '15 min', ticket: 'ECO-2024-003' }
  ];

  const neoPopCardStyle = {
    background: 'rgba(255,255,255,0.02)',
    backdropFilter: 'blur(20px)',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05), 4px 4px 0 rgba(0,255,135,0.1)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    '&:hover': {
      transform: 'translateY(-4px) translateX(-2px)',
      boxShadow: '0 16px 48px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1), 8px 8px 0 rgba(0,255,135,0.2)',
      borderColor: 'rgba(0,255,135,0.3)'
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: '16px',
      background: 'linear-gradient(135deg, rgba(0,255,135,0.02) 0%, rgba(255,0,135,0.02) 100%)',
      pointerEvents: 'none'
    }
  };

  const getTechnicianStatusColor = (status) => {
    const colors = {
      en_route: '#00D4FF',
      repairing: '#FFD700',
      delayed: '#FF0087',
      available: '#00FF87'
    };
    return colors[status] || '#888888';
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => {
      if (mapRef.current && window.L && !mapInstance.current) {
        try {
          mapInstance.current = window.L.map(mapRef.current).setView([19.0760, 72.8777], 11);
          
          window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
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
        html: `<div style="background: ${color}; color: #0F0F0F; border-radius: 50%; width: 25px; height: 25px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid #0F0F0F; box-shadow: 0 0 15px ${color}; font-size: 10px;">${tech.name.split(' ').map(n => n[0]).join('')}</div>`,
        iconSize: [25, 25],
        className: 'custom-marker-icon'
      });
      
      const marker = window.L.marker([tech.lat, tech.lng], { icon })
        .addTo(mapInstance.current);
      
      marker.bindPopup(`<div style="background: #0F0F0F; color: #EAEAEA; padding: 10px; border-radius: 8px; border: 1px solid rgba(0,255,135,0.3);"><b>${tech.name}</b><br>Status: ${tech.status.replace('_', ' ')}<br>Ticket: ${tech.ticket}<br>ETA: ${tech.eta}</div>`);
    });
  };

  return (
    <Box sx={{ 
      background: '#0F0F0F',
      minHeight: '100vh',
      p: 3,
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 80%, rgba(0, 255, 135, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 0, 135, 0.03) 0%, transparent 50%)',
        pointerEvents: 'none'
      }
    }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h3" sx={{ 
            fontWeight: 700, 
            color: '#EAEAEA',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            textShadow: '0 0 20px rgba(0, 255, 135, 0.3)',
            letterSpacing: '-0.02em'
          }}>
            EV Service Intelligence Platform ⚡
          </Typography>
          <Typography variant="body1" sx={{ color: '#888888', mt: 0.5, fontWeight: 400 }}>
            Real-time insights for electric vehicle service operations
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={2}>
          <Badge badgeContent={3} sx={{ '& .MuiBadge-badge': { background: '#00FF87', color: '#0F0F0F' } }}>
            <IconButton sx={{ 
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#EAEAEA',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
              '&:hover': { 
                background: 'rgba(0,255,135,0.1)',
                boxShadow: '0 6px 20px rgba(0,255,135,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
                transform: 'translateY(-1px)'
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
              <Notifications />
            </IconButton>
          </Badge>
          <Avatar sx={{ 
            width: 44, height: 44,
            background: 'linear-gradient(135deg, #00FF87 0%, #FF0087 100%)',
            color: '#0F0F0F',
            fontWeight: 700,
            boxShadow: '0 4px 12px rgba(0,255,135,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
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
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              px: 3,
              py: 1,
              mx: 0.5,
              background: 'rgba(255,255,255,0.03)',
              color: '#888888',
              fontWeight: 500,
              boxShadow: '0 2px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                background: 'rgba(0,255,135,0.05)',
                borderColor: 'rgba(0,255,135,0.3)',
                transform: 'translateY(-1px)'
              },
              '&.Mui-selected': {
                background: 'linear-gradient(135deg, #00FF87 0%, #00D4FF 100%)',
                color: '#0F0F0F',
                fontWeight: 700,
                borderColor: 'transparent',
                boxShadow: '0 4px 16px rgba(0,255,135,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #00FF87 0%, #00D4FF 100%)',
                  transform: 'translateY(-2px)'
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
          <Card sx={neoPopCardStyle}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Box>
                  <Typography variant="body2" sx={{ color: '#888888', fontWeight: 500, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Active Tickets
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: '#EAEAEA', mt: 1, textShadow: '0 0 20px rgba(0,255,135,0.3)' }}>
                    24
                  </Typography>
                </Box>
                <Box sx={{ width: 60, height: 30 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sparklineData}>
                      <Line type="monotone" dataKey="value" stroke="#00FF87" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </Box>
              <Box display="flex" alignItems="center">
                <TrendingUp sx={{ color: '#00FF87', fontSize: 16, mr: 0.5 }} />
                <Typography variant="caption" sx={{ color: '#00FF87', fontWeight: 600, fontSize: '11px' }}>
                  +12% from yesterday
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={neoPopCardStyle}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Box>
                  <Typography variant="body2" sx={{ color: '#888888', fontWeight: 500, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    SLA Breaches
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: '#FF0087', mt: 1, textShadow: '0 0 20px rgba(255,0,135,0.4)' }}>
                    3
                  </Typography>
                </Box>
                <Box sx={{ width: 60, height: 30 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sparklineData.map(d => ({ value: d.value - 5 }))}>
                      <Line type="monotone" dataKey="value" stroke="#FF0087" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </Box>
              <Box display="flex" alignItems="center">
                <Warning sx={{ color: '#FF0087', fontSize: 16, mr: 0.5 }} />
                <Typography variant="caption" sx={{ color: '#FF0087', fontWeight: 600, fontSize: '11px' }}>
                  2 critical alerts
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={neoPopCardStyle}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Box>
                  <Typography variant="body2" sx={{ color: '#888888', fontWeight: 500, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Avg Resolution
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: '#EAEAEA', mt: 1, textShadow: '0 0 20px rgba(0,212,255,0.3)' }}>
                    2h 12m
                  </Typography>
                </Box>
                <Box sx={{ width: 60, height: 30 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sparklineData.map(d => ({ value: d.value - 3 }))}>
                      <Line type="monotone" dataKey="value" stroke="#00D4FF" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </Box>
              <Box display="flex" alignItems="center">
                <TrendingDown sx={{ color: '#00D4FF', fontSize: 16, mr: 0.5 }} />
                <Typography variant="caption" sx={{ color: '#00D4FF', fontWeight: 600, fontSize: '11px' }}>
                  15m faster than target
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={neoPopCardStyle}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Box>
                  <Typography variant="body2" sx={{ color: '#888888', fontWeight: 500, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    System Health
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: '#00FF87', mt: 1, textShadow: '0 0 20px rgba(0,255,135,0.4)' }}>
                    99.2%
                  </Typography>
                </Box>
                <Box sx={{ width: 60, height: 30 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sparklineData.map(d => ({ value: d.value + 10 }))}>
                      <Line type="monotone" dataKey="value" stroke="#00FF87" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </Box>
              <Box display="flex" alignItems="center">
                <CheckCircle sx={{ color: '#00FF87', fontSize: 16, mr: 0.5 }} />
                <Typography variant="caption" sx={{ color: '#00FF87', fontWeight: 600, fontSize: '11px' }}>
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
          <Card sx={neoPopCardStyle}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 700, 
                color: '#EAEAEA', 
                mb: 3,
                fontFamily: 'Inter, sans-serif',
                textShadow: '0 0 10px rgba(0,255,135,0.3)',
                fontSize: '18px'
              }}>
                🔵 Live Technician Tracking
              </Typography>
              
              <Box 
                ref={mapRef}
                sx={{ 
                  height: 200, 
                  borderRadius: '16px',
                  position: 'relative',
                  mb: 2,
                  overflow: 'hidden',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
              />

              <List sx={{ p: 0 }}>
                {liveTechnicians.map((tech) => (
                  <ListItem key={tech.id} sx={{ px: 0, py: 1 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ 
                        width: 32, height: 32,
                        background: getTechnicianStatusColor(tech.status),
                        fontSize: '12px',
                        color: '#0F0F0F',
                        fontWeight: 700
                      }}>
                        {tech.name.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="body2" fontWeight={600} sx={{ color: '#EAEAEA' }}>
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
                        <Typography variant="caption" sx={{ color: '#888888' }}>
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

        {/* System Health */}
        <Grid item xs={12} md={6}>
          <Card sx={neoPopCardStyle}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 700, 
                color: '#EAEAEA', 
                mb: 3,
                fontFamily: 'Inter, sans-serif',
                textShadow: '0 0 10px rgba(255,0,135,0.3)',
                fontSize: '18px'
              }}>
                🔥 System Health Monitor
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                {[
                  { name: 'API Gateway', status: 'healthy', uptime: '99.9%', response: '45ms' },
                  { name: 'Database', status: 'healthy', uptime: '99.8%', response: '12ms' },
                  { name: 'Notification Service', status: 'warning', uptime: '98.2%', response: '156ms' },
                  { name: 'GPS Tracking', status: 'healthy', uptime: '99.7%', response: '23ms' }
                ].map((service) => (
                  <Box key={service.name} display="flex" justifyContent="space-between" alignItems="center" mb={2} p={2} sx={{ background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <Box display="flex" alignItems="center">
                      <Box sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: service.status === 'healthy' ? '#00FF87' : '#FFD700',
                        mr: 2,
                        boxShadow: `0 0 8px ${service.status === 'healthy' ? '#00FF87' : '#FFD700'}`
                      }} />
                      <Typography variant="body2" sx={{ fontSize: '14px', color: '#EAEAEA', fontWeight: 500 }}>
                        {service.name}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Typography variant="caption" sx={{ color: '#888888', fontSize: '12px' }}>
                        {service.uptime}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#888888', fontSize: '12px' }}>
                        {service.response}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DarkESIPDashboard;