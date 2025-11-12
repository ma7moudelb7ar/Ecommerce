import { Injectable } from "@nestjs/common";
import { DbRepository } from "./repo";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Brand } from "../models";
import { HydratedBrandDocument } from "src/common";



@Injectable()
export class BrandRepo extends DbRepository<HydratedBrandDocument> {
    constructor(@InjectModel(Brand.name) protected readonly model: Model<HydratedBrandDocument>) {
        super(model)
    }

    countDocuments(filter: any) {
        return this.model.countDocuments(filter)
    }
}   