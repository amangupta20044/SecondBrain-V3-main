import mongoose from "mongoose";

const connectDB = async (retries = 5, delay = 5000): Promise<void> => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error("❌ CRITICAL: MONGO_URI is missing in environment variables.");
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
    return;
  }

  // Connection Event Listeners
  mongoose.connection.on("connected", () => {
    console.log("✅ MongoDB connected successfully.");
  });

  mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB connection error:", err);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("⚠️ MongoDB disconnected. Attempting to reconnect...");
  });

  mongoose.connection.on("reconnected", () => {
    console.log("🔄 MongoDB reconnected.");
  });

  try {
    await mongoose.connect(mongoUri);
  } catch (e: any) {
    console.error("❌ Initial MongoDB Connection Failed:", e.message);
    if (retries === 0) {
      console.error("❌ Max retries reached. Exiting application...");
      process.exit(1);
    } else {
      console.log(`🔄 Retrying MongoDB connection in ${delay / 1000} seconds... (${retries} attempts left)`);
      setTimeout(() => connectDB(retries - 1, delay), delay);
    }
  }
};

export default connectDB;