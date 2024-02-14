import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
// app.use(cors());
//or
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//routes
import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
import adminRoutes from "./routes/admin.routes.js";

// routes Declerations
const version = "/api/v1";

app.use(`${version}/users`, userRoutes);
app.use(`${version}/controller`, adminRoutes);
app.use(`${version}/product`, productRoutes);

export { app };
