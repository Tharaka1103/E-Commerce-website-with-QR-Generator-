import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce";
const options = {
  serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
  connectTimeoutMS: 10000, // Timeout after 10 seconds
};

let client;
let clientPromise: Promise<MongoClient>;

if (!(global as any)._mongoClientPromise) {
  client = new MongoClient(uri, options);
  (global as any)._mongoClientPromise = client.connect()
    .catch(err => {
      console.error("Failed to connect to MongoDB:", err);
      // Provide a more helpful error message
      const isLocalhost = uri.includes('localhost') || uri.includes('127.0.0.1');
      if (isLocalhost) {
        console.error("\n⚠️ Trying to connect to local MongoDB server, but couldn't establish connection.");
        console.error("➡️ Make sure MongoDB is installed and running on your machine.");
        console.error("➡️ Or consider using MongoDB Atlas cloud database (https://www.mongodb.com/cloud/atlas).");
      }
      throw err;
    });
}clientPromise = (global as any)._mongoClientPromise;
export default clientPromise;
