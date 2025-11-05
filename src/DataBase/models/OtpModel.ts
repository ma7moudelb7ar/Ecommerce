import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { Hash, OtpEnum } from "src/common";


@Schema({
    timestamps:true,
    toJSON:{virtuals :true},
    toObject:{virtuals :true},
    strictQuery:true
})
export class Otp { 
    @Prop({type : String , required : true , minLength : 1 , maxlength :25})
    Email : string;

    @Prop({type : String , required : true , minLength : 1 , maxlength :25})
    Code : string;

    @Prop({type : Date ,required : true})
    ExpiryAt : Date;

    @Prop({type : String ,required : true , enum : OtpEnum})
    Type : OtpEnum;


    @Prop({type : Types.ObjectId ,required : true})
    CreateBy : Types.ObjectId;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);

export const OtpModel = MongooseModule.forFeature([{ name: Otp.name, schema: OtpSchema }])

OtpSchema.index({ExpiryAt : 1} , {expireAfterSeconds : 0})


OtpSchema.pre('save' , async function(next){

    if (this.isModified("Code")) {
        this.Code = await Hash(this.Code);
    }
    next()
} )
