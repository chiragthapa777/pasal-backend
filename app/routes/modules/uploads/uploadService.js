const fs=require("fs")
const cloudinary = require("cloudinary");


// cloudinary connection
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const removeTmp=(path)=>{
    try {
        fs.unlink(path,err=>{
            if(err) throw err;
        })
    } catch (error) {
        console.log(error)
    }
        
}


module.exports={
    async uploadImage(req,res){
        try {
            const file = req.files.file; 
            const result =await cloudinary.v2.uploader.upload(file.tempFilePath, {folder:"pasal"})
            removeTmp(file.tempFilePath)
            return result
        } catch (error) {
            throw error
        }
    },
    async deleteImage(req, res){
        try {
            return await cloudinary.v2.uploader.destroy(req.body.public_id)
        } catch (error) {
            throw error
        }
    }
}