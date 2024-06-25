const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const userAuthRoutes = require("./routers/UserAuth");
const hotelRoutes = require("./routers/Hotels");
const roomRoutes = require("./routers/Rooms");
const ratingRoutes = require("./routers/Ratings");

const app = express();
app.use(cors());
// Middleware to parse JSON bodies
app.use(bodyparser.json());
app.use("/api", userAuthRoutes);
app.use("/api", hotelRoutes);
app.use("/api", roomRoutes);
app.use("/api", ratingRoutes);

mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log("MongoDB was connected");
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on Port ${process.env.PORT}`);
    })
});
