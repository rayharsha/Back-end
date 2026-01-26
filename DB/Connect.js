
const mongoose=require("mongoose");

 const url="mongodb+srv://harsharay002_db_user:H3gmgkbxrFfmCOyw@todoapi.l0wm4dc.mongodb.net/harsharay002_db_user?appName=TodoAPI";

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