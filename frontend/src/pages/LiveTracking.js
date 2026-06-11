import React, { useState, useEffect } from 'react';
import TechnicianTracker from '../components/TechnicianTracker';
import AllTechniciansMap from '../components/AllTechniciansMap';

const LiveTracking = () => {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [sampleTickets] = useState([
    {
      id: 1,
      ticketNumber: 'OLA-EV-2024-001',
      customerName: 'Arjun Patel',
      vehicleModel: 'Ola S1 Pro',
      issueType: 'Battery Not Charging',
      status: 'technician_assigned',
      priority: 'high',
      location: 'Ahmedabad, Gujarat',
      technicianName: 'Raj Kumar',
      estimatedTime: '25 min'
    },
    {
      id: 2,
      ticketNumber: 'OLA-EV-2024-002',
      customerName: 'Priya Sharma',
      vehicleModel: 'Ola S1',
      issueType: 'Motor Issue',
      status: 'in_progress',
      priority: 'medium',
      location: 'Mumbai, Maharashtra',
      technicianName: 'Amit Singh',
      estimatedTime: '15 min'
    },
    {
      id: 3,
      ticketNumber: 'OLA-EV-2024-003',
      customerName: 'Rohit Gupta',
      vehicleModel: 'Ola S1 Air',
      issueType: 'Display Problem',
      status: 'technician_assigned',
      priority: 'low',
      location: 'Delhi, NCR',
      technicianName: 'Vikash Kumar',
      estimatedTime: '40 min'
    }
  ]);

  useEffect(() => {
    // Auto-select first ticket for demo
    setSelectedTicket(sampleTickets[0]);
  }, [sampleTickets]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ff4444';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#666';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'technician_assigned': return '#2196f3';
      case 'in_progress': return '#ff9800';
      case 'completed': return '#4caf50';
      default: return '#666';
    }
  };

  return (
    <div className="live-tracking-page">
      <div className="page-header">
        <h1>🔴 Live Technician Tracking</h1>
        <p>Real-time tracking of Ola Electric service technicians</p>
      </div>

      <div className="tracking-container">
        <div className="tickets-sidebar">
          <h3>Active Service Tickets</h3>
          <div className="tickets-list">
            {sampleTickets.map(ticket => (
              <div 
                key={ticket.id}
                className={`ticket-card ${selectedTicket?.id === ticket.id ? 'selected' : ''}`}
                onClick={() => setSelectedTicket(ticket)}
              >
                <div className="ticket-header">
                  <span className="ticket-number">{ticket.ticketNumber}</span>
                  <span 
                    className="priority-badge"
                    style={{ backgroundColor: getPriorityColor(ticket.priority) }}
                  >
                    {ticket.priority.toUpperCase()}
                  </span>
                </div>
                
                <div className="ticket-info">
                  <p><strong>👤 Customer:</strong> {ticket.customerName}</p>
                  <p><strong>🛵 Vehicle:</strong> {ticket.vehicleModel}</p>
                  <p><strong>⚡ Issue:</strong> {ticket.issueType}</p>
                  <p><strong>📍 Location:</strong> {ticket.location}</p>
                  <p><strong>🔧 Technician:</strong> {ticket.technicianName}</p>
                </div>
                
                <div className="ticket-status">
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(ticket.status) }}
                  >
                    {ticket.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className="eta">⏱️ {ticket.estimatedTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="tracking-main">
          <div className="tracking-tabs">
            <AllTechniciansMap />
          </div>
          
          {selectedTicket ? (
            <>
              <div className="selected-ticket-info">
                <h2>Individual Tracking: {selectedTicket.ticketNumber}</h2>
                <div className="ticket-details">
                  <span>Customer: {selectedTicket.customerName}</span>
                  <span>Issue: {selectedTicket.issueType}</span>
                  <span>Technician: {selectedTicket.technicianName}</span>
                </div>
              </div>
              <TechnicianTracker ticketId={selectedTicket.id} />
            </>
          ) : (
            <div className="no-selection">
              <h3>Select a ticket to view individual tracking</h3>
              <p>Choose from the active service tickets on the left to see detailed technician tracking.</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .live-tracking-page {
          padding: 20px;
          background: #f5f7fa;
          min-height: 100vh;
        }

        .page-header {
          text-align: center;
          margin-bottom: 30px;
          background: white;
          padding: 30px;
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .page-header h1 {
          margin: 0 0 10px 0;
          color: #333;
          font-size: 2.5em;
        }

        .page-header p {
          margin: 0;
          color: #666;
          font-size: 1.1em;
        }

        .tracking-container {
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 20px;
          height: calc(100vh - 200px);
        }

        .tickets-sidebar {
          background: white;
          border-radius: 15px;
          padding: 20px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          overflow-y: auto;
        }

        .tickets-sidebar h3 {
          margin: 0 0 20px 0;
          color: #333;
          font-size: 1.3em;
        }

        .tickets-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .ticket-card {
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          padding: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
          background: #fafafa;
        }

        .ticket-card:hover {
          border-color: #2196f3;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(33, 150, 243, 0.2);
        }

        .ticket-card.selected {
          border-color: #2196f3;
          background: #e3f2fd;
          box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
        }

        .ticket-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .ticket-number {
          font-weight: bold;
          color: #333;
          font-size: 0.9em;
        }

        .priority-badge {
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.7em;
          font-weight: bold;
        }

        .ticket-info {
          margin: 10px 0;
        }

        .ticket-info p {
          margin: 5px 0;
          font-size: 0.85em;
          color: #555;
        }

        .ticket-status {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid #e0e0e0;
        }

        .status-badge {
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.7em;
          font-weight: bold;
        }

        .eta {
          font-size: 0.8em;
          color: #666;
          font-weight: bold;
        }

        .tracking-main {
          background: white;
          border-radius: 15px;
          padding: 20px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .tracking-tabs {
          margin-bottom: 20px;
        }

        .selected-ticket-info {
          margin-bottom: 20px;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          color: white;
        }

        .selected-ticket-info h2 {
          margin: 0 0 10px 0;
          font-size: 1.5em;
        }

        .ticket-details {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }

        .ticket-details span {
          background: rgba(255,255,255,0.2);
          padding: 5px 10px;
          border-radius: 15px;
          font-size: 0.9em;
        }

        .no-selection {
          text-align: center;
          padding: 50px;
          color: #666;
        }

        .no-selection h3 {
          margin-bottom: 10px;
          color: #333;
        }

        @media (max-width: 768px) {
          .tracking-container {
            grid-template-columns: 1fr;
            height: auto;
          }
          
          .tickets-sidebar {
            order: 2;
            max-height: 300px;
          }
          
          .tracking-main {
            order: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default LiveTracking;