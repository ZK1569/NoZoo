import { Document, Model } from "mongoose"
import { Ticket, TicketModel, TypeTicketModel } from "../../models"
import { Router, Request, Response } from "express"
import * as express from "express"
import { checkBody, checkQuery, checkTicket, checkUserRole, checkUserToken } from "../../middleware"
import { TicketService } from "../../service"
import { Zoo, ZooModel } from "../../models/zoo.model"
import { RolesEnums } from "../../enums"

export class TicketController {

    readonly path: string
    readonly model: Model<Ticket>
    zoo: (Document<unknown, {}, Zoo> & Omit<Zoo & Required<{
        _id: string;
    }>, never>) | null

    constructor(){
        this.path = "/ticket"
        this.model = TicketModel
        this.zoo = null
    }

    private loadZoo = async ():Promise<void> => {
        if (this.zoo){
            return
        }
        this.zoo = await ZooModel.findOne({
            name: "NoZoo"
        }).populate({
            path: "spaces",
            populate: ({
                path: "maintenance_booklet"
            })
        }).populate({
            path:"employee_post"
        }).exec()
        
    }

    readonly paramsCreateTicket = {
        // More information : object is of type array of strings (Ex: ["64676e22f696d45da858af0f", "64676aead150ca46ce72ce61"])
        "type_ticket_id": "string",
        "list_accessible_spaces" : "object"
    }

    createTicket = async (req:Request, res: Response): Promise<void> => {

        if(!req.user){res.status(401).end(); return }

        let type_ticket
        try{
            type_ticket = await TypeTicketModel.findById(req.body.type_ticket_id).exec()
        }catch(err){
            res.status(400).json({"message": "This is not a valid type ticket id"})
            return 
        }

        if(!type_ticket){
            res.status(404).json({"message" : "Your ticket type is not valid"})
        }
        
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

    readonly queryGetTicket = {
        "id": "string"
    }

    getTicket = async (req: Request, res: Response): Promise<void> => {
        try{
            const ticket = await TicketModel.findById(req.query.id).populate({
                path: "user", 
            }).populate({
                path: "accessible_spaces",
            })
    
            res.status(200).json(ticket)
            return 
        }catch(err){
            res.status(400).json({"message": "This is not a valid ticket id"})
            return 
        }
    }

    readonly paramsCheckTicketAccess = {
        "ticket_id": "string"
    }

    checkTicketZooAccess = async (req:Request, res:Response): Promise<void> => {

        let ticket
        try{
            ticket = await TicketModel.findById(req.body.ticket_id)
        }catch(err){
            res.status(400).json({"message": "Your ticket is not valid"})
            return
        }

        if (!ticket){res.status(404).json({"message" : "Your ticket is not valid "}); return }

        if (ticket?.is_in_use){
            res.status(400).json({"message": "Your pass is already in use"})
            return 
        }

        const canBeUse = await TicketService.canBeUse(ticket) 

        if(!canBeUse){res.status(403).json({"message" : "You cannot access the park now"}); return }

        ticket.is_in_use = true
        ticket.save()
        
        await this.loadZoo()
        
        if(this.zoo){

            this.zoo.totalVisitors = this.zoo.totalVisitors + 1 
            this.zoo.visitorsLive = this.zoo.visitorsLive + 1
            this.zoo.save()
        }


        res.status(200).json({"message" : "Welcome"})
        return 
    }

    readonly paramsCheckTicketSpaceAccess = {
        "ticket_id": "string",
        "space_id": "string"
    }

    checkTicketSpaceAccess = async (req:Request, res:Response): Promise<void> => {

        let ticket
        try{
            ticket = await TicketModel.findById(req.body.ticket_id)
        }catch(err){
            res.status(400).json({"message": "Your ticket is not valid"})
            return
        }

        if (!ticket){res.status(401).json({"message": "Your ticket is not valid"}); return}

        if(!ticket.is_in_use){
            res.status(400).json({"message" : "Your pass is not active"})
            return 
        }

        const canBeUse = await TicketService.canAccessSpace(ticket, req.body.space_id)

        if(!canBeUse){
            res.status(403).json({"message" : "You cannot access the space with this ticket"})
            return 
        }

        res.status(200).json({"message" : "Welcome"})
        return 
    }

    ticketOutZoo = async (req:Request, res: Response): Promise<void> => {

        let ticket
        try{
            ticket = await TicketModel.findById(req.body.ticket_id)
        }catch(err){
            res.status(400).json({"message": "Your ticket is not valid"})
            return
        }

        if (!ticket){res.status(404).json({"message" : "Your ticket is not valid "}); return }

        if (!ticket.is_in_use){
            res.status(400).json({"message": "Your pass is not activated"})
            return 
        }

        const canGo = await TicketService.canExitZoo(ticket)

        if (!canGo){
            res.status(403).json({"message": "You cannot exit the zoo. You're going to stay here for the rest of your life"})
            return 
        }

        await this.loadZoo()
        
        if(this.zoo){
            
            this.zoo.visitorsLive = this.zoo.visitorsLive - 1
            this.zoo.save()
        }

        res.status(200).json({"message": "GoodBye"})

    }


    buildRouter = (): Router => {
        const router = express.Router()
        router.get('/', checkUserToken(), checkQuery(this.queryGetTicket), this.getTicket.bind(this))
        router.post("/", express.json(), checkUserToken(), checkUserRole(RolesEnums.guest), checkBody(this.paramsCreateTicket), this.createTicket.bind(this))
        router.patch('/zoo', express.json(), checkBody(this.paramsCheckTicketAccess),checkTicket(), this.checkTicketZooAccess.bind(this))
        router.patch('/space', express.json(), checkBody(this.paramsCheckTicketSpaceAccess), checkTicket(), this.checkTicketSpaceAccess.bind(this))
        router.delete('/zoo', express.json(), checkBody(this.paramsCheckTicketAccess), checkTicket(), this.ticketOutZoo.bind(this))
        return router
    }

}