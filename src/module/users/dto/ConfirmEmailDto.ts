


import { IsNotEmpty, IsString } from "class-validator"


export class ConfirmEmailDto { 

    @IsString()
    @IsNotEmpty()
    Email : string

    @IsString()
    @IsNotEmpty()
    Otp : string
}


