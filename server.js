const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const userAuth = require("./routers/UserAuth")

const app = express();
app.use(cors());
app.use(bodyparser.json());
app.use("/api", userAuth);

mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log("MongoDB was connected");
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on Port ${process.env.PORT}`);
    })
});
