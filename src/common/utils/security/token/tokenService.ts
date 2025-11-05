import { JwtService } from "@nestjs/jwt";
import { JwtPayload, SignOptions, VerifyOptions } from "jsonwebtoken";
import { TokenType } from "src/common/enum";
import { BadRequestException, UnauthorizedException } from "@nestjs/common";
import {  UserRepo } from "src/DataBase";




export class TokenService {
    constructor (
        private readonly JwtService : JwtService,
        private readonly userRepo : UserRepo
    ) {}


 GenerateToken = async ({payload , options} :{
    payload : object, 
    options : SignOptions
}) : Promise<string> => { 
    return this.JwtService.sign(
        payload,
        options
    )
}



VerifyToken = async ({token , options} :{ 
    token: string,
    options:  VerifyOptions 
}) : Promise<JwtPayload>=> { 
    return this.JwtService.verify(
        token, 
        options
    ) as JwtPayload ; 
}

    GetSignature = async ( tokenType :TokenType ,  prefix : string) => { 
        if (tokenType==TokenType.access) {
    if (prefix == process.env.BEARER_USER) {
        return process.env.SIGNATURE_USER_TOKEN
    }
    else if (prefix == process.env.BEARER_ADMIN) {
        return process.env.SIGNATURE_ADMIN_TOKEN
    }
    else {
        return null
    }
        }
        if (tokenType==TokenType.refresh) {
    if (prefix == process.env.BEARER_USER) {
        return process.env.REFRESH_SIGNATURE_USER_TOKEN
    }
    else if (prefix == process.env.BEARER_ADMIN) {
        return process.env.REFRESH_SIGNATURE_ADMIN_TOKEN
    }
    else {
        return null
    }
        }
        return null
    }


    DecodedTokenAndFetchUser = async (token : string, signature : string ) => { 
        const decoded = await this.VerifyToken({ token, options: { subject: signature } })
    if (!decoded) {
        throw new BadRequestException("Invalid token ");
    }
    const user =  await this.userRepo.findOne({Email : decoded?.email})
    if (!user) {
        throw new BadRequestException("user not found ");
    }
    if (!user?.Confirmed) {
        throw new UnauthorizedException("first confirmed ");
    } 
    if (user?.DeletedAt) {
        throw new UnauthorizedException("This account has been deactivated. Please contact support.");
    }

//     if ( await _RevokeModel.findOne ({tokenId : decoded?.jti})) {
//         throw new ("token has been Revoked ", 401);
//     }     
// if (user?.changeCredentials && user.changeCredentials.getTime() > decoded.iat! * 1000) {
//     throw new ("This token is invalid because your credentials were updated.", 401);
// }
        return {decoded , user} ; 
    }

}
