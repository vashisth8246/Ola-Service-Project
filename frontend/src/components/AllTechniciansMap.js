import React, { useState, useEffect, useRef } from 'react';

const AllTechniciansMap = () => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);

  const techniciansData = [
    {
      id: 1,
      name: 'Raj Kumar',
      ticket: 'OLA-EV-2024-001',
      customer: 'Arjun Patel',
      location: 'Ahmedabad, Gujarat',
      lat: 23.0225,
      lng: 72.5714,
      status: 'En Route',
      eta: '25 min',
      vehicle: 'RAJ01'
    },
    {
      id: 2,
      name: 'Amit Singh',
      ticket: 'OLA-EV-2024-002',
      customer: 'Priya Sharma',
      location: 'Mumbai, Maharashtra',
      lat: 19.0760,
      lng: 72.8777,
      status: 'In Progress',
      eta: '15 min',
      vehicle: 'AMI01'
    },
    {
      id: 3,
      name: 'Vikash Kumar',
      ticket: 'OLA-EV-2024-003',
      customer: 'Rohit Gupta',
      location: 'Delhi, NCR',
      lat: 28.6139,
      lng: 77.2090,
      status: 'Assigned',
      eta: '40 min',
      vehicle: 'VIK01'
    }
  ];

  useEffect(() => {
    loadMapScript();
  }, []);

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
      mapInstance.current = window.L.map(mapRef.current).setView([23.0225, 72.5714], 5);
      
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstance.current);
      
      setMapLoaded(true);
      addAllTechnicians();
    }
  };

  const addAllTechnicians = () => {
    if (!window.L || !mapInstance.current) return;

    techniciansData.forEach(tech => {
      const icon = window.L.divIcon({
        html: `<div style="background: #ff4444; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">${tech.name.split(' ')[0][0]}</div>`,
        iconSize: [30, 30],
        className: 'custom-marker-icon'
      });
      
      const marker = window.L.marker([tech.lat, tech.lng], { icon })
        .addTo(mapInstance.current);
      
      marker.bindPopup(`
        <b>🔧 ${tech.name}</b><br>
        📋 ${tech.ticket}<br>
        👤 Customer: ${tech.customer}<br>
        📍 ${tech.location}<br>
        🚐 Vehicle: ${tech.vehicle}<br>
        📊 Status: ${tech.status}<br>
        ⏱️ ETA: ${tech.eta}
      `);
      
      markersRef.current.push(marker);
    });

    // Fit map to show all markers
    if (markersRef.current.length > 0) {
      const group = new window.L.featureGroup(markersRef.current);
      mapInstance.current.fitBounds(group.getBounds().pad(0.1));
    }
  };

  return (
    <div className="all-technicians-map">
      <h3>🗺️ All Active Technicians</h3>
      <div 
        ref={mapRef} 
        style={{ 
          width: '100%', 
          height: '400px',
          border: '1px solid #ddd',
          borderRadius: '8px'
        }}
      >
        {!mapLoaded && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            color: '#666'
          }}>
            🗺️ Loading All Technicians Map...
          </div>
        )}
      </div>
      
      <div className="technicians-list">
        {techniciansData.map(tech => (
          <div key={tech.id} className="tech-item">
            <span className="tech-name">🔧 {tech.name}</span>
            <span className="tech-location">📍 {tech.location}</span>
            <span className={`tech-status status-${tech.status.toLowerCase().replace(' ', '-')}`}>
              {tech.status}
            </span>
          </div>
        ))}
      </div>

      <style jsx>{`
        .all-technicians-map {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .all-technicians-map h3 {
          margin: 0 0 15px 0;
          color: #333;
        }
        
        .technicians-list {
          margin-top: 15px;
          display: grid;
          gap: 10px;
        }
        
        .tech-item {
          display: grid;
          grid-template-columns: 1fr 1fr auto;
          gap: 10px;
          padding: 10px;
          background: #f8f9fa;
          border-radius: 6px;
          align-items: center;
        }
        
        .tech-name {
          font-weight: bold;
          color: #333;
        }
        
        .tech-location {
          color: #666;
          font-size: 0.9em;
        }
        
        .tech-status {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.8em;
          font-weight: bold;
          color: white;
        }
        
        .status-en-route {
          background: #2196f3;
        }
        
        .status-in-progress {
          background: #ff9800;
        }
        
        .status-assigned {
          background: #4caf50;
        }
        
        :global(.custom-marker-icon) {
          background: transparent !important;
          border: none !important;
        }
      `}</style>
    </div>
  );
};

export default AllTechniciansMap;