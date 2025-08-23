import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

// Ensure MONGO_URI is in .env.local file
const uri = process.env.MONGO_URI;
if (!uri) {
  throw new Error('MONGO_URI is not defined.');
}
const client = new MongoClient(uri);

export async function GET(
  _: Request,
  { params }: { params: { code: string } },
) {
  try {
    await client.connect();
    const db = client.db('timescar');
    const station = await db
      .collection('stations')
      .findOne({ station_code: params.code });

    if (!station) {
      return NextResponse.json(
        { message: 'Station not found' },
        { status: 404 },
      );
    }

    // Convert ObjectId to string for JSON serialization
    const serializedStation = {
      ...station,
      _id: station._id.toString(),
    };

    return NextResponse.json(serializedStation);
  } catch (error) {
    console.error('Failed to fetch station:', error);
    return NextResponse.json(
      { message: 'Failed to fetch station data' },
      { status: 500 },
    );
  } finally {
    // await client.close();
  }
}
