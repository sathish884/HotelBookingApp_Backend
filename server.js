const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
require("dotenv").config();
const cors = require("cors");

const userAuthRoutes = require("./routers/UserAuth");
// const hotelRoutes = require("./routers/Hotels");
const roomRoutes = require("./routers/Rooms");
// const ratingRoutes = require("./routers/Ratings");
const bookingRoutes = require("./routers/Bookings");
const reviewRoutes = require("./routers/Reviews");

const app = express();
app.use(cors());
// Middleware to parse JSON bodies
app.use(bodyparser.json());
//app.use('../uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api", userAuthRoutes);
// app.use("/api", hotelRoutes);
app.use("/api", roomRoutes);
// app.use("/api", ratingRoutes);
app.use("/api", bookingRoutes);
app.use("/api", reviewRoutes);

app.get("/", (req, res) => {
    res.json({ message: "Hello world" });
})

mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log("MongoDB was connected");
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on Port ${process.env.PORT}`);
    })
}).catch(error => {
    console.log("Connection failed ", error);
});

