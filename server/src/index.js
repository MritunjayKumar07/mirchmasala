import dotenv from "dotenv";
import connectDB from "./db/connect.js";
import { app } from "./app.js";
import envConfig from "./config/envConfig.js";
dotenv.config({
  path: "./.env",
});
connectDB()
  .then(() => {
    app.listen(envConfig.port || 8000, () => {
      console.log(`Server running at PORT !! ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO DB connection failed !!", err);
  });
