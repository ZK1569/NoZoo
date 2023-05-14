import mongoose, { Schema, Model } from "mongoose";
import { Space } from "./space/space.model";
import { Employee_post } from "./administration/employee_post.model";

const zooShemma = new Schema<Zoo>({
    name: {
        type: Schema.Types.String,
        index: true,
        unique: true,
        required : true
    },
    spaces:[{
        type: Schema.Types.ObjectId,
        ref: 'Space',
        require: true
    }],
    is_open:{
        type: Schema.Types.Boolean,
        required: true
    },
    employee_post:{
        type: Schema.Types.ObjectId,
        ref: "Employee_post", 
        required: true,
    }
}, {
    versionKey: false,
    collection: "Zoos"
})

export interface Zoo{
    name: string,
    spaces: Space[],
    is_open: boolean,
    employee_post: Employee_post
}

export const ZooModel: Model<Zoo> = mongoose.model("Zoo", zooShemma)