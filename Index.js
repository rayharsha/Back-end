require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./config/db_connect");
const todoRoute = require("./routes/todoRoute");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");

// app.options("*", cors());
app.use(cors());
app.use(express.json({ limit: "4mb" }));
app.use("/api/v1/todos", todoRoute);
app.use("/api/v1/auth", authRoutes);
app.use("/heartbeat", (req, res) => {
    res.status(200).send({
        message: "Application is running"
    })
});

const start = async () => {
    try {
        await connectDB();
        app.listen(process.env.PORT || 3000, () => {
            console.log("index : start : Application is started :", process.env.PORT);
        })
    } catch (err) {
        console.log("index : start : Application is started :", err);

    }
};
start();

