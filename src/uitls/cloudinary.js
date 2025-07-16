import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadFileOnCloudinary = async (filePath) => {
    try {
        if (!filePath) return "File path is not found"

        const res = await cloudinary.uploader.upload(filePath, {
            resource_type: "auto"
        })
        //file successfully uploaded
        console.log(`File has been uploaded successfully: ${res}`)
        return res

    } catch (error) {
        fs.unlinkSync(filePath) // remove the file from local server
        console.log(`File uploding has been failed!: ${error}`)
        return "Error occured whil uploding file"
    }

}

export default {uploadFileOnCloudinary}


