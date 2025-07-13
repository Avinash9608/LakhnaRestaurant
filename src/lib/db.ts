import mongoose from 'mongoose';

const connection: { isConnected?: number } = {};

async function dbConnect() {
  if (connection.isConnected) {
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || process.env.ATLAS_URI || process.env.ATLAS_URL!, {
      dbName: 'gastronomic-gateway',
    });

    connection.isConnected = db.connections[0].readyState;
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Database connection failed', error);
    process.exit(1);
  }
}

export default dbConnect;
export { dbConnect as connectDB };
