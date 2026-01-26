const getAllProducts= async(req,res)=>{
       
const productes=[
    {
        id:1,name:"Laptop",price:"50000"
    },
    {
        id:2,name:"phone",price:"20000"
    },
    {
        id:3,name:"headphone",price:"3000"
    }
]
// router.get("/",(req,res)=>{
    res.json(productes)
// })
}
const getAllProductsTesting= async(req,res)=>{
        res.status(200).json({
            msg:"Its getAllProductsTesting"
        });
}


module.exports={getAllProducts,getAllProductsTesting};