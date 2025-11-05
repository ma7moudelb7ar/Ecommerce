
import { HydratedUserDocument } from "src/common/types/HydratedUserDocument";
import { DbRepository } from "./repo";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "../models";
import { Injectable } from "@nestjs/common";


@Injectable()
export class UserRepo extends DbRepository<HydratedUserDocument> {
    constructor(@InjectModel(User.name) protected readonly model: Model<HydratedUserDocument>) {
        super(model)
    }
}   