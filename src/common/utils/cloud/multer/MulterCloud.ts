import { BadRequestException } from "@nestjs/common"
import multer, { FileFilterCallback } from "multer"

export const FileValidation = {
    image:['application/octet-stream' ,'image/jpeg','/png','image/jpg','image/gif','image/webp' , "image/x-icon" , "image/bmp"],
    pdf:['application/pdf' , "application/x-pdf"  , "application/pdf"  ],
    video : ["video/mp4" , "video/quicktime"]
} 

export const multerCloud = ({
    FileTypes = FileValidation.image ,
    maxSize = 5
}:{
    FileTypes?:string[]
    maxSize? : number
}) => { 

    const storage = multer.memoryStorage() 
    const fileFilter = (req : Express.Request , file: Express.Multer.File, cb :FileFilterCallback) => { 
        if (FileTypes.includes(file.mimetype)) {
            cb(null ,  true )
        }else{
            return  cb(new BadRequestException("invalid file Type" ))
    }
    }
    const upload = multer({storage , limits : { fileSize : 1024 * 1024 * maxSize },fileFilter})
    return upload
}

