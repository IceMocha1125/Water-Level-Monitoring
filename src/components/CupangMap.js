import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function CupangMap() {
  // Coordinates for Cupang Proper, Balanga City
  const center = [14.662597959669037, 120.54675679945782];
  const sensorLocation = [14.662597959669037, 120.54675679945782];

  return (
    <MapContainer 
      center={center} 
      zoom={16} 
      style={{ height: '100%', width: '100%', borderRadius: '8px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={sensorLocation}>
        <Popup>
          <div>
            <h3>Water Level Sensor</h3>
            <p>Location: Cupang Proper, Balanga City</p>
            <p>Coordinates: {sensorLocation[0]}, {sensorLocation[1]}</p>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}

export default CupangMap; 