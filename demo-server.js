const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Mock data
const mockUsers = [
  { id: '1', email: 'admin@ola.com', name: 'Admin User', type: 'admin' },
  { id: '2', email: 'customer@example.com', name: 'John Doe', type: 'customer' },
  { id: '3', email: 'tech@ola.com', name: 'Ravi Kumar', type: 'technician' }
];

const mockTickets = [
  {
    id: '1',
    ticket_number: 'TKT-2024-001234',
    customer_name: 'John Doe',
    issue_category: 'battery',
    issue_description: 'Scooter not charging properly',
    status: 'in_progress',
    priority: 'high',
    created_at: new Date().toISOString(),
    vehicle_model: 'Ola S1 Pro'
  },
  {
    id: '2',
    ticket_number: 'TKT-2024-001235',
    customer_name: 'Jane Smith',
    issue_category: 'motor',
    issue_description: 'Strange noise from motor',
    status: 'assigned',
    priority: 'medium',
    created_at: new Date().toISOString(),
    vehicle_model: 'Ola S1'
  }
];

// Routes
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Ola Service Tracking API Demo'
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = mockUsers.find(u => u.email === email);
  
  if (user && password) {
    res.json({
      message: 'Login successful',
      user: { id: user.id, email: user.email, name: user.name, user_type: user.type },
      token: 'demo-jwt-token-' + user.id
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.get('/api/tickets', (req, res) => {
  res.json({
    tickets: mockTickets,
    pagination: { page: 1, limit: 20, total: mockTickets.length, pages: 1 }
  });
});

app.post('/api/tickets', (req, res) => {
  const newTicket = {
    id: String(mockTickets.length + 1),
    ticket_number: `TKT-2024-${String(mockTickets.length + 1).padStart(6, '0')}`,
    ...req.body,
    status: 'created',
    created_at: new Date().toISOString()
  };
  
  mockTickets.push(newTicket);
  res.status(201).json({ ticket: newTicket });
});

app.get('/api/tickets/:id', (req, res) => {
  const ticket = mockTickets.find(t => t.id === req.params.id);
  if (ticket) {
    res.json({ ticket });
  } else {
    res.status(404).json({ error: 'Ticket not found' });
  }
});

// Demo dashboard
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Ola Service Tracking - Demo</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
            .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { text-align: center; margin-bottom: 40px; }
            .logo { color: #1976d2; font-size: 2.5em; font-weight: bold; margin-bottom: 10px; }
            .subtitle { color: #666; font-size: 1.2em; }
            .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 30px 0; }
            .stat-card { background: #1976d2; color: white; padding: 20px; border-radius: 8px; text-align: center; }
            .stat-number { font-size: 2em; font-weight: bold; }
            .stat-label { font-size: 0.9em; opacity: 0.9; }
            .tickets { margin-top: 30px; }
            .ticket { background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #1976d2; }
            .ticket-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
            .ticket-number { font-weight: bold; color: #1976d2; }
            .status { padding: 4px 12px; border-radius: 20px; font-size: 0.8em; font-weight: bold; }
            .status.in_progress { background: #e3f2fd; color: #1976d2; }
            .status.assigned { background: #fff3e0; color: #f57c00; }
            .api-demo { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 30px; }
            .endpoint { background: white; padding: 10px; margin: 5px 0; border-radius: 4px; font-family: monospace; }
            .method { color: #4caf50; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">⚡ OLA ELECTRIC</div>
                <div class="subtitle">After-Sales Service Tracking System - DEMO</div>
            </div>
            
            <div class="stats">
                <div class="stat-card">
                    <div class="stat-number">${mockTickets.length}</div>
                    <div class="stat-label">Total Tickets</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${mockTickets.filter(t => t.status === 'in_progress').length}</div>
                    <div class="stat-label">In Progress</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${mockTickets.filter(t => t.status === 'assigned').length}</div>
                    <div class="stat-label">Assigned</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">4.8</div>
                    <div class="stat-label">Avg Rating</div>
                </div>
            </div>
            
            <div class="tickets">
                <h3>Recent Service Tickets</h3>
                ${mockTickets.map(ticket => `
                    <div class="ticket">
                        <div class="ticket-header">
                            <span class="ticket-number">${ticket.ticket_number}</span>
                            <span class="status ${ticket.status}">${ticket.status.replace('_', ' ').toUpperCase()}</span>
                        </div>
                        <div><strong>${ticket.customer_name}</strong> - ${ticket.vehicle_model}</div>
                        <div>${ticket.issue_category}: ${ticket.issue_description}</div>
                        <div style="font-size: 0.9em; color: #666; margin-top: 5px;">
                            Priority: ${ticket.priority.toUpperCase()} | Created: ${new Date(ticket.created_at).toLocaleString()}
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="api-demo">
                <h3>🚀 API Endpoints Demo</h3>
                <div class="endpoint"><span class="method">GET</span> /health - Health check</div>
                <div class="endpoint"><span class="method">POST</span> /api/auth/login - User authentication</div>
                <div class="endpoint"><span class="method">GET</span> /api/tickets - List all tickets</div>
                <div class="endpoint"><span class="method">POST</span> /api/tickets - Create new ticket</div>
                <div class="endpoint"><span class="method">GET</span> /api/tickets/:id - Get ticket details</div>
                
                <h4>Sample Login Credentials:</h4>
                <div style="background: white; padding: 10px; border-radius: 4px; font-family: monospace;">
                    Admin: admin@ola.com / admin123<br>
                    Customer: customer@example.com / customer123<br>
                    Technician: tech@ola.com / tech123
                </div>
            </div>
        </div>
        
        <script>
            // Auto-refresh every 30 seconds
            setTimeout(() => location.reload(), 30000);
        </script>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`
🚀 Ola Service Tracking Demo Server Started!
📍 URL: http://localhost:${PORT}
📊 Dashboard: http://localhost:${PORT}
🔧 Health Check: http://localhost:${PORT}/health
📚 API Base: http://localhost:${PORT}/api

Sample API Calls:
curl http://localhost:${PORT}/health
curl -X POST http://localhost:${PORT}/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@ola.com","password":"admin123"}'
curl http://localhost:${PORT}/api/tickets
  `);
});