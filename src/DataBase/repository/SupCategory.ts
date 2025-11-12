import { Injectable } from "@nestjs/common";
import { DbRepository } from "./repo";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { SupCategoryModel } from "../models";
import { HydratedSupCategoryDocument } from "src/common";



@Injectable()
export class SupCategoryRepo extends DbRepository<HydratedSupCategoryDocument> {
    constructor(@InjectModel(SupCategoryModel.name) protected readonly model: Model<HydratedSupCategoryDocument>) {
        super(model)
    }

    countDocuments(filter: any) {
        return this.model.countDocuments(filter)
    }
}   