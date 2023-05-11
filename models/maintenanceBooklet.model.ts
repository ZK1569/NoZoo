import mongoose, { Schema, Model } from "mongoose";
import internal = require("stream");

const maintenanceBookletShemma = new Schema<MaintenanceBooklet>({
    action: {
        type: Schema.Types.String,
        index: true,
        required : true
    },
    date:{
        type: Schema.Types.Date,
        index: true,
        require: true
    }
}, {
    versionKey: false,
    collection: "MaintenanceBooklets"
})

export interface MaintenanceBooklet{
    action: string,
    date: Date
}

export const MaintenanceBookletModel: Model<MaintenanceBooklet> = mongoose.model("MaintenanceBooklet", maintenanceBookletShemma)