import express from "express";
import errorHandler from "./utils/errorHandle";
import userRoutes from "./routes/userRoutes";
const app = express();
app.use(express.json());

app.use("/user", userRoutes);

const port = 3000;

app.use(errorHandler);

app.listen(port, () => {
  console.log("Server listening on port " + port);
});
