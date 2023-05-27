import mongoose, { Schema, Model, Date } from "mongoose";
import { AnimalGroup } from "./animalGroup.model";
import { MaintenanceBooklet } from "./maintenanceBooklet.model";
import { File } from "buffer";

const spaceShemma = new Schema<Space>({
    name: {
        type: Schema.Types.String,
        index: true,
        required : true
    },
    description:{
        type: Schema.Types.String,
        require: true
    },
    capacity:{
        type: Schema.Types.Number,
        required: true
    }, 
    open: {
        type: Schema.Types.Boolean,
        required: true,
    },
    handicapped_access: {
        type: Schema.Types.Boolean,
        required: true,
    },
    maintenance: {
        type: Schema.Types.Boolean,
        required: true,
    },
    maintenance_booklet: [{
        type: Schema.Types.ObjectId,
        ref: "MaintenanceBooklet",
        require: true
    }],
    animal_species: [{
        type: Schema.Types.ObjectId,
        ref: "AnimalGroup", 
        require: true
    }],
    type:[{
        type : Schema.Types.String
    }],
    time:{
        type: Schema.Types.Date
    },
    image:{
        type: Schema.Types.String
    }


}, {
    versionKey: false,
    collection: "Spaces"
})

export interface Space{
    _id: string, 
    name: string,
    description: string,
    image: string, // Save the img as GridFS
    type: string[] // A list of all the characteristics of the space (Ex: Feline, dangerous, nocturnal, ...)
    capacity: number,
    time: Date,
    open: boolean,
    handicapped_access: boolean,
    maintenance: boolean,
    maintenance_booklet: MaintenanceBooklet[],
    animal_species: AnimalGroup[]

}

export const SpaceModel: Model<Space> = mongoose.model("Space", spaceShemma)