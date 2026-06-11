import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../contexts/SocketContext';

const TechnicianTracker = ({ ticketId }) => {
  const [technicianLocation, setTechnicianLocation] = useState(null);
  const [customerLocation, setCustomerLocation] = useState(null);
  const [route, setRoute] = useState(null);
  const [eta, setEta] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const socket = useSocket();

  useEffect(() => {
    if (socket && ticketId) {
      // Join ticket room for real-time updates
      socket.emit('join-ticket', ticketId);

      // Listen for technician location updates
      socket.on('technician-location-update', (data) => {
        setTechnicianLocation({
          lat: data.latitude,
          lng: data.longitude,
          timestamp: data.timestamp
        });
        setEta(data.eta);
      });

      // Listen for route updates
      socket.on('route-update', (routeData) => {
        setRoute(routeData);
      });

      return () => {
        socket.off('technician-location-update');
        socket.off('route-update');
        socket.emit('leave-ticket', ticketId);
      };
    }
  }, [socket, ticketId]);

  useEffect(() => {
    // Load MapMyIndia script and initialize map
    loadMapScript();
    // Fetch initial ticket data
    fetchTicketData();
  }, [ticketId]);

  const loadMapScript = () => {
    if (window.L) {
      initializeMap();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = initializeMap;
    document.head.appendChild(script);
  };

  const initializeMap = () => {
    if (mapRef.current && !mapInstance.current && window.L) {
      mapInstance.current = window.L.map(mapRef.current).setView([23.0225, 72.5714], 12);
      
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstance.current);
      
      setMapLoaded(true);
      console.log('Leaflet map loaded successfully');
    }
  };

  const fetchTicketData = async () => {
    try {
      // Map ticket locations to actual coordinates
      const locationMap = {
        'Ahmedabad, Gujarat': { lat: 23.0225, lng: 72.5714, name: 'Ahmedabad, Gujarat' },
        'Mumbai, Maharashtra': { lat: 19.0760, lng: 72.8777, name: 'Mumbai, Maharashtra' },
        'Delhi, NCR': { lat: 28.6139, lng: 77.2090, name: 'Delhi, NCR' }
      };
      
      // Get ticket data from parent component or use current ticket
      const ticketData = {
        1: { location: 'Ahmedabad, Gujarat', technician: 'Raj Kumar', customer: 'Arjun Patel' },
        2: { location: 'Mumbai, Maharashtra', technician: 'Amit Singh', customer: 'Priya Sharma' },
        3: { location: 'Delhi, NCR', technician: 'Vikash Kumar', customer: 'Rohit Gupta' }
      };
      
      const currentTicket = ticketData[ticketId] || ticketData[1];
      const location = locationMap[currentTicket.location];
      
      if (location) {
        setCustomerLocation({
          lat: location.lat,
          lng: location.lng,
          name: currentTicket.location,
          customer: currentTicket.customer
        });
        
        // Set technician near customer location
        setTimeout(() => {
          setTechnicianLocation({
            lat: location.lat + (Math.random() - 0.5) * 0.02,
            lng: location.lng + (Math.random() - 0.5) * 0.02,
            timestamp: new Date().toISOString(),
            name: currentTicket.technician,
            vehicle: 'Service Van - ' + currentTicket.technician.split(' ')[0].toUpperCase() + '01'
          });
          setEta(Math.floor(Math.random() * 30) + 10);
        }, 1000);
      }
    } catch (error) {
      console.error('Error fetching ticket data:', error);
    }
  };

  // Update markers when locations change
  useEffect(() => {
    if (mapInstance.current && mapLoaded) {
      updateMarkers();
    }
  }, [technicianLocation, customerLocation, mapLoaded]);

  const updateMarkers = () => {
    if (!window.L) return;
    
    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstance.current.removeLayer(marker);
    });
    markersRef.current = [];

    // Add customer marker
    if (customerLocation) {
      const customerIcon = window.L.divIcon({
        html: `<div style="background: #4caf50; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">C</div>`,
        iconSize: [30, 30],
        className: 'custom-marker-icon'
      });
      
      const customerMarker = window.L.marker([customerLocation.lat, customerLocation.lng], {
        icon: customerIcon
      }).addTo(mapInstance.current);
      
      customerMarker.bindPopup(`<b>🏠 Customer: ${customerLocation.customer || 'Customer'}</b><br>📍 ${customerLocation.name || 'Service Location'}<br><small>⚡ Electric Scooter Service Required</small>`);
      markersRef.current.push(customerMarker);
    }

    // Add technician marker
    if (technicianLocation) {
      const techIcon = window.L.divIcon({
        html: `<div style="background: #2196f3; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">T</div>`,
        iconSize: [30, 30],
        className: 'custom-marker-icon'
      });
      
      const techMarker = window.L.marker([technicianLocation.lat, technicianLocation.lng], {
        icon: techIcon
      }).addTo(mapInstance.current);
      
      techMarker.bindPopup(`<b>🔧 ${technicianLocation.name || 'Technician'}</b><br>📍 Current Location<br>🚐 ${technicianLocation.vehicle || 'Service Vehicle'}<br>⏱️ ETA: ${eta || '--'} minutes<br><small>Last updated: ${new Date(technicianLocation.timestamp).toLocaleTimeString()}</small>`);
      markersRef.current.push(techMarker);
      
      // Center map on technician
      mapInstance.current.setView([technicianLocation.lat, technicianLocation.lng], 14);
    }
    
    // Fit map to show both markers if both exist
    if (customerLocation && technicianLocation && markersRef.current.length > 1) {
      try {
        const group = new window.L.featureGroup(markersRef.current);
        const bounds = group.getBounds();
        if (bounds.isValid()) {
          mapInstance.current.fitBounds(bounds.pad(0.1));
        }
      } catch (error) {
        console.log('Bounds fitting skipped:', error.message);
      }
    }
  };

  // Simulate live tracking
  useEffect(() => {
    if (!technicianLocation) return;
    
    const interval = setInterval(() => {
      setTechnicianLocation(prev => {
        if (!prev) return prev;
        
        // Simulate realistic movement towards customer
        const moveTowardsCustomer = customerLocation && Math.random() > 0.3;
        let newLat = prev.lat;
        let newLng = prev.lng;
        
        if (moveTowardsCustomer && customerLocation) {
          const latDiff = customerLocation.lat - prev.lat;
          const lngDiff = customerLocation.lng - prev.lng;
          newLat = prev.lat + latDiff * 0.02 + (Math.random() - 0.5) * 0.0005;
          newLng = prev.lng + lngDiff * 0.02 + (Math.random() - 0.5) * 0.0005;
        } else {
          newLat = prev.lat + (Math.random() - 0.5) * 0.001;
          newLng = prev.lng + (Math.random() - 0.5) * 0.001;
        }
        
        return {
          ...prev,
          lat: newLat,
          lng: newLng,
          timestamp: new Date().toISOString()
        };
      });
      
      setEta(prev => {
        const newEta = prev > 1 ? prev - 1 : 1;
        return Math.random() > 0.8 ? newEta + 1 : newEta; // Occasional traffic delays
      });
    }, 4000);
    
    return () => clearInterval(interval);
  }, [technicianLocation]);

  return (
    <div className="technician-tracker">
      <div className="tracker-header">
        <h3>Live Technician Tracking</h3>
        {eta && (
          <div className="eta-display">
            <span className="eta-label">🕐 ETA:</span>
            <span className="eta-value">{eta} min</span>
            <span className="status-indicator">🟢 En Route</span>
          </div>
        )}
      </div>
      
      <div 
        ref={mapRef} 
        style={{ 
          width: '100%', 
          height: '500px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          backgroundColor: '#f5f5f5'
        }}
      >
        {!mapLoaded && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            fontSize: '16px',
            color: '#666'
          }}>
            🗺️ Loading Live Tracking Map...
          </div>
        )}
      </div>
      
      <div className="tracking-info">
        {technicianLocation && (
          <div className="location-info">
            <div className="info-grid">
              <div className="info-item">
                <span className="label">👨‍🔧 Technician:</span>
                <span className="value">{technicianLocation.name || 'Raj Kumar'}</span>
              </div>
              <div className="info-item">
                <span className="label">🚐 Vehicle:</span>
                <span className="value">{technicianLocation.vehicle || 'Service Van'}</span>
              </div>
              <div className="info-item">
                <span className="label">📍 Last Update:</span>
                <span className="value">{new Date(technicianLocation.timestamp).toLocaleTimeString()}</span>
              </div>
              <div className="info-item">
                <span className="label">📊 Status:</span>
                <span className="value status-active">Active Tracking</span>
              </div>
            </div>
          </div>
        )}
        
        {!technicianLocation && (
          <div className="no-tracking">
            <p>Technician location not available. Tracking will start once technician is assigned and en route.</p>
          </div>
        )}
      </div>
      
      <style jsx>{`
        .technician-tracker {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .tracker-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .tracker-header h3 {
          margin: 0;
          color: #333;
        }
        
        .eta-display {
          background: linear-gradient(135deg, #e8f5e8, #f0f8f0);
          padding: 10px 20px;
          border-radius: 25px;
          border: 2px solid #4caf50;
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 2px 8px rgba(76, 175, 80, 0.2);
        }
        
        .eta-label {
          color: #666;
          margin-right: 8px;
        }
        
        .eta-value {
          font-weight: bold;
          color: #4caf50;
          font-size: 18px;
        }
        
        .status-indicator {
          background: #4caf50;
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: bold;
        }
        
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }
        
        .info-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .info-item .label {
          font-size: 12px;
          color: #666;
          font-weight: 500;
        }
        
        .info-item .value {
          font-weight: bold;
          color: #333;
        }
        
        .status-active {
          color: #4caf50;
        }
        
        .tracking-info {
          margin-top: 15px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
        }
        
        .location-info p {
          margin: 0;
          color: #666;
        }
        
        .no-tracking {
          text-align: center;
          color: #999;
        }
        
        :global(.custom-marker-icon) {
          background: transparent !important;
          border: none !important;
        }
      `}</style>
    </div>
  );
};

export default TechnicianTracker;