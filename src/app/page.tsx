import { ClientPage } from '@/components/ClientPage';
import type { Station } from '@/types';

/**
 * Fetches station data from the API route.
 * This function runs only on the server.
 */
async function getStations(): Promise<Station[]> {
  // Use a direct fetch to our own API route.
  // "no-store" ensures the data is fetched fresh on every request.
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
 * It fetches data on the server and passes it to a Client Component.
 */
export default async function HomePage() {
  const allStations = await getStations();

  return <ClientPage allStations={allStations} />;
}
