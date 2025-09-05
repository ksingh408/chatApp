const cloudinary = require("../Config/cloudinary");

const uploadToCloudinary = async(filePath, folder)=>{
    try{
        const result = await cloudinary.uploader.upload(filePath,{
            folder: folder || "uploads" ,
            resource_type : "auto",
        })
        return result;
    }
    catch (error) {
        throw new Error("Cloudinary Upload Failed: " + error.message);
      }
}


module.exports = uploadToCloudinary;