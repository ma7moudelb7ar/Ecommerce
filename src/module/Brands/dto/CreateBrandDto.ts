import { IsNotEmpty, IsString } from "class-validator"


export class CreateBrandDto { 

    @IsString()
    @IsNotEmpty()
    Name : string

    @IsString()
    @IsNotEmpty()
    Description : string

    @IsString()
    @IsNotEmpty()
    Image : string

    @IsString()
    @IsNotEmpty()
    slogon : string

    @IsString()
    @IsNotEmpty()
    slug : string

    @IsString()
    @IsNotEmpty()
    CreatedBy : string
}


