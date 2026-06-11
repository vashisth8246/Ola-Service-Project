import React from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Rating, Chip, Avatar, List, ListItem, ListItemText, ListItemAvatar
} from '@mui/material';

const Feedback = () => {
  const feedback = [
    {
      id: 1, customer: 'Rahul Sharma', ticket: 'OLA-2024-001', rating: 5,
      comment: 'Excellent service! Technician was very professional and fixed the issue quickly.',
      technician: 'Amit Singh', date: '2024-01-15', mood: '😊'
    },
    {
      id: 2, customer: 'Priya Patel', ticket: 'OLA-2024-002', rating: 3,
      comment: 'Service was okay but took longer than expected. Could be improved.',
      technician: 'Raj Kumar', date: '2024-01-14', mood: '😐'
    },
    {
      id: 3, customer: 'Vikash Kumar', ticket: 'OLA-2024-003', rating: 2,
      comment: 'Not satisfied with the service. Issue was not resolved properly.',
      technician: 'Priya Sharma', date: '2024-01-13', mood: '😡'
    }
  ];

  const avgRating = (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1);
  const npsScore = 72; // Mock NPS score

  return (
    <Box>
      <Typography variant="h4" mb={3}>💬 Customer Feedback Management</Typography>
      
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#e8f5e8' }}>
            <CardContent>
              <Typography color="textSecondary">Average Rating</Typography>
              <Typography variant="h4">{avgRating} ⭐</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#e3f2fd' }}>
            <CardContent>
              <Typography color="textSecondary">Total Feedback</Typography>
              <Typography variant="h4">{feedback.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#f3e5f5' }}>
            <CardContent>
              <Typography color="textSecondary">NPS Score</Typography>
              <Typography variant="h4">{npsScore}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#fff3e0' }}>
            <CardContent>
              <Typography color="textSecondary">Mood Index</Typography>
              <Typography variant="h4">4.2 😊</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" mb={2}>📝 Recent Customer Feedback</Typography>
          <List>
            {feedback.map((item) => (
              <ListItem key={item.id} divider>
                <ListItemAvatar>
                  <Avatar>{item.customer.split(' ').map(n => n[0]).join('')}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <Typography variant="subtitle1">{item.customer}</Typography>
                      <Chip label={item.ticket} size="small" />
                      <Rating value={item.rating} readOnly size="small" />
                      <Typography variant="h6">{item.mood}</Typography>
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" mb={1}>{item.comment}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        Technician: {item.technician} | Date: {item.date}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Feedback;