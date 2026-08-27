import mongoose from 'mongoose';

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/valenti_fashion';

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`✨ MongoDB Connected to: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.warn(`⚠️ Could not connect to primary MongoDB at ${mongoUri}. Starting in-memory fallback for local development...`);
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create({
        instance: {
          launchTimeout: 60000
        }
      });
      const fallbackUri = mongod.getUri();
      const conn = await mongoose.connect(fallbackUri);
      console.log(`✨ In-Memory MongoDB Server initialized at: ${fallbackUri}`);
    } catch (fallbackErr) {
      console.error(`❌ Failed to connect to MongoDB: ${error.message}`);
      console.error(`❌ Memory server error: ${fallbackErr.message}`);
      process.exit(1);
    }
  }
};
