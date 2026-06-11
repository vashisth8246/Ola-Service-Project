import React from 'react';
import {
  Box, Typography, Card, CardContent, Grid, LinearProgress, Chip
} from '@mui/material';

const Analytics = () => {
  const analytics = {
    totalTicketsToday: 87,
    avgCompletionTime: '2h 12m',
    slaBreaches: 4,
    issueBreakdown: [
      { type: 'Battery Issues', percentage: 40, count: 35 },
      { type: 'Motor Issues', percentage: 30, count: 26 },
      { type: 'Software Issues', percentage: 20, count: 17 },
      { type: 'Other Issues', percentage: 10, count: 9 }
    ],
    cityLoad: [
      { city: 'Mumbai', tickets: 23, trend: 'up' },
      { city: 'Delhi', tickets: 18, trend: 'down' },
      { city: 'Bangalore', tickets: 15, trend: 'up' },
      { city: 'Chennai', tickets: 12, trend: 'stable' }
    ]
  };

  return (
    <Box>
      <Typography variant="h4" mb={3}>📊 Service Analytics Dashboard</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>🔧 Issue Breakdown Analysis</Typography>
              {analytics.issueBreakdown.map((issue) => (
                <Box key={issue.type} mb={2}>
                  <Box display="flex" justifyContent="space-between" mb={0.5}>
                    <Typography>{issue.type}</Typography>
                    <Typography fontWeight="bold">{issue.percentage}% ({issue.count})</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={issue.percentage} sx={{ height: 8 }} />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>🗺️ City-wise Service Load</Typography>
              {analytics.cityLoad.map((city) => (
                <Box key={city.city} display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography>{city.city}</Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography>{city.tickets} tickets</Typography>
                    <Chip 
                      label={city.trend} 
                      color={city.trend === 'up' ? 'error' : city.trend === 'down' ? 'success' : 'default'}
                      size="small" 
                    />
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

export default Analytics;