
import { Module } from "@nestjs/common";
import { BrandModel, BrandRepo } from "src/DataBase";
import { S3Service, TokenService } from "src/common";
import { BrandController } from "./Brand.controller";
import { BrandService } from "./Brand.service";


@Module({
    imports : [BrandModel ],
    controllers: [BrandController],
    providers : [BrandService, BrandRepo , TokenService , S3Service]
    
})  
export default class BrandModule {}