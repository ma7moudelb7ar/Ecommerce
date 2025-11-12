import { Injectable } from "@nestjs/common";
import { DbRepository } from "./repo";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { CategoryModel } from "../models";
import { HydratedCategoryDocument } from "src/common";



@Injectable()
export class CategoryRepo extends DbRepository<HydratedCategoryDocument> {
    constructor(@InjectModel(CategoryModel.name) protected readonly model: Model<HydratedCategoryDocument>) {
        super(model)
    }

    countDocuments(filter: any) {
        return this.model.countDocuments(filter)
    }
}   