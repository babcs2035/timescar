'use client';

import { alpha, Box, Button, Stack, Typography, useTheme } from '@mui/material';
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  ZoomControl,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '@/styles/leaflet-custom.css';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import Link from 'next/link';
import { useMemo } from 'react';
import MarkerClusterGroup from 'react-leaflet-cluster';
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
  const theme = useTheme();

  const iconCreateFunction = useMemo(() => {
    interface ClusterSize {
      small: number;
      medium: number;
      large: number;
    }

    interface ClusterIcon {
      getChildCount(): number;
    }

    const CLUSTER_SIZES: ClusterSize = {
      small: 32,
      medium: 40,
      large: 48,
    };

    const FONT_SIZES: ClusterSize = {
      small: 12,
      medium: 14,
      large: 16,
    };

    return (cluster: ClusterIcon): L.DivIcon => {
      const count: number = cluster.getChildCount();
      let size: keyof ClusterSize = 'small';
      if (count >= 16 && count < 128) size = 'medium';
      if (count >= 128) size = 'large';

      let color: string = theme.palette.primary.main;
      if (count >= 16 && count < 128) color = theme.palette.success.main;
      if (count >= 128) color = theme.palette.secondary.main;

      const html: string = `<div style="
        background-color: ${color};
        color: white;
        width: ${CLUSTER_SIZES[size]}px;
        height: ${CLUSTER_SIZES[size]}px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: ${FONT_SIZES[size]}px;
        border: 2px solid ${alpha('#fff', 0.8)};
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      ">${count}</div>`;

      return L.divIcon({
        html: html,
        className: 'custom-cluster-icon',
        iconSize: L.point(CLUSTER_SIZES[size], CLUSTER_SIZES[size]),
      });
    };
  }, [theme]);

  return (
    <Box sx={{ flexGrow: 1, position: 'relative' }}>
      <MapContainer
        center={[35.6895, 139.6917]}
        zoom={10}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          url='https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={iconCreateFunction}
        >
          {stations.map(station => (
            <Marker
              key={station._id}
              position={[station.latitude, station.longitude]}
            >
              <Popup>
                <Stack spacing={1.5}>
                  <Box>
                    <Typography
                      variant='subtitle1'
                      sx={{ fontWeight: 600, lineHeight: 1.3 }}
                    >
                      {station.station_name}
                    </Typography>
                    <Typography variant='caption' color='text.secondary'>
                      {station.address}
                    </Typography>
                  </Box>
                  <Box>
                    <Link
                      href={`/station/${station.station_code}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <Button variant='contained' size='small' fullWidth>
                        詳細を見る
                      </Button>
                    </Link>
                  </Box>
                </Stack>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
        <ZoomControl position='bottomright' />
      </MapContainer>
    </Box>
  );
}
