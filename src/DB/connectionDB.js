import mongoose from "mongoose";
import "dotenv/config";

export default async function ConnectionDB() {
  try {
    mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`Database connected successfully....`);
  } catch (error) {
    console.error(`Error connecting to database: ${error}`);
  }
}
