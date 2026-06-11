import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Box, Alert } from '@mui/material';
import TechnicianTracker from '../components/TechnicianTracker';

const TrackTicket = () => {
  const [ticketNumber, setTicketNumber] = useState('');
  const [ticketData, setTicketData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/tickets/track/${ticketNumber}`);
      if (response.ok) {
        const data = await response.json();
        setTicketData(data);
      } else {
        setError('Ticket not found. Please check the ticket number.');
      }
    } catch (err) {
      setError('Error tracking ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth={ticketData ? "lg" : "sm"}>
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Track Your Ticket
          </Typography>
          <form onSubmit={handleTrack}>
            <TextField
              fullWidth
              label="Ticket Number"
              value={ticketNumber}
              onChange={(e) => setTicketNumber(e.target.value)}
              margin="normal"
              placeholder="e.g., OLA-2024-001"
              required
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Tracking...' : 'Track Ticket'}
            </Button>
          </form>
          
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Paper>
        
        {ticketData && (
          <>
            <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
              <Typography variant="h5" gutterBottom>
                Ticket Details
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Typography><strong>Ticket ID:</strong> {ticketData.ticket_number}</Typography>
                <Typography><strong>Status:</strong> {ticketData.status}</Typography>
                <Typography><strong>Issue:</strong> {ticketData.issue_description}</Typography>
                <Typography><strong>Priority:</strong> {ticketData.priority}</Typography>
                <Typography><strong>Created:</strong> {new Date(ticketData.created_at).toLocaleString()}</Typography>
                <Typography><strong>Technician:</strong> {ticketData.technician_name || 'Not assigned'}</Typography>
              </Box>
            </Paper>
            
            <TechnicianTracker ticketId={ticketData.id || 1} />
          </>
        )}
      </Box>
    </Container>
  );
};

export default TrackTicket;