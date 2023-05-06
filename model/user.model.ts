import mongoose, { Schema, Document, Model, Date } from "mongoose";

const userShemma = new Schema<User>({
    login: {
        type: Schema.Types.String,
        index: true,
        unique: true,
        required : true
    },
    password:{
        type: Schema.Types.String,
        require: true
    },
    roles:[{
        type: Schema.Types.ObjectId,
        ref: "Roles",
        required: true
    }]
}, {
    versionKey: false,
    collection: "Users"
})

export interface User{
    login: string,
    password: string,
}


export const UserModel: Model<User> = mongoose.model("User", userShemma)