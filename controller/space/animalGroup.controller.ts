import { Model } from "mongoose"
import { AnimalGroup, AnimalGroupModel, AnimalModel } from "../../models"
import { Router, Request, Response } from "express"
import * as express from 'express'
import { checkBody, checkQuery, checkUserRole, checkUserToken } from "../../middleware"
import { RolesEnums } from "../../enums"


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

    readonly paramsAddAnimalInGroup = {
        "animalId" : "string",
        "animalGroupId" : "string"
    }

    readonly queryGetGroup = {
        "id" : "string"
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
                res.status(409).json({"message": "A group with the same name already exists"})
                return
            }else{
                res.status(500).end()
                return
            }
        }   
    }

    addAnimalInGroup = async (req:Request, res:Response): Promise<void> => {

        const animalGroup = await AnimalGroupModel.findById(req.body.animalGroupId)
        const animal = await AnimalModel.findById(req.body.animalId)
        
        if (!animalGroup || !animal){
            res.status(400).end()
            return 
        }
        
        // Check that the group is not full  
        if (animalGroup.animals.length >= animalGroup.max){
            res.status(422).json({"message": "The group of animals is full"})
            return 
        }
        
        // Check that the animal is not already in the group 
        const animalIndex = animalGroup.animals.indexOf(req.body.animalId);
        
        if (animalIndex === -1) {
                // Add the animal to the group 
                await AnimalGroupModel.updateOne(
                    { _id: animalGroup._id },  
                    { $push: { animals: animal } } 
                );
          
                res.status(200).end()
                return 
            } else {
                res.status(409).end()
                return 
            }
    }

    getGroup = async (req:Request, res: Response): Promise<void> => {

        try{
            const animalGroup = await AnimalGroupModel.findById(req.query.id).populate({
                path: "animals",
                populate: {
                    path: "health_booklet"
                }
            }).exec()
            
            if(!animalGroup){
                res.status(404).json({"message": "Group not found"})
                return
            }
            res.send(animalGroup)
        }catch (error) {
            console.error(`Error in getAnimalById: ${error}`);
            res.status(400).json({"message": "Invalid ID"})
            return
        }
    }

    updateSpace = async (req:Request, res:Response):Promise<void> => {

        res.status(509).json({"message": "Not donne"})
        return 
    }


    buildRouter = (): Router => {
        const router = express.Router()
        router.get('/', checkUserToken(), checkQuery(this.queryGetGroup), this.getGroup.bind(this))
        router.patch('/space', express.json(), checkUserToken(), checkUserRole(RolesEnums.admin), this.updateSpace.bind(this))
        router.post('/', express.json(), checkUserToken(), checkUserRole(RolesEnums.veterinarian), checkBody(this.paramsCreateGroup), this.createGroup.bind(this))
        router.patch('/', express.json(), checkUserToken(), checkUserRole(RolesEnums.veterinarian), checkBody(this.paramsAddAnimalInGroup), this.addAnimalInGroup.bind(this))
        return router
    }
}