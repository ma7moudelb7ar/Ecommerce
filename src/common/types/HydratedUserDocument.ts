import { HydratedDocument } from "mongoose";
import { User } from "src/DataBase";

export type HydratedUserDocument = HydratedDocument<User>