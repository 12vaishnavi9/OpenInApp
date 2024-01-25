import mongoose from "mongoose";

const connectDB=async()=>{
    try{
        const conn=await mongoose.connect(process.env.MONGODB_URL);
        console.log("connection done");
    }catch(error){
        console.log(`error is ${error}`);
    }
}

export default connectDB;