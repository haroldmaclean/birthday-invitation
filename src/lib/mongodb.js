// src/lib/mongodb.js
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DATABASE;

if (!uri) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = await new MongoClient(uri).connect();
  const db = client.db(dbName);

  cachedClient = client;
  cachedDb = db;

  console.log('✅ Connected to MongoDB');
  return { client, db };
}
