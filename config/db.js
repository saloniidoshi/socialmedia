// config/db.js
const mongoose = require('mongoose');

let cached = global._mongo || { conn: null, promise: null };
global._mongo = cached;

async function connectDB() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGODB_URI not set. Add it to .env or Vercel environment variables.');
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      // Fail faster if mongos/replica set not reachable:
      serverSelectionTimeoutMS: 5000, // <- try to connect for 5s then fail
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      // useUnifiedTopology and useNewUrlParser are default in newer mongoose versions
    };

    cached.promise = mongoose.connect(uri, opts).then((mongooseInstance) => {
      return mongooseInstance;
    }).catch(err => {
      // Reset cached so future invocations can retry
      cached = global._mongo = { conn: null, promise: null };
      console.error('MongoDB connection failed:', err.message || err);
      throw err;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = connectDB;
