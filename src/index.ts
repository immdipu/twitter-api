import express from "express";
import errorHandler from "./utils/errorHandle";
import userRoutes from "./routes/userRoutes";
import postRoutes from "./routes/postRoutes";
import profileRoutes from "./routes/profileRoutes";
import searchRoutes from "./routes/searchRoutes";
import messageRoutes from "./routes/messagesRoutes";
import chatRoutes from "./routes/chatRoutes";
import dotenv from "dotenv";
import connectDB from "./utils/db";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRoutes);
app.use("/tweet", postRoutes);
app.use("/profile", profileRoutes);
app.use("/search", searchRoutes);
app.use("/chat", chatRoutes);
app.use("/message", messageRoutes);

app.use(errorHandler);

const port = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log("Server listening on port " + port);
    });
  })
  .catch(console.log);
