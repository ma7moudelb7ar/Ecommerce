import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsPhoneNumber, IsString, IsStrongPassword, Length, Max, Min, ValidateIf } from "class-validator"
import { Match, UserGender } from "src/common";

export class SignUpDto { 
    @IsString()
    @Length(1,25)
    @IsNotEmpty()
    FirstName  : string;


    @IsString()
    @Length(1,25)
    @IsNotEmpty()
    LastName  : string;

    @IsNumber()
    @Min(16)
    @Max(60)
    Age :number;

    @IsStrongPassword()
    Password: string;
    
    @Match(['Password'])
    @ValidateIf((data : SignUpDto) => { 
        return Boolean(data.Password)
    })
    ConfirmPassword : string;

    @IsEmail()
    Email : string

    @IsEnum(UserGender)
    Gender : UserGender

    @IsPhoneNumber()
    Phone : string
}


