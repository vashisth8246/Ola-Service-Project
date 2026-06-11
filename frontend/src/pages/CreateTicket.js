import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Box, MenuItem, Grid, Alert } from '@mui/material';
import axios from 'axios';

const CreateTicket = () => {
  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    vehicle_model: '',
    issue_type: '',
    custom_issue: '',
    description: '',
    address: ''
  });
  const [success, setSuccess] = useState(false);

  const ecoRideModels = [
    'EcoRide E1',
    'EcoRide E1 Pro',
    'EcoRide E1 Pro Gen 2',
    'EcoRide E1 Air',
    'EcoRide E1 X',
    'EcoRide E1 X+',
    'EcoRide Roadster X',
    'EcoRide Roadster Pro',
    'EcoRide Adventure',
    'EcoRide Cruiser'
  ];

  const issueTypes = [
    'Battery Issues',
    'Charging Problems',
    'Motor/Engine Issues',
    'Brake Problems',
    'Display/Dashboard Issues',
    'Lighting Problems',
    'Tire/Wheel Issues',
    'Suspension Problems',
    'Electrical Issues',
    'Body/Frame Damage',
    'Key/Lock Issues',
    'Horn Not Working',
    'Speedometer Issues',
    'Handlebar Problems',
    'Seat Issues',
    'Storage Box Problems',
    'Connectivity Issues',
    'App Sync Problems',
    'GPS/Navigation Issues',
    'Sound System Issues',
    'Weather Protection Issues',
    'Performance Issues',
    'Range/Mileage Problems',
    'Overheating Issues',
    'Software Updates',
    'Warranty Claims',
    'Insurance Related',
    'Accident Damage',
    'Theft/Security Issues',
    'Other'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const ticketData = {
        ...formData,
        issue_type: formData.issue_type === 'Other' ? formData.custom_issue : formData.issue_type
      };
      const response = await axios.post('http://localhost:3001/api/tickets', ticketData);
      setSuccess(true);
      setFormData({
        customer_name: '',
        phone: '',
        vehicle_model: '',
        issue_type: '',
        custom_issue: '',
        description: '',
        address: ''
      });
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      alert('Error creating ticket');
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom color="primary" sx={{ mb: 3 }}>
            🔧 Create Service Request
          </Typography>
          
          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Service request created successfully! Our team will contact you soon.
            </Alert>
          )}
          
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Customer Name"
                  value={formData.customer_name}
                  onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                  placeholder="Enter your full name"
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="+91-XXXXXXXXXX"
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Vehicle Model"
                  value={formData.vehicle_model}
                  onChange={(e) => setFormData({...formData, vehicle_model: e.target.value})}
                  required
                >
                  {ecoRideModels.map((model) => (
                    <MenuItem key={model} value={model}>
                      {model}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Issue Type"
                  value={formData.issue_type}
                  onChange={(e) => setFormData({...formData, issue_type: e.target.value})}
                  required
                >
                  {issueTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              
              {formData.issue_type === 'Other' && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Please specify your issue"
                    value={formData.custom_issue}
                    onChange={(e) => setFormData({...formData, custom_issue: e.target.value})}
                    placeholder="Describe your specific issue"
                    required
                  />
                </Grid>
              )}
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Detailed Description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Please provide detailed information about the issue, when it started, any error messages, etc."
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Service Address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="Enter complete address where service is required"
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{ mt: 2, py: 1.5, fontSize: '1.1rem' }}
                >
                  🚀 Submit Service Request
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default CreateTicket;