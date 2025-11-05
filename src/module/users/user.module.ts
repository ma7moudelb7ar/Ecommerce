import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserModel,OtpModel, OtpRepo, UserRepo } from "src/DataBase";
import { TokenService } from "src/common";


@Module({
    imports : [UserModel , OtpModel],
    controllers: [UserController],
    providers : [UserService, UserRepo , OtpRepo , TokenService]
    
})  

export default class UserModule {}