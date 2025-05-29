import mongoose from "mongoose";

// Connect to MongoDB
const connectDB = async () => {
  try {
    // Set up event listeners before connecting
    mongoose.connection.on("connected", () =>
      console.log("MongoDB connected successfully")
    );
    mongoose.connection.on("error", (err) =>
      console.error("MongoDB connection error:", err)
    );

    // Connect to MongoDB
    await mongoose.connect(`${process.env.MONGO_URI}/job-portal`);

    // List all collections to verify database is working
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log(
      "Available collections:",
      collections.map((c) => c.name)
    );

    return true;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    return false;
  }
};

export default connectDB;
