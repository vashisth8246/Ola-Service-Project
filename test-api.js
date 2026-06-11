const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Mock data
const tickets = [
  {
    id: '1',
    ticket_number: 'TKT-2024-001234',
    customer_name: 'John Doe',
    issue_category: 'battery',
    status: 'in_progress',
    priority: 'high',
    created_at: new Date().toISOString()
  }
];

// API Routes
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'Ola Service API', timestamp: new Date().toISOString() });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@ola.com' && password === 'admin123') {
    res.json({
      message: 'Login successful',
      user: { id: '1', email, name: 'Admin User', user_type: 'admin' },
      token: 'demo-jwt-token'
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.get('/api/tickets', (req, res) => {
  res.json({ tickets, total: tickets.length });
});

const server = app.listen(3001, () => {
  console.log('🚀 Ola Service API Demo Running on http://localhost:3001');
  console.log('\n📋 Test the API:');
  console.log('Health Check: GET http://localhost:3001/health');
  console.log('Login: POST http://localhost:3001/api/auth/login');
  console.log('Tickets: GET http://localhost:3001/api/tickets');
  
  // Auto-test the API
  setTimeout(async () => {
    try {
      const response = await fetch('http://localhost:3001/health');
      const data = await response.json();
      console.log('\n✅ Health Check Response:', data);
      
      const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@ola.com', password: 'admin123' })
      });
      const loginData = await loginResponse.json();
      console.log('✅ Login Response:', loginData);
      
      const ticketsResponse = await fetch('http://localhost:3001/api/tickets');
      const ticketsData = await ticketsResponse.json();
      console.log('✅ Tickets Response:', ticketsData);
      
    } catch (error) {
      console.log('❌ API Test Error:', error.message);
    }
    
    console.log('\n🎉 Demo completed! Server will continue running...');
  }, 1000);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down server...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});