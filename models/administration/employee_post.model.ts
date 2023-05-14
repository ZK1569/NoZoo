import mongoose, { Schema, Model } from "mongoose";
import { Space } from "../space/space.model";
import { User } from "../user.model";

const employee_postShemma = new Schema<Employee_post>({
    receptionist: [{
        type: Schema.Types.ObjectId,
        ref: "User",
        required : true
    }],
    veterinarian: [{
        type: Schema.Types.ObjectId,
        ref: "User",
        required : true
    }],
    maintenance_agent: [{
        type: Schema.Types.ObjectId,
        ref: "User",
        required : true
    }],
    salesman: [{
        type: Schema.Types.ObjectId,
        ref: "User",
        required : true
    }],
}, {
    versionKey: false,
    collection: "Employee_posts"
})

export interface Employee_post{
    receptionist: User[],
    veterinarian: User[],
    maintenance_agent: User[],
    salesman: User[] 
}

export const Employee_postModel: Model<Employee_post> = mongoose.model("Employee_post", employee_postShemma)