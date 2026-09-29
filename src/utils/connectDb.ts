import mongoose from "mongoose";

// .env url database
const url=process.env.MONGO_URL!


export const connectDb=async()=>{

    try {
        // اگر دیتابیس ازقبل متصل هست بیا ری ترن کن
    if(mongoose.connection.readyState === 1){
         console.log("Already connectDB🟢!");
         return
    }

    mongoose.set("strictQuery",false);
    await mongoose.connect(url);
    console.log("mongoDB connect✅!");
    }catch(error){
    error instanceof Error ? 
    console.log(error.message)
    :console.log("unknown error from database!");
    }
};

export default connectDb;