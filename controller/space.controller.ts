import { Model } from "mongoose"
import { AnimalGroupModel, MaintenanceBookletModel, Role, RoleModel, SessionModel, Space, SpaceModel, User, UserModel } from "../models"
import { Router, Response, Request} from "express"
import * as express from 'express'
import { checkBody, checkUserRole, checkUserToken } from "../middleware"


export class SpacesController {

    readonly path: string
    readonly model: Model<Space>
    guestRole: Role | null

    constructor(){
        this.path = "/space"
        this.model = SpaceModel
        this.guestRole = null
    }

    readonly paramsCreateSpace = {
        "name": "string",
        "description": "string",
        "capacity" : "number",
        "handicapped_access": "boolean"
    }

    readonly paramsGetSpaceInfo = {
        "spaceId": "string"
    }

    readonly paramsAddAnimalGroup = {
        "animalGroupId": "string",
        "spaceId" : "string"
    }

    readonly paramsMaintenance = {
        "spaceId": "string",
        "state" : "boolean"
    }

    createSpace = async (req: Request, res: Response): Promise<void> => {

        const space = await SpaceModel.create({
            name: req.body.name,
            description: req.body.description,
            capacity: req.body.capacity,
            open: false,
            handicapped_access: req.body.handicapped_access,
            maintenance: false,
            maintenance_booklet: [],
            animal_species: []  
        })

        res.json(space)
    }

    update = async (req: Request, res: Response): Promise<void> => {
        res.status(504).send("The functionality in not yet done, will take a coffee in the meantime.")
    }

    addAnimalGroup = async (req: Request, res: Response): Promise<void> => {

        const space = await SpaceModel.findById(req.body.spaceId).exec()
        const animalGroup = await AnimalGroupModel.findById(req.body.animalGroupId).exec()

        if (!space || !animalGroup){res.status(400).end(); return }

        if (space.animal_species.length >= space.capacity){
            res.status(422).json({"message": "The space is full, it is no longer possible to add groups of animals"})
            return 
        }

        const spaceIndex = space.animal_species.indexOf(req.body.animalGroupId);

        if (spaceIndex === -1) {
            await SpaceModel.updateOne(
                { _id: space._id },  
                { $push: { animal_species: animalGroup } } 
            )
            res.status(200).end()
            return 
        } else {
            res.status(409).end()
            return 
        }
    
    }

    getSpace = async (req: Request, res: Response): Promise<void> => {

        try{
            const space = await SpaceModel.findById(req.body.spaceId).populate({
                path: "animal_species",
                populate: {
                    path: "animals"
                }
            }).populate({
                path: "maintenance_booklet",
            }).exec()
            
            if(!space){
                res.status(404).end()
                return
            }
            res.send(space)

        }catch (error) {
            console.error(`Error in getSpace: ${error}`);
            res.status(404).end()
            return 
        }
        
    }

    switchMaintenance = async (req:Request, res:Response): Promise<void> => {

        await SpaceModel.updateOne(
            { _id: req.body.spaceId },  
            { $set: { maintenance: req.body.state } } 
        );

        res.status(200).end()
        return      
    }

    switchOpen = async (req:Request, res:Response): Promise<void> => {
        await SpaceModel.updateOne(
            { _id: req.body.spaceId },  
            { $set: { open: req.body.state } } 
        );

        res.status(200).end()
        return    
    }

    buildRouter = (): Router => {
        const router = express.Router()
        router.get('/', express.json(), checkUserToken(), checkBody(this.paramsGetSpaceInfo), this.getSpace.bind(this))
        router.post('/', express.json(), checkUserToken(), checkUserRole("admin"), checkBody(this.paramsCreateSpace), this.createSpace.bind(this))
        router.patch('/maintenance', express.json(), checkUserToken(), checkUserRole('admin'), checkBody(this.paramsMaintenance), this.switchMaintenance.bind(this))
        router.patch('/open', express.json(), checkUserToken(), checkUserRole("admin"), checkBody(this.paramsMaintenance), this.switchOpen.bind(this))
        router.patch('/new/animal_group', express.json(), checkUserToken(), checkUserRole("admin"), checkBody(this.paramsAddAnimalGroup), this.addAnimalGroup.bind(this))
        return router
    }

}
