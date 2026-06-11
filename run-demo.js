const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Mock database
let tickets = [
  {
    id: '1',
    ticket_number: 'TKT-2024-001234',
    customer_name: 'John Doe',
    customer_phone: '+91-9876543210',
    issue_category: 'battery',
    issue_description: 'Scooter not charging properly, battery indicator shows error',
    status: 'in_progress',
    priority: 'high',
    created_at: new Date().toISOString(),
    vehicle_model: 'Ola S1 Pro',
    technician_name: 'Ravi Kumar',
    location: { address: '123 MG Road, Bangalore' }
  },
  {
    id: '2',
    ticket_number: 'TKT-2024-001235',
    customer_name: 'Jane Smith',
    customer_phone: '+91-9876543211',
    issue_category: 'motor',
    issue_description: 'Strange noise from motor during acceleration',
    status: 'assigned',
    priority: 'medium',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    vehicle_model: 'Ola S1',
    technician_name: 'Amit Sharma',
    location: { address: '456 Brigade Road, Bangalore' }
  }
];

let users = [
  { id: '1', email: 'admin@ola.com', name: 'Admin User', type: 'admin', password: 'admin123' },
  { id: '2', email: 'customer@example.com', name: 'John Doe', type: 'customer', password: 'customer123' },
  { id: '3', email: 'tech@ola.com', name: 'Ravi Kumar', type: 'technician', password: 'tech123' }
];

// Routes
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Ola Service Tracking API',
    version: '1.0.0'
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    res.json({
      message: 'Login successful',
      user: { id: user.id, email: user.email, name: user.name, user_type: user.type },
      token: `jwt-token-${user.id}-${Date.now()}`
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.get('/api/tickets', (req, res) => {
  res.json({
    tickets: tickets,
    pagination: { page: 1, limit: 20, total: tickets.length, pages: 1 }
  });
});

app.post('/api/tickets', (req, res) => {
  const newTicket = {
    id: String(tickets.length + 1),
    ticket_number: `TKT-2024-${String(tickets.length + 1).padStart(6, '0')}`,
    customer_name: req.body.customer_name || 'New Customer',
    issue_category: req.body.issue_category,
    issue_description: req.body.issue_description,
    status: 'created',
    priority: req.body.priority || 'medium',
    created_at: new Date().toISOString(),
    vehicle_model: req.body.vehicle_model || 'Ola S1',
    location: req.body.location || { address: 'Bangalore' }
  };
  
  tickets.push(newTicket);
  res.status(201).json({ ticket: newTicket });
});

app.put('/api/tickets/:id/status', (req, res) => {
  const ticket = tickets.find(t => t.id === req.params.id);
  if (ticket) {
    ticket.status = req.body.status;
    ticket.updated_at = new Date().toISOString();
    res.json({ ticket });
  } else {
    res.status(404).json({ error: 'Ticket not found' });
  }
});

// Dashboard HTML
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>🚀 Ola Service Tracking - LIVE DEMO</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; color: white; margin-bottom: 30px; }
        .logo { font-size: 3em; font-weight: bold; margin-bottom: 10px; }
        .subtitle { font-size: 1.3em; opacity: 0.9; }
        .dashboard { background: white; border-radius: 15px; padding: 30px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .stat-card { background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 25px; border-radius: 10px; text-align: center; }
        .stat-number { font-size: 2.5em; font-weight: bold; margin-bottom: 5px; }
        .stat-label { font-size: 1em; opacity: 0.9; }
        .section { margin: 30px 0; }
        .section-title { font-size: 1.5em; font-weight: bold; margin-bottom: 15px; color: #333; }
        .ticket { background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px; margin: 15px 0; transition: transform 0.2s; }
        .ticket:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
        .ticket-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
        .ticket-number { font-weight: bold; color: #667eea; font-size: 1.1em; }
        .status { padding: 6px 15px; border-radius: 20px; font-size: 0.85em; font-weight: bold; text-transform: uppercase; }
        .status.in_progress { background: #e3f2fd; color: #1976d2; }
        .status.assigned { background: #fff3e0; color: #f57c00; }
        .status.created { background: #f3e5f5; color: #7b1fa2; }
        .status.completed { background: #e8f5e8; color: #388e3c; }
        .ticket-details { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px; }
        .detail-item { font-size: 0.9em; }
        .detail-label { font-weight: bold; color: #666; }
        .api-section { background: #f8f9fa; border-radius: 10px; padding: 25px; margin-top: 30px; }
        .endpoint { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; font-family: 'Courier New', monospace; border-left: 4px solid #667eea; }
        .method { color: #28a745; font-weight: bold; }
        .url { color: #667eea; }
        .live-indicator { display: inline-block; width: 10px; height: 10px; background: #28a745; border-radius: 50%; margin-right: 8px; animation: pulse 2s infinite; }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
        .btn { background: #667eea; color: white; border: none; padding: 12px 25px; border-radius: 5px; cursor: pointer; font-size: 1em; margin: 5px; }
        .btn:hover { background: #5a6fd8; }
        .demo-actions { text-align: center; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">⚡ OLA ELECTRIC</div>
            <div class="subtitle">After-Sales Service Tracking System</div>
            <div style="margin-top: 10px;"><span class="live-indicator"></span>LIVE DEMO RUNNING</div>
        </div>
        
        <div class="dashboard">
            <div class="stats">
                <div class="stat-card">
                    <div class="stat-number">${tickets.length}</div>
                    <div class="stat-label">Total Tickets</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${tickets.filter(t => t.status === 'in_progress').length}</div>
                    <div class="stat-label">In Progress</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${tickets.filter(t => t.status === 'assigned').length}</div>
                    <div class="stat-label">Assigned</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">4.8⭐</div>
                    <div class="stat-label">Avg Rating</div>
                </div>
            </div>
            
            <div class="section">
                <div class="section-title">🎫 Active Service Tickets</div>
                ${tickets.map(ticket => `
                    <div class="ticket">
                        <div class="ticket-header">
                            <span class="ticket-number">${ticket.ticket_number}</span>
                            <span class="status ${ticket.status}">${ticket.status.replace('_', ' ')}</span>
                        </div>
                        <div style="font-size: 1.1em; font-weight: bold; margin-bottom: 10px;">
                            ${ticket.customer_name} - ${ticket.vehicle_model}
                        </div>
                        <div style="color: #666; margin-bottom: 15px;">
                            <strong>${ticket.issue_category.toUpperCase()}:</strong> ${ticket.issue_description}
                        </div>
                        <div class="ticket-details">
                            <div class="detail-item">
                                <span class="detail-label">Priority:</span> ${ticket.priority.toUpperCase()}
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Technician:</span> ${ticket.technician_name || 'Assigning...'}
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Location:</span> ${ticket.location.address}
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Created:</span> ${new Date(ticket.created_at).toLocaleString()}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="demo-actions">
                <button class="btn" onclick="createDemoTicket()">➕ Create Demo Ticket</button>
                <button class="btn" onclick="updateTicketStatus()">🔄 Update Status</button>
                <button class="btn" onclick="location.reload()">🔄 Refresh Dashboard</button>
            </div>
            
            <div class="api-section">
                <div class="section-title">🚀 Live API Endpoints</div>
                <div class="endpoint">
                    <span class="method">GET</span> <span class="url">http://localhost:3001/health</span> - Health Check
                </div>
                <div class="endpoint">
                    <span class="method">POST</span> <span class="url">http://localhost:3001/api/auth/login</span> - User Login
                </div>
                <div class="endpoint">
                    <span class="method">GET</span> <span class="url">http://localhost:3001/api/tickets</span> - List Tickets
                </div>
                <div class="endpoint">
                    <span class="method">POST</span> <span class="url">http://localhost:3001/api/tickets</span> - Create Ticket
                </div>
                
                <div style="margin-top: 20px; padding: 15px; background: white; border-radius: 5px;">
                    <strong>🔐 Test Credentials:</strong><br>
                    Admin: admin@ola.com / admin123<br>
                    Customer: customer@example.com / customer123<br>
                    Technician: tech@ola.com / tech123
                </div>
            </div>
        </div>
    </div>
    
    <script>
        function createDemoTicket() {
            const issues = ['battery', 'motor', 'brake', 'electrical'];
            const priorities = ['low', 'medium', 'high'];
            const descriptions = [
                'Vehicle not starting properly',
                'Strange noise during operation',
                'Battery not charging to full capacity',
                'Dashboard lights flickering'
            ];
            
            const newTicket = {
                customer_name: 'Demo Customer ' + Math.floor(Math.random() * 100),
                issue_category: issues[Math.floor(Math.random() * issues.length)],
                issue_description: descriptions[Math.floor(Math.random() * descriptions.length)],
                priority: priorities[Math.floor(Math.random() * priorities.length)],
                vehicle_model: 'Ola S1 Pro',
                location: { address: 'Demo Location, Bangalore' }
            };
            
            fetch('/api/tickets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTicket)
            })
            .then(response => response.json())
            .then(data => {
                alert('✅ Demo ticket created: ' + data.ticket.ticket_number);
                location.reload();
            })
            .catch(error => alert('❌ Error: ' + error.message));
        }
        
        function updateTicketStatus() {
            const ticketId = '1';
            const statuses = ['assigned', 'en_route', 'arrived', 'in_progress', 'completed'];
            const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
            
            fetch('/api/tickets/' + ticketId + '/status', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            })
            .then(response => response.json())
            .then(data => {
                alert('✅ Ticket status updated to: ' + newStatus.toUpperCase());
                location.reload();
            })
            .catch(error => alert('❌ Error: ' + error.message));
        }
        
        // Auto-refresh every 30 seconds
        setInterval(() => {
            console.log('🔄 Auto-refreshing dashboard...');
            location.reload();
        }, 30000);
    </script>
</body>
</html>
  `);
});

const PORT = 3001;
const server = app.listen(PORT, () => {
  console.log(`
🚀 OLA SERVICE TRACKING SYSTEM - LIVE DEMO
==========================================

✅ Server Status: RUNNING
🌐 Dashboard URL: http://localhost:${PORT}
🔧 Health Check: http://localhost:${PORT}/health
📊 API Base URL: http://localhost:${PORT}/api

🎯 FEATURES RUNNING:
✅ Real-time Dashboard
✅ Ticket Management
✅ User Authentication
✅ Status Updates
✅ Interactive Demo

📱 TEST THE SYSTEM:
1. Open: http://localhost:${PORT}
2. Create demo tickets
3. Update ticket status
4. Test API endpoints

🔐 Sample Login:
- Admin: admin@ola.com / admin123
- Customer: customer@example.com / customer123
- Technician: tech@ola.com / tech123

Press Ctrl+C to stop the server
  `);
});

process.on('SIGINT', () => {
  console.log('\n👋 Shutting down Ola Service Tracking Demo...');
  server.close(() => {
    console.log('✅ Server stopped successfully');
    process.exit(0);
  });
});