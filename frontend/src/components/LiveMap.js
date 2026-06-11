import React, { useEffect, useRef, useState } from 'react';

const LiveMap = ({ 
  center = { lat: 28.6139, lng: 77.2090 }, 
  zoom = 12,
  markers = [],
  onLocationSelect,
  height = '400px'
}) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Load MapMyIndia script
    const script = document.createElement('script');
    script.src = 'https://apis.mapmyindia.com/advancedmaps/api/1701f3594ca4939aa68f2c7378c164ac/map_sdk?layer=vector&v=3.0';
    script.async = true;
    script.onload = initializeMap;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const initializeMap = () => {
    if (window.MapmyIndia && mapRef.current) {
      const mapInstance = new window.MapmyIndia.Map(mapRef.current, {
        center: [center.lat, center.lng],
        zoom: zoom,
        zoomControl: true,
        location: true
      });

      setMap(mapInstance);
      setMapLoaded(true);

      // Add click event listener
      if (onLocationSelect) {
        mapInstance.on('click', (e) => {
          const { lat, lng } = e.latlng;
          onLocationSelect({ lat, lng });
        });
      }
    }
  };

  useEffect(() => {
    if (map && mapLoaded && markers.length > 0) {
      // Clear existing markers
      map.eachLayer((layer) => {
        if (layer instanceof window.MapmyIndia.Marker) {
          map.removeLayer(layer);
        }
      });

      // Add new markers
      markers.forEach((marker) => {
        const mapMarker = new window.MapmyIndia.Marker([marker.lat, marker.lng])
          .addTo(map);

        if (marker.popup) {
          mapMarker.bindPopup(marker.popup);
        }
      });
    }
  }, [map, mapLoaded, markers]);

  return (
    <div 
      ref={mapRef} 
      style={{ 
        width: '100%', 
        height: height,
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
          backgroundColor: '#f5f5f5'
        }}>
          Loading Map...
        </div>
      )}
    </div>
  );
};

export default LiveMap;