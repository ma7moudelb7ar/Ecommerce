import { MongooseModule, Prop, Schema, SchemaFactory, Virtual } from "@nestjs/mongoose";
import { decrypt, encrypt, Hash, type HydratedOtpDocument, UserGender, UserProvider, UserRole } from "src/common";


@Schema({
    timestamps:true,
    toJSON:{virtuals :true},
    toObject:{virtuals :true},
    strictQuery:true
})
export class User { 
    @Prop({type : String , required : true , minLength : 1 , maxlength :25})
    FirstName : string;

    @Prop({type : String , required : true , minLength : 1 , maxlength :25})
    LastName : string;

    @Virtual({
        get(this: User) {
            return `${this.FirstName} ${this.LastName} `
        },
    set(this: User, value: string) {
        const [first, last] = value.split(' ');
        this.FirstName = first;
        this.LastName = last;
    },
    })
    UserName : string;

    @Prop({type : String , required : true ,unique : true , trim : true})
    Email : string;

    @Prop({type : String ,enum :UserProvider , default : UserProvider.System })
    Provider : UserProvider;

    @Prop({type : String ,enum :UserRole , default : UserRole.User })
    Role : UserRole;

    @Prop({type : String ,enum :UserGender , required :true})
    Gender : UserGender


    @Prop({type : Date , default : Date.now})
    ChangeCredentialsAT : Date;

    @Prop({type : String })
    Password : string;

    @Prop({type : Number ,min : 16 , max : 80})
    Age : number;

    @Prop({type : String , required : true })
    Phone : string;

    @Virtual()
    Otp : HydratedOtpDocument;

    @Prop({type : Boolean , default : false})
    Confirmed : boolean;

    @Prop({type : Date})
    ConfirmedAt : Date;

    @Prop({type : Date})
    DeletedAt : Date;

    @Prop({type : String})
    ProfileImage : string;
}

export const UserSchema = SchemaFactory.createForClass(User);

export const UserModel = MongooseModule.forFeatureAsync([{ name: User.name, useFactory: () => UserSchema.pre('save', async function(next) { 
    if (this.isModified('Password')) {
        this.Password = await Hash(this.Password);
    }
    if (this.isModified('Phone')) {
        this.Phone = encrypt(this.Phone);
    }
    next();
}) }])


// UserSchema.post(["find","findOne"], function (doc) {
//     if (doc.Phone) {
//     doc.Phone = decrypt(doc.Phone);
//     }
// });

UserSchema.virtual("Otp" , {
    ref:"Otp",
    localField:"_id",
    foreignField:"CreateBy"
})
