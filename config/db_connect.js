const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("db_connect : connectDB : mongodb is connecting on url : ", process.env.MONGODB_URL);
    } catch (err) {
        console.error("db_connect : connectDB : mongodb is connecting on url : ", err);
    }
};

module.exports = connectDB;