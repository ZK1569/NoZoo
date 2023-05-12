import { Model } from "mongoose"
import { AnimalGroup, AnimalGroupModel } from "../models"
import { Router, Request, Response } from "express"
import * as express from 'express'
import { checkBody, checkUserRole, checkUserToken } from "../middleware"


export class AnimalGroupController{

    readonly path: string
    readonly model: Model<AnimalGroup>

    constructor(){
        this.path = "/animal/group"
        this.model = AnimalGroupModel
    }

    readonly paramsCreateGroup = {
        "name" : "string",
        "max" : "number"
    }

    createGroup = async (req: Request, res:Response): Promise<void> => {

        try{
            const newGroup = await AnimalGroupModel.create({
                name: req.body.name,
                animals: [],
                max: req.body.max
            })
            res.json(newGroup)

        }catch(err: unknown){
            // If a group with the same name already exists then return an error 409
            const me = err as {[key: string]: unknown}
            if (me['name'] === "MongoServerError" && me['code'] === 11000){
                res.status(409).end()
            }else{
                res.status(500).end()
            }
        }   
    }


    buildRouter = (): Router => {
        const router = express.Router()
        router.post('/', express.json(), checkUserToken(), checkUserRole("admin"), checkBody(this.paramsCreateGroup), this.createGroup.bind(this))
        return router
    }
}