import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.DB_URL}`);
    console.log(
      `\n MONGODB connected !! DB HOST: ${connectionInstance.connection.host}`
    );
    console.log(
      `MONGODB connected !! DB PORT: ${connectionInstance.connection.port}`
    );
  } catch (error) {
    console.log("MONGODV connection error", error);
    process.exit(1); 
  }
};

export default connectDB;
