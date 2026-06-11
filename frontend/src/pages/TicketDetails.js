import React, { useState, useEffect } from 'react';
import { Container, Paper, Typography, Box, Chip } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const TicketDetails = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const fetchTicket = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/tickets/${id}`);
      setTicket(response.data.data);
    } catch (error) {
      console.error('Error fetching ticket:', error);
    }
  };

  if (!ticket) return <div>Loading...</div>;

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Ticket Details
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6">Ticket Number: {ticket.ticket_number}</Typography>
            <Chip label={ticket.status} color="primary" sx={{ mt: 1 }} />
          </Box>
          <Typography><strong>Customer:</strong> {ticket.customer_name}</Typography>
          <Typography><strong>Phone:</strong> {ticket.phone}</Typography>
          <Typography><strong>Vehicle:</strong> {ticket.vehicle_model}</Typography>
          <Typography><strong>Issue:</strong> {ticket.issue_type}</Typography>
          <Typography><strong>Priority:</strong> {ticket.priority}</Typography>
          {ticket.technician_name && (
            <Typography><strong>Technician:</strong> {ticket.technician_name}</Typography>
          )}
          {ticket.eta && (
            <Typography><strong>ETA:</strong> {ticket.eta}</Typography>
          )}
          <Typography><strong>Created:</strong> {new Date(ticket.created_at).toLocaleString()}</Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default TicketDetails;