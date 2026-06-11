import React from 'react';
import { Container, Paper, Typography, Box } from '@mui/material';

const Profile = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Profile
          </Typography>
          <Typography>Profile page coming soon...</Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Profile;