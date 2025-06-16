const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const allowedOrigin = process.env.FRONT;

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: allowedOrigin,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
const route = require("./routes");

app.use(route);

mongoose
  .connect(process.env.MOGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((e) => console.error(e));

app.listen(3000);

//localhost:3000/
