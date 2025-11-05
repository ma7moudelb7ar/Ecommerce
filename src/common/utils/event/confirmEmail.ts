import { OtpEnum } from "src/common/enum"
import { emailTemplate, sendEmail } from "../service"
import { eventEmitter } from "./eventEmitter"






eventEmitter.on(OtpEnum.confirmEmail , async (data : any) => { 

    const {email ,otp}  = data

        await sendEmail({to : email , subject :OtpEnum.confirmEmail , html : emailTemplate(otp as unknown as string , "Email confirmation")} )
})
