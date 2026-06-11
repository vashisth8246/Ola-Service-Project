import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Chip, Button, Avatar, 
  IconButton, Tooltip, ToggleButtonGroup, ToggleButton, List, ListItem,
  ListItemText, ListItemAvatar, Badge, Switch, FormControlLabel, Select,
  MenuItem, FormControl, InputLabel, Fade, Slide, Grow
} from '@mui/material';
import {
  TrendingUp, TrendingDown, Notifications, Today, DateRange, CalendarMonth, 
  AllInclusive, Warning, CheckCircle, SmartToy, DarkMode, LightMode,
  FilterList, LocationOn, DirectionsCar, Engineering
} from '@mui/icons-material';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const PremiumESIPDashboard = () => {
  const [timeFilter, setTimeFilter] = useState('today');
  const [darkMode, setDarkMode] = useState(false);
  const [region, setRegion] = useState('all');
  const [vehicleModel, setVehicleModel] = useState('all');
  const [technicianType, setTechnicianType] = useState('all');
  const [showAI, setShowAI] = useState(false);
  const [animateCards, setAnimateCards] = useState(false);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  const sparklineData = [
    { value: 12 }, { value: 19 }, { value: 15 }, { value: 27 }, { value: 32 }, { value: 28 }, { value: 35 }
  ];

  const liveTechnicians = [
    { id: 1, name: 'Raj Kumar', lat: 19.0760, lng: 72.8777, status: 'en_route', eta: '8 min', ticket: 'ECO-2024-001', region: 'mumbai', type: 'senior' },
    { id: 2, name: 'Amit Singh', lat: 19.0896, lng: 72.8656, status: 'repairing', eta: '45 min', ticket: 'ECO-2024-002', region: 'mumbai', type: 'junior' },
    { id: 3, name: 'Priya Sharma', lat: 19.0728, lng: 72.8826, status: 'delayed', eta: '15 min', ticket: 'ECO-2024-003', region: 'pune', type: 'senior' }
  ];

  useEffect(() => {
    setAnimateCards(true);
    loadMap();
  }, []);

  const loadMap = () => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => {
      if (mapRef.current && window.L && !mapInstance.current) {
        mapInstance.current = window.L.map(mapRef.current).setView([19.0760, 72.8777], 11);
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapInstance.current);
        addTechnicianMarkers();
      }
    };
    document.head.appendChild(script);
  };

  const addTechnicianMarkers = () => {
    if (!mapInstance.current || !window.L) return;
    
    liveTechnicians.forEach((tech) => {
      const colors = { en_route: '#3b82f6', repairing: '#f59e0b', delayed: '#ef4444' };
      const color = colors[tech.status];
      const icon = window.L.divIcon({
        html: `<div style="background: ${color}; color: white; border-radius: 50%; width: 25px; height: 25px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); font-size: 10px;">${tech.name.split(' ').map(n => n[0]).join('')}</div>`,
        iconSize: [25, 25]
      });
      window.L.marker([tech.lat, tech.lng], { icon }).addTo(mapInstance.current)
        .bindPopup(`<b>${tech.name}</b><br>Status: ${tech.status}<br>ETA: ${tech.eta}`);
    });
  };

  const theme = {
    background: darkMode ? '#0F0F0F' : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
    cardBg: darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.8)',
    cardBorder: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.4)',
    cardShadow: darkMode ? '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)' : '0 8px 40px rgba(0,0,0,0.06), 0 0 0 1px rgba(255,255,255,0.05)',
    text: darkMode ? '#EAEAEA' : '#1e293b',
    subtext: darkMode ? '#888888' : '#64748b',
    accent: darkMode ? '#00FF87' : '#10b981'
  };

  const neumorphicCard = {
    background: theme.cardBg,
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    border: `1px solid ${theme.cardBorder}`,
    boxShadow: theme.cardShadow,
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: darkMode ? '0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)' : '0 20px 60px rgba(0,0,0,0.15)',
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: darkMode ? 'linear-gradient(135deg, rgba(0,255,135,0.02) 0%, rgba(255,0,135,0.02) 100%)' : 'linear-gradient(135deg, rgba(59,130,246,0.05) 0%, rgba(139,92,246,0.05) 100%)',
      pointerEvents: 'none'
    }
  };

  const handleAIAssist = () => {
    setShowAI(true);
    setTimeout(() => {
      alert('🤖 AI Analysis:\n\n✅ System Health: Excellent (99.2%)\n⚠️ 3 SLA breaches need attention\n📈 24 active tickets, 12% increase\n🔧 Recommend: Deploy 2 more technicians to Mumbai region\n⏱️ Average resolution time improved by 15 minutes');
      setShowAI(false);
    }, 2000);
  };

  return (
    <Box sx={{ 
      background: theme.background,
      minHeight: '100vh',
      p: 3,
      transition: 'all 0.3s ease'
    }}>
      {/* Header */}
      <Fade in timeout={800}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Box>
            <Typography variant="h3" sx={{ 
              fontWeight: 700, 
              color: theme.text,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
              background: darkMode ? 'linear-gradient(135deg, #00FF87, #00D4FF)' : 'linear-gradient(135deg, #667eea, #764ba2)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em'
            }}>
              EV Service Intelligence Platform ⚡
            </Typography>
            <Typography variant="body1" sx={{ color: theme.subtext, mt: 0.5 }}>
              Real-time insights for electric vehicle service operations
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <FormControlLabel
              control={<Switch checked={darkMode} onChange={(e) => setDarkMode(e.target.checked)} />}
              label={darkMode ? <DarkMode /> : <LightMode />}
            />
            <Button
              variant="contained"
              startIcon={<SmartToy />}
              onClick={handleAIAssist}
              disabled={showAI}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '16px',
                px: 3,
                py: 1.5,
                boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 30px rgba(102, 126, 234, 0.6)'
                }
              }}
            >
              {showAI ? 'Analyzing...' : 'AI Assist'}
            </Button>
            <Badge badgeContent={3} color="error">
              <IconButton sx={{ 
                background: theme.cardBg,
                backdropFilter: 'blur(10px)',
                border: `1px solid ${theme.cardBorder}`,
                '&:hover': { transform: 'scale(1.1)' }
              }}>
                <Notifications sx={{ color: theme.text }} />
              </IconButton>
            </Badge>
            <Avatar sx={{ 
              width: 44, height: 44,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
            }}>V</Avatar>
          </Box>
        </Box>
      </Fade>

      {/* Filters Bar */}
      <Slide direction="down" in timeout={1000}>
        <Box mb={4} p={3} sx={{
          background: theme.cardBg,
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          border: `1px solid ${theme.cardBorder}`,
          boxShadow: theme.cardShadow
        }}>
          <Box display="flex" alignItems="center" gap={3} flexWrap="wrap">
            <FilterList sx={{ color: theme.accent }} />
            
            <ToggleButtonGroup value={timeFilter} exclusive onChange={(e, v) => v && setTimeFilter(v)} sx={{
              '& .MuiToggleButton-root': {
                border: 'none', borderRadius: '12px', px: 2, py: 1,
                background: theme.cardBg, color: theme.subtext,
                '&.Mui-selected': { background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white' }
              }
            }}>
              <ToggleButton value="today" startIcon={<Today />}>Today</ToggleButton>
              <ToggleButton value="week" startIcon={<DateRange />}>Week</ToggleButton>
              <ToggleButton value="month" startIcon={<CalendarMonth />}>Month</ToggleButton>
            </ToggleButtonGroup>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel sx={{ color: theme.subtext }}>Region</InputLabel>
              <Select value={region} onChange={(e) => setRegion(e.target.value)} sx={{ color: theme.text, '& .MuiSelect-select': { color: theme.text } }}>
                <MenuItem value="all">All Regions</MenuItem>
                <MenuItem value="mumbai">Mumbai</MenuItem>
                <MenuItem value="pune">Pune</MenuItem>
                <MenuItem value="delhi">Delhi</MenuItem>
                <MenuItem value="bangalore">Bangalore</MenuItem>
                <MenuItem value="hyderabad">Hyderabad</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel sx={{ color: theme.subtext }}>Vehicle Model</InputLabel>
              <Select value={vehicleModel} onChange={(e) => setVehicleModel(e.target.value)} sx={{ color: theme.text, '& .MuiSelect-select': { color: theme.text } }}>
                <MenuItem value="all">All Models</MenuItem>
                <MenuItem value="e1">EcoRide E1</MenuItem>
                <MenuItem value="e1pro">EcoRide E1 Pro</MenuItem>
                <MenuItem value="e1progen2">EcoRide E1 Pro Gen 2</MenuItem>
                <MenuItem value="e1air">EcoRide E1 Air</MenuItem>
                <MenuItem value="e1x">EcoRide E1 X</MenuItem>
                <MenuItem value="e1xplus">EcoRide E1 X+</MenuItem>
                <MenuItem value="roadsterx">EcoRide Roadster X</MenuItem>
                <MenuItem value="roadsterpro">EcoRide Roadster Pro</MenuItem>
                <MenuItem value="adventure">EcoRide Adventure</MenuItem>
                <MenuItem value="cruiser">EcoRide Cruiser</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel sx={{ color: theme.subtext }}>Technician Type</InputLabel>
              <Select value={technicianType} onChange={(e) => setTechnicianType(e.target.value)} sx={{ color: theme.text, '& .MuiSelect-select': { color: theme.text } }}>
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="senior">Senior Tech</MenuItem>
                <MenuItem value="junior">Junior Tech</MenuItem>
                <MenuItem value="specialist">Specialist</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Slide>

      {/* KPI Cards */}
      <Grid container spacing={3} mb={4}>
        {[
          { title: 'Active Tickets', value: '24', change: '+12%', color: theme.accent, icon: <TrendingUp /> },
          { title: 'SLA Breaches', value: '3', change: '2 critical', color: '#ef4444', icon: <Warning /> },
          { title: 'Avg Resolution', value: '2h 12m', change: '15m faster', color: '#06b6d4', icon: <TrendingDown /> },
          { title: 'System Health', value: '99.2%', change: 'All operational', color: theme.accent, icon: <CheckCircle /> }
        ].map((kpi, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Grow in={animateCards} timeout={800 + index * 200}>
              <Card sx={neumorphicCard}>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box>
                      <Typography variant="body2" sx={{ color: theme.subtext, fontWeight: 500, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        {kpi.title}
                      </Typography>
                      <Typography variant="h3" sx={{ fontWeight: 700, color: theme.text, mt: 1 }}>
                        {kpi.value}
                      </Typography>
                    </Box>
                    <Box sx={{ width: 60, height: 30 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={sparklineData}>
                          <Line type="monotone" dataKey="value" stroke={kpi.color} strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </Box>
                  </Box>
                  <Box display="flex" alignItems="center">
                    {React.cloneElement(kpi.icon, { sx: { color: kpi.color, fontSize: 16, mr: 0.5 } })}
                    <Typography variant="caption" sx={{ color: kpi.color, fontWeight: 600, fontSize: '11px' }}>
                      {kpi.change}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grow>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Live Technician Tracking */}
        <Grid item xs={12} md={6}>
          <Fade in timeout={1200}>
            <Card sx={neumorphicCard}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 700, color: theme.text, mb: 3,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'
                }}>
                  🔵 Live Technician Tracking
                </Typography>
                
                <Box ref={mapRef} sx={{ 
                  height: 200, borderRadius: '16px', mb: 2, overflow: 'hidden',
                  background: theme.cardBg, border: `1px solid ${theme.cardBorder}`
                }} />

                <List sx={{ p: 0 }}>
                  {liveTechnicians.map((tech, index) => (
                    <Slide direction="left" in timeout={1000 + index * 200} key={tech.id}>
                      <ListItem sx={{ px: 0, py: 1, borderRadius: '12px', mb: 1, background: `${theme.cardBg}50`, '&:hover': { background: `${theme.accent}10`, transform: 'translateX(8px)' }, transition: 'all 0.3s ease' }}>
                        <ListItemAvatar>
                          <Avatar sx={{ 
                            width: 32, height: 32,
                            background: tech.status === 'en_route' ? '#3b82f6' : tech.status === 'repairing' ? '#f59e0b' : '#ef4444',
                            fontSize: '12px'
                          }}>
                            {tech.name.split(' ').map(n => n[0]).join('')}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center" gap={1}>
                              <Typography variant="body2" fontWeight={600} sx={{ color: theme.text }}>
                                {tech.name}
                              </Typography>
                              <Chip label={tech.status.replace('_', ' ')} size="small" sx={{
                                height: 20, fontSize: '10px',
                                background: `${tech.status === 'en_route' ? '#3b82f6' : tech.status === 'repairing' ? '#f59e0b' : '#ef4444'}20`,
                                color: tech.status === 'en_route' ? '#3b82f6' : tech.status === 'repairing' ? '#f59e0b' : '#ef4444'
                              }} />
                            </Box>
                          }
                          secondary={
                            <Typography variant="caption" sx={{ color: theme.subtext }}>
                              {tech.ticket} • ETA: {tech.eta}
                            </Typography>
                          }
                        />
                      </ListItem>
                    </Slide>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Fade>
        </Grid>

        {/* Failure Heatmap + System Health */}
        <Grid item xs={12} md={6}>
          <Fade in timeout={1400}>
            <Card sx={neumorphicCard}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 700, color: theme.text, mb: 3,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'
                }}>
                  🔥 Failure Spike Heatmap
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Grid container spacing={1}>
                    <Grid item xs={2}>
                      <Typography variant="caption" sx={{ color: theme.subtext, fontWeight: 500 }}>
                        Component
                      </Typography>
                    </Grid>
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                      <Grid item xs={1.4} key={day}>
                        <Typography variant="caption" sx={{ color: theme.subtext, fontWeight: 500, fontSize: '10px' }}>
                          {day}
                        </Typography>
                      </Grid>
                    ))}
                  </Grid>
                  
                  {[
                    { component: 'Battery', mon: 5, tue: 3, wed: 8, thu: 2, fri: 6, sat: 4, sun: 1 },
                    { component: 'BMS', mon: 2, tue: 4, wed: 1, thu: 7, fri: 3, sat: 2, sun: 5 },
                    { component: 'Motor', mon: 3, tue: 2, wed: 5, thu: 1, fri: 4, sat: 6, sun: 2 },
                    { component: 'Software', mon: 1, tue: 6, wed: 2, thu: 4, fri: 1, sat: 3, sun: 8 }
                  ].map((row, index) => (
                    <Grow in timeout={1000 + index * 100} key={row.component}>
                      <Grid container spacing={1} sx={{ mt: 0.5 }}>
                        <Grid item xs={2}>
                          <Typography variant="caption" sx={{ fontSize: '10px', fontWeight: 500, color: theme.text }}>
                            {row.component}
                          </Typography>
                        </Grid>
                        {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map(day => {
                          const value = row[day];
                          const getHeatColor = (v) => {
                            if (v === 0) return darkMode ? '#1a1a1a' : '#f8fafc';
                            if (v <= 2) return darkMode ? '#0d4f3c' : '#dcfce7';
                            if (v <= 4) return darkMode ? '#166534' : '#bbf7d0';
                            if (v <= 6) return darkMode ? '#ca8a04' : '#fbbf24';
                            return darkMode ? '#dc2626' : '#ef4444';
                          };
                          return (
                            <Grid item xs={1.4} key={day}>
                              <Box sx={{
                                width: '100%', height: 20, borderRadius: '4px',
                                background: getHeatColor(value),
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '10px', fontWeight: 600,
                                color: value > 4 ? 'white' : theme.text,
                                cursor: 'pointer',
                                '&:hover': { transform: 'scale(1.1)', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' },
                                transition: 'all 0.2s ease'
                              }}>
                                {value}
                              </Box>
                            </Grid>
                          );
                        })}
                      </Grid>
                    </Grow>
                  ))}
                </Box>

                <Typography variant="h6" sx={{ fontWeight: 600, color: theme.text, mb: 2, fontSize: '14px' }}>
                  System Health Status
                </Typography>
                
                {[
                  { name: 'API Gateway', status: 'healthy', uptime: '99.9%', response: '45ms' },
                  { name: 'Database', status: 'healthy', uptime: '99.8%', response: '12ms' },
                  { name: 'Notification Service', status: 'warning', uptime: '98.2%', response: '156ms' },
                  { name: 'GPS Tracking', status: 'healthy', uptime: '99.7%', response: '23ms' }
                ].map((service, index) => (
                  <Grow in timeout={1200 + index * 150} key={service.name}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Box display="flex" alignItems="center">
                        <Box sx={{
                          width: 8, height: 8, borderRadius: '50%',
                          background: service.status === 'healthy' ? theme.accent : '#f59e0b',
                          mr: 1, boxShadow: `0 0 8px ${service.status === 'healthy' ? theme.accent : '#f59e0b'}`
                        }} />
                        <Typography variant="body2" sx={{ fontSize: '12px', color: theme.text }}>
                          {service.name}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="caption" sx={{ color: theme.subtext, fontSize: '10px' }}>
                          {service.uptime}
                        </Typography>
                        <Typography variant="caption" sx={{ color: theme.subtext, fontSize: '10px' }}>
                          {service.response}
                        </Typography>
                      </Box>
                    </Box>
                  </Grow>
                ))}
              </CardContent>
            </Card>
          </Fade>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PremiumESIPDashboard;