import { Container } from '@mui/material';
import { notFound } from 'next/navigation';
import { StationDetailPage } from '@/components/StationDetailPage';
import type { Station } from '@/types';

/**
 * Fetches single station data from the API route.
 * This function runs only on the server.
 */
async function getStation(code: string): Promise<Station | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/stations/${code}`,
    { cache: 'no-store' },
  );

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error('Failed to fetch station data');
  }
  return res.json();
}

/**
 * This is a Server Component for the dynamic route.
 * It fetches the data and renders the detail page.
 */
export default async function StationPage({
  params,
}: {
  params: { code: string };
}) {
  const station = await getStation(params.code);

  if (!station) {
    notFound();
  }

  return (
    <Container maxWidth='md' sx={{ mt: 4, mb: 4 }}>
      <StationDetailPage station={station} />
    </Container>
  );
}
