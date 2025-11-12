import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";


@Schema({
    timestamps:true,
    toJSON:{virtuals :true},
    toObject:{virtuals :true},
    strictQuery:true
})
export class SupCategoryModel {


    @Prop({required:true , type : String })
    Name : string;  

    @Prop({required:true , type : String })
    Image : string;  

    @Prop({required:true , type : String })
    Description : string;  

    @Prop({required:true , type : String })
    DeletedAt : string;  

    @Prop({required:true , type : Types.ObjectId})
    DeletedBy : Types.ObjectId;  

    @Prop({required:true , type : String })
    UpdatedAt : string;  

    @Prop({required:true , type : Types.ObjectId})
    UpdatedBy : Types.ObjectId;  

    @Prop({required:true , type : String })
    CreatedAt : string;  

    @Prop({required:true , type : Types.ObjectId})
    CreatedBy : Types.ObjectId;  

    @Prop({required:true , type : String })
    slug : string;  

    @Prop({required:true , type : String })
    slogon : string;  
}

export const SupCategoryModelSchema = SchemaFactory.createForClass(SupCategoryModel);

export const SupCategoryModelModel = MongooseModule.forFeatureAsync([{ name: SupCategoryModel.name, useFactory: () => SupCategoryModelSchema }])


