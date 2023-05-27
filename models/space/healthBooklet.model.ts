import mongoose, { Schema, Model } from "mongoose";
import { User } from "../user.model";

const healthBookletShemma = new Schema<HealthBooklet>({
    action: {
        type: Schema.Types.String,
        index: true,
        required : true
    },
    date:{
        type: Schema.Types.Date,
        require: true
    },
    veto:{
        type: Schema.Types.ObjectId,
        req: "User",
    }
}, {
    versionKey: false,
    collection: "HealthBooklets"
})

export interface HealthBooklet{
    action: string,
    date: Date, 
    veto: User
}

export const HealthBookletModel: Model<HealthBooklet> = mongoose.model("HealthBooklet", healthBookletShemma)