import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

// Ensure MONGO_URI is in .env.local file
const uri = process.env.MONGO_URI;
if (!uri) {
  throw new Error('MONGO_URI is not defined.');
}
const client = new MongoClient(uri);

// Type definitions for internal use
interface Station {
  _id: object;
}

export async function GET() {
  try {
    await client.connect();
    const db = client.db('timescar');
    const stations = await db.collection('stations').find({}).toArray();

    // Convert ObjectId to string for JSON serialization
    const serializedStations = stations.map((station: Station) => ({
      ...station,
      _id: station._id.toString(),
    }));

    return NextResponse.json(serializedStations);
  } catch (error) {
    console.error('Failed to fetch stations:', error);
    return NextResponse.json(
      { message: 'Failed to fetch station data' },
      { status: 500 },
    );
  } finally {
    // It"s good practice to close the client if you"re not using a global connection
    // await client.close();
  }
}
