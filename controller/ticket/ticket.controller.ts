import { Model } from "mongoose"
import { Ticket, TicketModel, TypeTicketModel } from "../../models"
import { Router, Request, Response } from "express"
import * as express from "express"
import { checkBody, checkTicket, checkUserRole, checkUserToken } from "../../middleware"
import { TicketService } from "../../service"

export class TicketController {

    readonly path: string
    readonly model: Model<Ticket>

    constructor(){
        this.path = "/ticket"
        this.model = TicketModel
    }

    readonly paramsCreateTicket = {
        // More information : object is of type array of strings (Ex: ["64676e22f696d45da858af0f", "64676aead150ca46ce72ce61"])
        "type_ticket_id": "string",
        "list_accessible_spaces" : "object"
    }

    createTicket = async (req:Request, res: Response): Promise<void> => {

        if(!req.user){res.status(401).end(); return }

        const type_ticket = await TypeTicketModel.findById(req.body.type_ticket_id).exec()
        
        const ticket = await TicketModel.create({
            user: req.user,
            type_ticket: type_ticket,
            accessible_spaces: req.body.list_accessible_spaces,
            is_in_use: false,
            creation_date: new Date()
        })

        res.status(201).json(ticket)
        return 
    }

    readonly paramsGetTicket = {
        "ticket_id": "string"
    }

    getTicket = async (req: Request, res: Response): Promise<void> => {

        const ticket = await TicketModel.findById(req.body.ticket_id).populate({
            path: "user", 
        }).populate({
            path: "accessible_spaces",
        })

        res.status(200).json(ticket)
        return 
    }

    readonly paramsCheckTicketZooAccess = {
        "ticket_id": "string"
    }

    checkTicketZooAccess = async (req:Request, res:Response): Promise<void> => {

        const ticket = await TicketModel.findById(req.body.ticket_id)

        if (!ticket){res.status(404).json({"message" : "Your ticket is not valid "}); return }

        if (ticket?.is_in_use){
            res.status(400).json({"message": "Your pass is already in use"})
            return 
        }

        const canBeUse = await TicketService.canBeUse(ticket) 

        if(!canBeUse){res.status(403).json({"message" : "You cannot access the park now"}); return }

        ticket.is_in_use = true

        ticket.save()

        res.status(200).json({"message" : "Welcome"})
        return 
    }


    buildRouter = (): Router => {
        const router = express.Router()
        router.get('/', express.json(),checkUserToken(), checkBody(this.paramsGetTicket), this.getTicket.bind(this))
        router.post("/", express.json(), checkUserToken(), checkUserRole("guest"), checkBody(this.paramsCreateTicket), this.createTicket.bind(this))
        router.patch('/zoo', express.json(), checkBody(this.paramsCheckTicketZooAccess),checkTicket(true, false), this.checkTicketZooAccess.bind(this))
        return router
    }

}