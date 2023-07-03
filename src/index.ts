import express from "express";
import errorHandler from "./utils/errorHandle";
import userRoutes from "./routes/userRoutes";
import postRoutes from "./routes/postRoutes";
import dotenv from "dotenv";
import connectDB from "./utils/db";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRoutes);
app.use("/tweet", postRoutes);

app.use(errorHandler);

const port = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log("Server listening on port " + port);
    });
  })
  .catch(console.log);
