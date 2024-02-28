import "dotenv/config";
import mongoose from "mongoose";

export const connectDatabase = async () => {
  const urlDatabase = process.env.DATABASE_URL || "";

  try {
    await mongoose.connect(urlDatabase);

    console.log("database connected!");
  } catch (error) {
    console.log("Database error: " + error);
  }
};
