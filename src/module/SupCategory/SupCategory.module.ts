
import { Module } from "@nestjs/common";
import { SupCategoryModel, SupCategoryRepo } from "src/DataBase";
import { S3Service, TokenService } from "src/common";
import { SupCategoryController } from "./SupCategory.controller";
import { SupCategoryService } from "./SupCategory.service";


@Module({
    imports : [SupCategoryModel ],
    controllers: [SupCategoryController],
    providers : [SupCategoryService, SupCategoryRepo , TokenService , S3Service]
    
})  
export default class SupCategoryModule {}