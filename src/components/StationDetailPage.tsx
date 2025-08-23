'use client';

import {
  Box,
  Typography,
  Paper,
  Link,
  Chip,
  List,
  ListItem,
  ListItemText,
  Stack,
} from '@mui/material';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import type { Station } from '@/types';

const Carousel = dynamic(
  () => import('react-responsive-carousel').then(mod => mod.Carousel),
  { ssr: false },
);
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Carousel styles
import type { CarouselProps } from 'react-responsive-carousel';

interface StationDetailPageProps {
  station: Station;
}

export function StationDetailPage({ station }: StationDetailPageProps) {
  return (
    <Paper sx={{ p: 4, my: 4 }}>
      <Stack spacing={4}>
        {/* Station Header */}
        <Box>
          <Typography variant='h4' component='h1' gutterBottom>
            {station.station_name}
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            {station.address}
          </Typography>
          <Link
            href={`https://www.google.com/maps/search/?api=1&query=${station.latitude},${station.longitude}`}
            target='_blank'
            rel='noopener'
            sx={{ mt: 1, display: 'inline-block' }}
          >
            Google Maps で開く
          </Link>
        </Box>

        {/* Photo Gallery */}
        {station.photo_urls && station.photo_urls.length > 0 && (
          <Box>
            <Box sx={{ maxWidth: '100%', mx: 'auto' }}>
              <Carousel
                {...({
                  showThumbs: false,
                  infiniteLoop: true,
                  useKeyboardArrows: true,
                  autoPlay: true,
                } as CarouselProps)}
              >
                {station.photo_urls.map((url, index) => (
                  <Box key={url}>
                    <Image
                      src={url}
                      alt={`Station view ${index + 1}`}
                      width={800}
                      height={600}
                      style={{
                        width: '100%',
                        height: 'auto',
                        objectFit: 'cover',
                      }}
                    />
                  </Box>
                ))}
              </Carousel>
            </Box>
          </Box>
        )}

        {/* Car Fleet List */}
        <Box>
          <Typography variant='h5' component='h2' gutterBottom>
            車両リスト
          </Typography>
          <List sx={{ border: '1px solid #eee', borderRadius: 2 }}>
            {station.car_fleet.map((car, index) => (
              <ListItem
                key={car.car_name}
                sx={{
                  borderBottom:
                    index < station.car_fleet.length - 1
                      ? '1px solid #eee'
                      : 'none',
                }}
              >
                <ListItemText
                  primary={
                    <Typography variant='subtitle1'>
                      {car.car_name}{' '}
                      <Chip
                        label={car.class_name}
                        size='small'
                        sx={{ ml: 1 }}
                      />
                    </Typography>
                  }
                  secondary={
                    <Typography variant='body2' color='text.secondary'>
                      {car.car_comments || 'No comments'}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Reservation Labels */}
        <Box>
          <Typography variant='h5' component='h2' gutterBottom>
            予約ラベル
          </Typography>
          <Stack direction='row' spacing={1}>
            <Chip
              label={`1ヶ月先: ${station.disp1MonthReserveLabel || 'N/A'}`}
              color='primary'
              variant='outlined'
            />
            <Chip
              label={`3ヶ月先: ${station.disp3MonthReserveLabel || 'N/A'}`}
              color='secondary'
              variant='outlined'
            />
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
}
