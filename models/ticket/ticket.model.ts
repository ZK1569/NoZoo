import mongoose, { Schema, Model, SchemaType } from "mongoose";
import { Space } from "../space/space.model";
import { TypeTicket } from "./typeTicket.model";
import { User } from "../user.model";

const ticketShemma = new Schema<Ticket>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
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
    },
    last_activation_date: {
        type: Schema.Types.Date,
    }
}, {
    versionKey: false,
    collection: "Tickets"
})

export interface Ticket{
    _id: string,
    user: User,
    type_ticket: TypeTicket,
    accessible_spaces: Space[],
    is_in_use: boolean,
    creation_date: Date,
    last_activation_date: Date
}

export const TicketModel: Model<Ticket> = mongoose.model("Ticket", ticketShemma)