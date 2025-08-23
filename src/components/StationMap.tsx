'use client';

import { Box, Typography, Chip } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { Station } from '@/types';

// Fix for default marker icon path issue
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface StationMapProps {
  stations: Station[];
}

export function StationMap({ stations }: StationMapProps) {
  return (
    <Box sx={{ flexGrow: 1, position: 'relative' }}>
      <MapContainer
        center={[35.6895, 139.6917]}
        zoom={10}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {stations.map(station => (
          <Marker
            key={station._id}
            position={[station.latitude, station.longitude]}
          >
            <Popup>
              <Typography variant='h6' component='div'>
                {station.station_name}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {station.address}
              </Typography>
              <Box mt={1}>
                <Chip
                  label={`1-Month: ${station.disp1MonthReserveLabel || 'N/A'}`}
                  size='small'
                  sx={{ mr: 1, mb: 1 }}
                />
                <Chip
                  label={`3-Month: ${station.disp3MonthReserveLabel || 'N/A'}`}
                  size='small'
                  sx={{ mb: 1 }}
                />
              </Box>
              <Typography variant='subtitle2' sx={{ mt: 1 }}>
                Car Fleet:
              </Typography>
              <Box component='ul' sx={{ m: 0, pl: 2.5 }}>
                {station.car_fleet.map((car, index) => (
                  <li key={`${car.class_name}-${car.car_name}-${index}`}>
                    <Typography variant='caption'>
                      {car.class_name}: {car.car_name}
                    </Typography>
                  </li>
                ))}
              </Box>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
}
