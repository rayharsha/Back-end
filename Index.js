require("dotenv").config();
const express = require("express");
const mongoose=require("mongoose")
const app = express();
const connectDB=require("./DB/Connect");

const port = 3000;

const Products_routes = require("./Routes/Products");


app.get('/', (request, response) => {
    return response.json({
        name:"Hello harsha...",
        age:'18',
        city:"Siwan",
        message:"API is running"
        
    });
})


app.use("/api/products",Products_routes)

const start=async ()=>{
    try{
        console.log("Before DB connection");
        await connectDB(process.env.MONGODB_URL);
        console.log("After DB connection");
    app.listen(port, () => {
    console.log("Application is started");
})
    }catch(err){
        console.log("ERROR:",err);
        
    }
};
start();