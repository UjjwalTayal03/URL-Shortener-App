import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB connection successful")
    } catch (err) {
        console.log("MongoDB Connection Error")
        process.exit(1)
    }
}

export default connectDB