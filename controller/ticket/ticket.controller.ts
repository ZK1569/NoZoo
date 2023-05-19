import { Model } from "mongoose"
import { Ticket, TicketModel, TypeTicketModel } from "../../models"
import { Router, Request, Response } from "express"
import * as express from "express"
import { checkBody, checkUserRole, checkUserToken } from "../../middleware"

export class TicketController {

    readonly path: string
    readonly model: Model<Ticket>

    constructor(){
        this.path = "/ticket"
        this.model = TicketModel
    }

    readonly paramsCreateTicket = {
        "type_ticket_id": "string"
    }

    createTicket = async (req:Request, res: Response): Promise<void> => {

        if(!req.user){res.status(401).end(); return }

        const type_ticket = await TypeTicketModel.findById(req.body.type_ticket_id).exec()
        
        const ticket = await TicketModel.create({
            user: req.user,
            type_ticket: type_ticket,
            accessible_spaces: [],
            is_in_use: false,
            creation_date: new Date()
        })

        res.status(201).json(ticket)
        return 
    }


    buildRouter = (): Router => {
        const router = express.Router()
        router.post("/", express.json(), checkUserToken(), checkUserRole("guest"), checkBody(this.paramsCreateTicket), this.createTicket.bind(this))
        return router
    }

}