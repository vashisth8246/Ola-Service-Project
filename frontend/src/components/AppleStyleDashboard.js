import React, { useState } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Chip, Button, Avatar, 
  IconButton, Tooltip, ToggleButtonGroup, ToggleButton, List, ListItem,
  ListItemText, ListItemAvatar, Divider, Paper
} from '@mui/material';
import {
  TrendingUp, TrendingDown, Person, Notifications, Settings,
  FilterList, Today, DateRange, CalendarMonth, AllInclusive
} from '@mui/icons-material';
import { LineChart, Line, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';

const AppleStyleDashboard = () => {
  const [timeFilter, setTimeFilter] = useState('today');

  // Mock sparkline data
  const sparklineData = [
    { value: 12 }, { value: 19 }, { value: 15 }, { value: 27 }, { value: 32 }, { value: 28 }, { value: 35 }
  ];

  const openTickets = [
    { id: 'ECO-2024-003', customer: 'Arjun Patel', issue: 'Battery Drain', priority: 'high', time: '2 min ago' },
    { id: 'ECO-2024-004', customer: 'Sneha Kumar', issue: 'Motor Noise', priority: 'medium', time: '5 min ago' },
    { id: 'ECO-2024-005', customer: 'Rahul Singh', issue: 'Display Issue', priority: 'low', time: '12 min ago' }
  ];

  const failureData = [
    { name: 'Battery', value: 40, color: '#FF6B6B' },
    { name: 'Motor', value: 30, color: '#4ECDC4' },
    { name: 'Software', value: 20, color: '#45B7D1' },
    { name: 'Other', value: 10, color: '#96CEB4' }
  ];

  const appleCardStyle = {
    background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    border: '1px solid rgba(255,255,255,0.2)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 12px 40px rgba(0,0,0,0.1)'
    }
  };

  const kpiCardStyle = {
    ...appleCardStyle,
    background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.9) 100%)',
    minHeight: '140px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
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
            Welcome back, Vashisth 👋
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b', mt: 0.5 }}>
            Here's what's happening with your service center today
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton sx={{ 
            background: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(10px)',
            '&:hover': { background: 'rgba(255,255,255,0.9)' }
          }}>
            <Notifications />
          </IconButton>
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

      {/* KPI Cards with Sparklines */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={kpiCardStyle}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Box>
                  <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                    Active Requests
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 300, color: '#1e293b', mt: 1 }}>
                    24
                  </Typography>
                </Box>
                <Tooltip title="Trending up 12% from yesterday">
                  <Box sx={{ width: 60, height: 30 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={sparklineData}>
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#10b981" 
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Tooltip>
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
          <Card sx={kpiCardStyle}>
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
                <Tooltip title="2 more than yesterday">
                  <Box sx={{ width: 60, height: 30 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={sparklineData.map(d => ({ value: d.value - 5 }))}>
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#ef4444" 
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Tooltip>
              </Box>
              <Box display="flex" alignItems="center">
                <TrendingUp sx={{ color: '#ef4444', fontSize: 16, mr: 0.5 }} />
                <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 500 }}>
                  +2 from yesterday
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={kpiCardStyle}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Box>
                  <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                    Customer Mood
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 300, color: '#1e293b', mt: 1 }}>
                    4.2 😊
                  </Typography>
                </Box>
                <Tooltip title="Stable mood index">
                  <Box sx={{ width: 60, height: 30 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={sparklineData.map(d => ({ value: d.value + 10 }))}>
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#8b5cf6" 
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Tooltip>
              </Box>
              <Box display="flex" alignItems="center">
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>
                  Stable from last week
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={kpiCardStyle}>
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
                <Tooltip title="15 minutes faster than target">
                  <Box sx={{ width: 60, height: 30 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={sparklineData.map(d => ({ value: d.value - 3 }))}>
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#06b6d4" 
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Tooltip>
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
      </Grid>

      <Grid container spacing={3}>
        {/* Open Tickets List */}
        <Grid item xs={12} md={6}>
          <Card sx={appleCardStyle}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 600, 
                color: '#1e293b', 
                mb: 3,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'
              }}>
                🎫 Open Tickets
              </Typography>
              <List sx={{ p: 0 }}>
                {openTickets.map((ticket, index) => (
                  <React.Fragment key={ticket.id}>
                    <ListItem sx={{ px: 0, py: 2 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ 
                          width: 40, height: 40,
                          background: ticket.priority === 'high' ? 
                            'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)' :
                            ticket.priority === 'medium' ?
                            'linear-gradient(135deg, #feca57 0%, #ff9ff3 100%)' :
                            'linear-gradient(135deg, #48cae4 0%, #0096c7 100%)',
                          fontSize: '12px',
                          fontWeight: 600
                        }}>
                          {ticket.customer.split(' ').map(n => n[0]).join('')}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="body2" fontWeight={600}>
                              {ticket.id}
                            </Typography>
                            <Chip 
                              label={ticket.priority} 
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: '10px',
                                fontWeight: 600,
                                background: ticket.priority === 'high' ? 
                                  'rgba(239, 68, 68, 0.1)' :
                                  ticket.priority === 'medium' ?
                                  'rgba(245, 158, 11, 0.1)' :
                                  'rgba(59, 130, 246, 0.1)',
                                color: ticket.priority === 'high' ? '#ef4444' :
                                       ticket.priority === 'medium' ? '#f59e0b' : '#3b82f6',
                                border: 'none'
                              }}
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="#1e293b">
                              {ticket.customer} • {ticket.issue}
                            </Typography>
                            <Typography variant="caption" color="#64748b">
                              {ticket.time}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < openTickets.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Failure Pattern Analytics */}
        <Grid item xs={12} md={6}>
          <Card sx={appleCardStyle}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 600, 
                color: '#1e293b', 
                mb: 3,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'
              }}>
                📊 Failure Pattern Analytics
              </Typography>
              <Box sx={{ height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={failureData}>
                    <XAxis 
                      dataKey="name" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#64748b' }}
                    />
                    <YAxis hide />
                    <Bar 
                      dataKey="value" 
                      radius={[8, 8, 0, 0]}
                      fill="url(#gradient)"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#667eea" stopOpacity={0.8}/>
                        <stop offset="100%" stopColor="#764ba2" stopOpacity={0.3}/>
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AppleStyleDashboard;