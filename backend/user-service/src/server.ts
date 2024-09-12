import express from "express";
import { config } from "dotenv";
import { errorHandler, notFound } from "./middleware/errorMiddleware";
import Router from "./routes/userRoute";
import dbConnect from "./config/dbConnect";

config();
dbConnect();

const app = express();
const port = process.env.PORT || 3000;
const apiRoot = process.env.API_ROOT || "/api/user-service";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(apiRoot, Router);
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log("user service running on " + port);
});
