'use client';

import { Box, Button, Chip, Typography } from '@mui/material';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
// Fix for default marker icon path issue
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import Link from 'next/link';
import type { Station } from '@/types';

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
                {/* 予約ラベル */}
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
              <Box mt={2}>
                <Link
                  href={`/station/${station.station_code}`}
                  style={{ textDecoration: 'none' }}
                >
                  <Button variant='contained' size='small'>
                    詳細を見る
                  </Button>
                </Link>
              </Box>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
}
