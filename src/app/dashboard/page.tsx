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

/**
 * This is a Server Component.
 * It fetches data and performs all necessary analysis and aggregation.
 */
export default async function DashboardPage() {
  const allStations = await getStations();

  // 1. Geographical Distribution: Stations by Prefecture
  const prefectureCounts: { [key: string]: number } = {};
  allStations.forEach(station => {
    const prefecture =
      station.address.match(/^(.{2,3}?[都道府県])/)?.[0] || 'その他';
    prefectureCounts[prefecture] = (prefectureCounts[prefecture] || 0) + 1;
  });
  const prefectureChartData = Object.entries(prefectureCounts).map(
    ([name, count]) => ({ name, count }),
  );

  // 2. Scale Distribution: Car Count Histogram & Average
  const carCounts = allStations.map(station => station.car_fleet.length);
  const totalCars = carCounts.reduce((sum, count) => sum + count, 0);
  const averageCars =
    allStations.length > 0 ? totalCars / allStations.length : 0;

  const histogramData: { name: string; count: number }[] = [];
  for (let i = 0; i <= 10; i++) {
    const min = i * 2;
    const max = min + 1;
    const name = `${min}-${max}`;
    const count = carCounts.filter(c => c >= min && c <= max).length;
    histogramData.push({ name, count });
  }

  // 3. Vehicle Composition: Class Ratio & Top 10 Cars
  const classCounts: { [key: string]: number } = {};
  const carNameCounts: { [key: string]: number } = {};
  allStations.forEach(station => {
    station.car_fleet.forEach(car => {
      classCounts[car.class_name] = (classCounts[car.class_name] || 0) + 1;
      carNameCounts[car.car_name] = (carNameCounts[car.car_name] || 0) + 1;
    });
  });
  const classPieData = Object.entries(classCounts).map(([name, value]) => ({
    name,
    value,
  }));
  const top10CarData = Object.entries(carNameCounts)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }));

  // 4. Heatmap Data
  const heatmapData: [number, number, number][] = allStations.map(s => [
    s.latitude,
    s.longitude,
    s.car_fleet.length,
  ]);

  return (
    <DashboardPageClient
      averageCars={averageCars}
      prefectureChartData={prefectureChartData}
      histogramData={histogramData}
      classPieData={classPieData}
      top10CarData={top10CarData}
      heatmapData={heatmapData}
    />
  );
}
