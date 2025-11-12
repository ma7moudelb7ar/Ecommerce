import { HydratedDocument } from "mongoose";
import { CategoryModel } from "src/DataBase";

export type HydratedCategoryDocument = HydratedDocument<CategoryModel>