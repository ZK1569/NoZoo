import mongoose, { Schema, Model } from "mongoose";
import { Space } from "../space/space.model";

const typeTicketShemma = new Schema<TypeTicket>({
    name: {
        type: Schema.Types.String,
        required : true,
        unique: true 
    },
    
}, {
    versionKey: false,
    collection: "TypeTickets"
})

export interface TypeTicket{
    _id: string,
    name: string
}

export const TypeTicketModel: Model<TypeTicket> = mongoose.model("TypeTicket", typeTicketShemma)