import mongoose, { Schema, Model } from "mongoose";
import { Space } from "../space/space.model";
import { TypeTicket } from "./typeTicket.model";

const ticketShemma = new Schema<Ticket>({
    type_ticket: {
        type: Schema.Types.ObjectId,
        ref: "TypeTicket",
        required : true
    },
    accessible_spaces:[{
        type: Schema.Types.ObjectId,
        ref: "Space",
        required: true
    }],
    is_in_use: {
        type: Schema.Types.Boolean,
        required: true
    },
    creation_date: {
        type: Schema.Types.Date,
        required : true
    }
}, {
    versionKey: false,
    collection: "Tickets"
})

export interface Ticket{
    _id: string,
    type_ticket: TypeTicket,
    accessible_spaces: Space[],
    is_in_use: boolean,
    creation_date: Date
}

export const TicketModel: Model<Ticket> = mongoose.model("Ticket", ticketShemma)