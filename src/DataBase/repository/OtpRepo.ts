import { Injectable } from "@nestjs/common";
import { DbRepository } from "./repo";
import { HydratedOtpDocument } from "src/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Otp } from "../models";



@Injectable()
export class OtpRepo extends DbRepository<HydratedOtpDocument> {
    constructor(@InjectModel(Otp.name) protected readonly model: Model<HydratedOtpDocument>) {
        super(model)
    }
}   