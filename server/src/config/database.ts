import mongoose from 'mongoose';

let isConnected = false;

export const connectDatabase = async (): Promise<boolean> => {
  const uri = process.env.DATABASE_URL || process.env.MONGODB_URI;

  if (!uri || (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://'))) {
    console.log('ℹ️ No valid MongoDB URI configured. Running with in-memory storage.');
    return false;
  }

  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`✅ Successfully connected to MongoDB Atlas! (Database: "${mongoose.connection.name}")`);
    return true;
  } catch (error: any) {
    console.warn(`⚠️ MongoDB connection attempt failed: ${error.message}`);
    console.warn('ℹ️ Running with In-Memory fallback storage so API remains operational.');
    isConnected = false;
    return false;
  }
};

export const isDatabaseConnected = (): boolean => isConnected;
