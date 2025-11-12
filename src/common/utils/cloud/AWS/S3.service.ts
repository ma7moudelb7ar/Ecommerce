import { DeleteObjectCommand, DeleteObjectsCommand, GetObjectCommand, ListObjectsV2Command, ObjectCannedACL, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { randomUUID } from "crypto";
import { createReadStream } from "fs";
import { StorageType } from "src/common/enum";




@Injectable()
export class S3Service  {
    private readonly client: S3Client;
    constructor(){
        this.client = new S3Client({
        region :process.env.AWS_REGION!,
        credentials : { 
            accessKeyId : process.env.AWS_ACCESS_KEY_ID!,
            secretAccessKey : process.env.AWS_SECRET_ACCESS_KEY_ID!,
        }
    })
    }

    CreateSignedUrl = async ( {
        Bucket=process.env.AWS_BUCKET!,
        path =  "general",
        ContentType  ,
        originalname,
        expiresIn =  60* 60 
} : {  
        Bucket?:string,
        path? : string,
        ContentType : string,
        originalname : string,
        expiresIn?: number
    }) =>  { 

    const Key =`${process.env.AWS_APPLICATION}/${path}/${randomUUID()}_${originalname}`
    const command =  new PutObjectCommand({
        Bucket, 
        Key , 
        ContentType,
    })

    const url = await getSignedUrl(this.client , command , { expiresIn })
    return {url , Key}
}


DeleteFile =  async ({ 
        Bucket = process.env.AWS_BUCKET!,
        Key,
} : { 
        Bucket? : string,
        Key :string,
})=> { 

    const command =  new DeleteObjectCommand({
        Bucket,
        Key,
    })

    return await this.client.send(command)

}


DeleteFiles =  async ({ 
        Bucket = process.env.AWS_BUCKET!,
        urls ,
        Quiet = false
} : { 
        Bucket? : string,
        urls :string[]
        Quiet?:boolean
})=> { 

    const command =  new DeleteObjectsCommand({
        Bucket,
        Delete: {
            Objects :urls.map(url => ({Key : url})),
            Quiet,
        }
    })

    return await this.client.send(command)

}


getFile = async ({ 
        Bucket = process.env.AWS_BUCKET!,
        Key,
} : { 
        Bucket? : string,
        Key :string,
})=> { 

    const command =  new GetObjectCommand({
        Bucket : process.env.AWS_BUCKET!,
        Key,
    })

    return await this.client.send(command)

}



GetFileCreateSignedUrl = async ( {
        Bucket=process.env.AWS_BUCKET!,
        expiresIn =   60 ,
        Key,
        DownloadName
} : {  
        Bucket?:string,
        Key : string,
        expiresIn?: number,
        DownloadName: string
    }) =>  { 

    const command =  new GetObjectCommand({
        Bucket, 
        Key , 
        ResponseContentDisposition:  `attachment; filename="${DownloadName || Key.split("/").pop()}"`
    })

    const url = await getSignedUrl(this.client , command , { expiresIn })
    return url
}


    listFile = async ({
    Bucket =process.env.AWS_BUCKET!,
    path ,
} :{
    Bucket: string,
    path :string ,
}) => { 

    const command = new ListObjectsV2Command({
        Bucket,
        Prefix:`${process.env.AWS_APPLICATION}/${path}`
    })
    return this.client.send(command)
}


    uploadFile = async ({
        storeType = StorageType.cloud ,
        Bucket=process.env.AWS_BUCKET!,
        path =  "general",
        ACL = "private" as ObjectCannedACL,
        file
} : {  
        storeType? : StorageType
        Bucket?:string,
        path : string,
        ACL?: ObjectCannedACL,
        file : Express.Multer.File
    }) : Promise<string> => { 
    const commend = new PutObjectCommand ({
        Bucket,
        Key : `${process.env.AWS_APPLICATION}/${path}/${randomUUID()}_${file.originalname}`,
        ACL,
        Body :storeType ===StorageType.cloud ? file.buffer :createReadStream(file.path),
        ContentType : file.mimetype,
    })
    await this.client.send(commend)
    if (!commend.input.Key) {
        throw new InternalServerErrorException("Failed to Upload File to aws " );
    }
    return commend.input.Key
}    

    uploadFiles = async ({
        storeType = StorageType.cloud ,
        Bucket=process.env.AWS_BUCKET!,
        path =  "general",
        ACL = "private" as ObjectCannedACL,
        files,
        useLarge = false,
} : {  
        storeType?: StorageType
        Bucket?:string,
        path : string,
        ACL?: ObjectCannedACL,
        files : Express.Multer.File[],
        useLarge? : boolean
    }) => { 

        let urls : string[]= []
        if (useLarge == true) {
        urls = await Promise.all(files.map( file=> this.uploadLargeFile ({file , path ,ACL , Bucket,storeType})))
        }else{
        urls = await Promise.all(  files.map((file) => this.uploadFile({ storeType, Bucket, ACL, path, file })))
        }
    return urls
}     

    uploadLargeFile = async ({
        storeType = StorageType.cloud ,
        Bucket=process.env.AWS_BUCKET!,
        path =  "general",
        ACL = "private" as ObjectCannedACL,
        file
} : {  
        storeType : StorageType
        Bucket?:string,
        path : string,
        ACL?: ObjectCannedACL,
        file : Express.Multer.File
    }) => { 

    const  uploadLargeFile = new Upload({
        client: this.client , 
        params:{
        Bucket,
        Key : `${process.env.AWS_APPLICATION}/${path}/${randomUUID()}_${file.originalname}`,
        ACL,
        Body :storeType ===StorageType.cloud ? file.buffer :createReadStream(file.path),
        ContentType : file.mimetype,
        }
    })

    const {Key} = await uploadLargeFile.done()
        if (!Key) {
            throw new InternalServerErrorException("Failed to uploadLargeFile to aws " );
        }
        return Key
}

    
}
