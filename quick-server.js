const express = require('express');
const path = require('path');
const app = express();

app.use(express.static('.'));
app.use(express.json());

// Mock API endpoints
app.get('/api/tickets', (req, res) => {
  res.json([
    { id: 'TKT-001', status: 'in-progress', location: 'Ahmedabad', technician: 'Raj Patel' },
    { id: 'TKT-002', status: 'pending', location: 'Surat', technician: 'Amit Shah' },
    { id: 'TKT-003', status: 'completed', location: 'Vadodara', technician: 'Kiran Modi' }
  ]);
});

app.get('/api/stats', (req, res) => {
  res.json({
    activeTickets: 24,
    techniciansOnline: 8,
    completedToday: 156,
    slaCompliance: 92
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'working-dashboard.html'));
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`🚀 Ola Dashboard running at http://localhost:${PORT}`);
  console.log('✅ Project is now accessible!');
});