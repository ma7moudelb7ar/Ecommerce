import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";


@Schema({
    timestamps:true,
    toJSON:{virtuals :true},
    toObject:{virtuals :true},
    strictQuery:true
})
export class Brand { 
    @Prop({type : String , required : true , minLength : 1 , maxlength :25})
    Name : string;

    @Prop({type : String , required : true})
    Image : string;

    @Prop({type : String , required : true})
    Description : string;

    @Prop({type : String , required : true})
    DeletedAt : string;

    @Prop({type : Types.ObjectId , required : true})
    DeletedBy : Types.ObjectId;

    @Prop({type : String , required : true})
    UpdatedAt : string;

    @Prop({type : Types.ObjectId , required : true})
    UpdatedBy : Types.ObjectId;

    @Prop({type : String , required : true})
    CreatedAt : string;

    @Prop({type : Types.ObjectId , required : true})
    CreatedBy : Types.ObjectId;

    @Prop({type : String , required : true})
    slug : string;

    @Prop({type : String , required : true})
    slogon : string;


}

export const BrandSchema = SchemaFactory.createForClass(Brand);

export const BrandModel = MongooseModule.forFeatureAsync([{ name: Brand.name, useFactory: () => BrandSchema }])


