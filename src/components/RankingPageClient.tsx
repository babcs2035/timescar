'use client';

import Link from 'next/link';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Avatar,
  ListItemAvatar,
} from '@mui/material';

// Type for ranked station data
export interface RankedStation {
  code: string;
  name: string;
  value: number;
  unit: string;
}

interface RankingPageClientProps {
  topByCarCount: RankedStation[];
  topByVariety: RankedStation[];
}

// A reusable component to render a single ranking list
const RankingList = ({
  title,
  stations,
}: {
  title: string;
  stations: RankedStation[];
}) => (
  <Card>
    <CardContent>
      <Typography variant='h5' component='h2' gutterBottom>
        {title}
      </Typography>
      <List>
        {stations.map((station, index) => (
          <ListItem
            key={station.code}
            component={Link}
            href={`/station/${station.code}`}
          >
            <ListItemAvatar>
              <Avatar
                sx={{ bgcolor: index < 3 ? 'secondary.main' : 'grey.500' }}
              >
                {index + 1}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={station.name}
              secondary={`${station.value} ${station.unit}`}
            />
          </ListItem>
        ))}
      </List>
    </CardContent>
  </Card>
);

export function RankingPageClient({
  topByCarCount,
  topByVariety,
}: RankingPageClientProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 4,
      }}
    >
      <Box sx={{ flex: 1 }}>
        <RankingList
          title='車両台数ランキング TOP10'
          stations={topByCarCount}
        />
      </Box>
      <Box sx={{ flex: 1 }}>
        <RankingList
          title='車種バリエーションランキング TOP10'
          stations={topByVariety}
        />
      </Box>
    </Box>
  );
}
