import { BadRequestException, ConflictException, ForbiddenException, Injectable } from "@nestjs/common";
import { OtpRepo, UserRepo } from "src/DataBase";
import { ConfirmEmailDto, ForgotPasswordDto, LoginDto, SignUpDto ,  } from "./dto";
import { Compare, generateOtp, HydratedUserDocument, OtpEnum,  UserProvider } from "src/common";
import { UserRole ,TokenService } from "src/common";
import { OAuth2Client, TokenPayload } from "google-auth-library";


@Injectable() 
export class UserService {

    constructor(
        private readonly userRepo : UserRepo,
        private readonly otpRepo : OtpRepo,
        private readonly tokenService : TokenService
    ){}

    private  async sendOtpEmail( User : HydratedUserDocument)  {    
        const otp = generateOtp()
        await this.otpRepo.create({
            Email  : User.Email , 
            Code :  otp.toString() ,
            ExpiryAt : new Date(Date.now() + 60  * 1000) , 
            Type : OtpEnum.confirmEmail ,
            CreateBy : User._id
        })
}


        
    async SignUp( body : SignUpDto )  {

        const {Email , Password , Phone , Age , FirstName , LastName , Gender} = body 

        const userExists = await this.userRepo.findOne({Email})
        if(userExists) throw new ConflictException("User Already Exists")

        const user = await this.userRepo.create({Email , Password , Phone , Age , FirstName , LastName , Gender})

        if(!user){
            throw new ForbiddenException("User Not Created")
        }

        await this.sendOtpEmail(user)

        return user


    }


    async Login( body : LoginDto )  {
    
            const { Email, Password } = body
    
            const user = await this.userRepo.findOne({ Email, confirmed: {$exists : true }, DeletedAt: { $exists: false } , provider : UserProvider.System })
            if (!user) {
                throw new BadRequestException("user not found or not confirmed yet or freezed");
            }
            if (! await Compare(Password, user?.Password!)) {
                throw new BadRequestException("Invalid password");
            }


            const RefreshToken = await this.tokenService.GenerateToken({
                payload: { id: user?._id, email: user?.Email },
                options: { expiresIn: "1y"  }
            })
            const accessToken = await this.tokenService.GenerateToken({
                payload: { id: user?._id, email: user?.Email },
                options: { expiresIn:  60 * 10 }
            })
    
            return {accessToken , RefreshToken}
    }



    async ConfirmEmail( body : ConfirmEmailDto ) {
        const { Email, Otp } = body
        const user = await this.userRepo.findOne({ Email, confirmed: {$exists : true }, DeletedAt: { $exists: false } , provider : UserProvider.System })
        if (!user) {
            throw new BadRequestException("user not found or not confirmed yet or freezed");
        }

        if (! await Compare(String(Otp) , String(user?.Otp!))) {
            throw new BadRequestException("Invalid otp");
        }
        user.Confirmed = true
        user.ConfirmedAt = new Date()
        await user.save()
        return user
    }

    async ForgotPassword( body : ForgotPasswordDto ) {
        const { Email } = body
        const user = await this.userRepo.findOne({ Email, confirmed: {$exists : true }, DeletedAt: { $exists: false } , provider : UserProvider.System })
        if (!user) {
            throw new BadRequestException("user not found or not confirmed yet or freezed");
        }
        await this.sendOtpEmail(user)
        return user
    }

    async loginWithGmail ( body : {idToken : string} ) {

        const {idToken}  = body

        const client = new OAuth2Client();
            async function verify() {
                const ticket = await client.verifyIdToken({
                idToken ,
                audience: process.env.WEB_CLIENT_ID!,  
});
        const payload = ticket.getPayload();
        return payload ;
}
    const {name ,picture ,email_verified , email} = await verify() as TokenPayload 

    let user = await this.userRepo.findOne({email })

    if (!user) {
        
        user = await this.userRepo.create({
            UserName: name!, 
            Email : email!,
            ProfileImage : picture! ,
            Confirmed: email_verified !,
            Provider:UserProvider.Google,
        })
    }
    if (user?.Provider === UserProvider.System) {
        throw new BadRequestException("please login with system");
    }
        const jwtid =  crypto.randomUUID()
        const accessToken = await this.tokenService.GenerateToken({
            payload: { id: user?._id, email: user?.Email },
            options: { expiresIn:  60 * 2 , jwtid }
        })
        const RefreshToken = await this.tokenService.GenerateToken({
            payload: { id: user?._id, email: user?.Email },
            options: { expiresIn: "1y" ,  jwtid }
        })

    }


}
