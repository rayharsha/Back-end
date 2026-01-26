
const mongoose=require("mongoose");

 
const connectDB=async()=>{
    try{
    await mongoose.connect(url);
    console.log("mongodb atlas started");
}catch(err){
    console.error("mongodb atlas error:",err);
    throw err;
}
};

module.exports=connectDB;