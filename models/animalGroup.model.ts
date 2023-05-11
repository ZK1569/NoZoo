import mongoose, { Schema, Model } from "mongoose";
import internal = require("stream");
import { Animal } from "./animal.model";

const animalGroupShemma = new Schema<AnimalGroup>({
    name: {
        type: Schema.Types.String,
        index: true,
        required : true
    },
    animals:{
        type: Schema.Types.ObjectId,
        ref: "Animal", 
        require: true
    },
    max:{
        type: Schema.Types.Number,
        required: true
    }
}, {
    versionKey: false,
    collection: "AnimalGroups"
})

export interface AnimalGroup{
    name: string,
    animals: Animal,
    max: number
}

export const AnimalGroupModel: Model<AnimalGroup> = mongoose.model("AnimalGroup", animalGroupShemma)