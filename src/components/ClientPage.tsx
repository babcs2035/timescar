'use client';

import { Box, CircularProgress, Container } from '@mui/material';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import { FilterPanel } from '@/components/FilterPanel';
import type { Station } from '@/types';

const StationMap = dynamic(
  () => import('@/components/StationMap').then(mod => mod.StationMap),
  {
    ssr: false,
    loading: () => (
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f0f0f0',
        }}
      >
        <CircularProgress />
      </Box>
    ),
  },
);

interface ClientPageProps {
  allStations: Station[];
}

export function ClientPage({ allStations }: ClientPageProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Filter states are managed on the client
  const [selectedPrefecture, setSelectedPrefecture] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedCarNames, setSelectedCarNames] = useState<string[]>([]);

  // Filtering logic runs on the client
  const filteredStations = useMemo(() => {
    return allStations.filter(station => {
      const prefectureMatch =
        selectedPrefecture === 'all' ||
        station.address.startsWith(selectedPrefecture);
      const cityMatch =
        selectedCity === 'all' || station.address.includes(selectedCity);
      const nameMatch =
        selectedCarNames.length === 0 ||
        selectedCarNames.some(selectedName =>
          station.car_fleet.some(car => car.car_name === selectedName),
        );
      return prefectureMatch && cityMatch && nameMatch;
    });
  }, [allStations, selectedPrefecture, selectedCity, selectedCarNames]);

  return (
    <Container
      maxWidth={false}
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        p: { xs: 0 },
      }}
    >
      <FilterPanel
        stations={allStations}
        selectedPrefecture={selectedPrefecture}
        setSelectedPrefecture={setSelectedPrefecture}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        selectedCarNames={selectedCarNames}
        setSelectedCarNames={setSelectedCarNames}
        filteredCount={filteredStations.length}
      />
      {isClient ? (
        <StationMap stations={filteredStations} />
      ) : (
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f0f0f0',
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Container>
  );
}
