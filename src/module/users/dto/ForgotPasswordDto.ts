import { IsNotEmpty, IsString } from "class-validator"


export class ForgotPasswordDto { 


    @IsString()
    @IsNotEmpty()
    Email : string

    @IsString()
    @IsNotEmpty()
    Otp : string
}


