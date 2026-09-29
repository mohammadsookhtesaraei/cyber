import mongoose from "mongoose";

// .env url database

const url = process.env.MONGO_URL!;

export const connectDb = async () => {
  try {
    // اگر دیتابیس از قبل متصل هست، برگرد
    if (mongoose.connection.readyState === 1) {
      console.log("Already connectDB🟢!");
      return;
    }

    mongoose.set("strictQuery", false);

    await mongoose.connect(url);

    console.log("mongoDB connect✅!");
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log("unknown error from database!");
    }

    throw error;
  }
};

export default connectDb;