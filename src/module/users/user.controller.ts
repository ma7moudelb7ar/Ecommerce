import { Body, Controller, Get, Post, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { SignUpDto } from "./dto/userDto";
import { FileInterceptor } from "@nestjs/platform-express";
import { MulterLocal } from "src/common";
import { LoginDto , ConfirmEmailDto , ForgotPasswordDto } from "./dto";


@Controller("users") 
export class UserController { 
    constructor(private readonly UserService: UserService) {}
    
    @Post("upload")
    
    @UseInterceptors(FileInterceptor('file', MulterLocal({ customPath: 'users' , customValidation: ['image/jpeg', 'image/png'] })))
    async SignUp(@Body() body : SignUpDto) {
        
        return await this.UserService.SignUp(body)
    }


    @Post("login")
    async Login(@Body() body : LoginDto) {
        return await this.UserService.Login(body)
    }


    @Post("confirmEmail")
    async ConfirmEmail(@Body() body : ConfirmEmailDto) {
        return await this.UserService.ConfirmEmail(body)
    }


    @Post("forgotPassword")
    async ForgotPassword(@Body() body : ForgotPasswordDto) {
        return await this.UserService.ForgotPassword(body)
    }


    @Post("loginWithGmail")
    async loginWithGmail(@Body() body : {idToken : string}) {
        return await this.UserService.loginWithGmail(body)
    }


} 