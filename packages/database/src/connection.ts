import mongoose from 'mongoose';
import { MongoClient, type Db } from 'mongodb';

let mongooseConn: typeof mongoose | null = null;
let mongoClient: MongoClient | null = null;

export async function connectDB(uri: string): Promise<typeof mongoose> {
  if (mongooseConn) return mongooseConn;
  console.log('Connecting to MongoDB...');
  mongooseConn = await mongoose.connect(uri, {
    // Fail fast on unreachable hosts instead of hanging ~30s (driver default).
    serverSelectionTimeoutMS: 5000,
  });
  console.log('MongoDB connected');
  return mongooseConn;
}

export async function getMongoClient(uri: string): Promise<MongoClient> {
  if (mongoClient) return mongoClient;
  mongoClient = new MongoClient(uri);
  await mongoClient.connect();
  return mongoClient;
}

export async function getDb(uri: string): Promise<Db> {
  const client = await getMongoClient(uri);
  return client.db();
}
