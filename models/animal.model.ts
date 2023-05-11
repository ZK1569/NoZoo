import mongoose, { Schema, Model } from "mongoose";
import { HealthBooklet } from "./healthBooklet.model";

const animalShemma = new Schema<Animal>({
    name: {
        type: Schema.Types.String,
        index: true,
        required : true
    },
    sex:{
        type: Schema.Types.Boolean,
        require: true
    },
    date_of_birth:{
        type: Schema.Types.Date,
        required: true
    }, 
    health_booklet: [{
        type: Schema.Types.ObjectId,
        ref: "HealthBooklet",
        required: true,
    }]
}, {
    versionKey: false,
    collection: "Animals"
})

export interface Animal{
    name: string,
    sex: boolean,
    date_of_birth: Date,
    health_booklet: Array<HealthBooklet>
}

export const AnimalModel: Model<Animal> = mongoose.model("Animal", animalShemma)