import { OtpEnum } from "src/common"
import { emailTemplate, sendEmail } from "../service"
import { eventEmitter } from "./eventEmitter"




eventEmitter.on(OtpEnum.forgotPassword , async (data : any) => { 

    const {email ,otp}  = data

        await sendEmail({to : email , subject :OtpEnum.forgotPassword , html : emailTemplate(otp as unknown as string , "ForgetPassword")} )
})
