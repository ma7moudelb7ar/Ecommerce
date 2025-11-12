
import { Module } from "@nestjs/common";
import { BrandModel, BrandRepo } from "src/DataBase";
import { S3Service, TokenService } from "src/common";
import {  } from "../Brands/Brand.service";
import { CategoryService } from "./Category.service";
import { CategoryController } from "./Category.controller";



@Module({
    imports : [BrandModel ],
    controllers: [CategoryController],
    providers : [CategoryService, BrandRepo , TokenService , S3Service]
    
})  
export default class CategoryModule {}