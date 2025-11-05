import { IsNotEmpty, IsString } from "class-validator"


export class LoginDto { 


    @IsString()
    @IsNotEmpty()
    Email : string

    @IsString()
    @IsNotEmpty()
    Password : string
}


