require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./config/db_connect");
const todoRoute = require("./routes/todoRoute");


app.use(express.json({ limit: "4mb" }));
app.use("/api/v1/todos", todoRoute);
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