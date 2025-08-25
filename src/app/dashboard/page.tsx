import { DashboardPageClient } from '@/components/DashboardPageClient';
import type { Station } from '@/types';

/**
 * Fetches all station data from the API route.
 * This function runs only on the server.
 */
async function getStations(): Promise<Station[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stations`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch station data');
  }
  return res.json();
}

export default async function DashboardPage() {
  const allStations = await getStations();

  // 1. Geographical Distribution: Stations by Prefecture
  const prefectureStationCounts: { [key: string]: number } = {};
  allStations.forEach(station => {
    const prefecture =
      station.address.match(/^(.{2,3}?[都道府県])/)?.[0] || 'その他';
    prefectureStationCounts[prefecture] =
      (prefectureStationCounts[prefecture] || 0) + 1;
  });
  const prefectureStationChartData = Object.entries(prefectureStationCounts)
    .sort(([, countA], [, countB]) => countB - countA)
    .map(([name, count]) => ({ name, count }));

  // 2. NEW: Car Count by Prefecture
  const prefectureCarCounts: { [key: string]: number } = {};
  allStations.forEach(station => {
    const prefecture =
      station.address.match(/^(.{2,3}?[都道府県])/)?.[0] || 'その他';
    prefectureCarCounts[prefecture] =
      (prefectureCarCounts[prefecture] || 0) + station.car_fleet.length;
  });
  const prefectureCarCountChartData = Object.entries(prefectureCarCounts)
    .sort(([, countA], [, countB]) => countB - countA)
    .map(([name, count]) => ({ name, count }));

  // 3. Vehicle Composition: Class Ratio & Top 20 Cars
  const classCounts: { [key: string]: number } = {};
  const carNameCounts: { [key: string]: number } = {};
  let totalCars = 0;
  allStations.forEach(station => {
    totalCars += station.car_fleet.length;
    station.car_fleet.forEach(car => {
      classCounts[car.class_name] = (classCounts[car.class_name] || 0) + 1;
      carNameCounts[car.car_name] = (carNameCounts[car.car_name] || 0) + 1;
    });
  });
  const classPieData = Object.entries(classCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const top16CarData = Object.entries(carNameCounts)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, 16)
    .map(([name, count]) => ({ name, count }));

  const totalCarModels = Object.keys(carNameCounts).length;
  const heatmapData = allStations.map(
    s =>
      [s.latitude, s.longitude, s.car_fleet.length] as [number, number, number],
  );

  return (
    <DashboardPageClient
      totalStations={allStations.length}
      totalCars={totalCars}
      prefectureStationChartData={prefectureStationChartData}
      prefectureCarCountChartData={prefectureCarCountChartData}
      classPieData={classPieData}
      top16CarData={top16CarData}
      heatmapData={heatmapData}
      totalCarModels={totalCarModels}
    />
  );
}
