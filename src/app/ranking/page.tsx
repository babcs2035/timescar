import { RankingPageClient, type RankedStation } from '@/components/RankingPageClient';
import type { Station } from '@/types';

/**
 * Fetches all station data from the API route.
 * This function runs only on the server.
 */
async function getStations(): Promise<Station[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stations`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch station data');
  }
  return res.json();
}

/**
 * This is a Server Component.
 * It fetches data, calculates rankings, and passes the results to a Client Component.
 */
export default async function RankingPage() {
  const allStations = await getStations();

  // 1. Calculate Top 10 by number of cars
  const topByCarCount: RankedStation[] = [...allStations]
    .map(station => ({
      code: station.station_code,
      name: station.station_name,
      value: station.car_fleet.length,
      unit: '台'
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  // 2. Calculate Top 10 by variety of car models
  const topByVariety: RankedStation[] = [...allStations]
    .map(station => ({
      code: station.station_code,
      name: station.station_name,
      value: new Set(station.car_fleet.map(car => car.car_name)).size,
      unit: '車種'
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  return (
    <RankingPageClient
      topByCarCount={topByCarCount}
      topByVariety={topByVariety}
    />
  );
}
