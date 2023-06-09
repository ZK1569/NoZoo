import { Model } from "mongoose"
import { AnimalGroupModel, MaintenanceBookletModel, Role, RoleModel, SessionModel, Space, SpaceModel, User, UserModel } from "../../models"
import { Router, Response, Request} from "express"
import * as express from 'express'
import { checkBody, checkQuery, checkUserRole, checkUserToken } from "../../middleware"
import { Zoo, ZooModel } from "../../models/zoo.model"
import { RolesEnums } from "../../enums"


export class SpacesController {

    readonly path: string
    readonly model: Model<Space>
    zoo: Zoo | null

    constructor(){
        this.path = "/space"
        this.model = SpaceModel
        this.zoo = null
    }

    readonly paramsCreateSpace = {
        "name": "string",
        "description": "string",
        "capacity" : "number",
        "handicapped_access": "boolean"
    }

    readonly queryGetSpaceInfo = {
        "id": "string"
    }

    readonly paramsAddAnimalGroup = {
        "animalGroupId": "string",
        "spaceId" : "string"
    }

    readonly paramsMaintenance = {
        "spaceId": "string",
        "state" : "boolean"
    }

    readonly paramsMaintenanceTask = {
        "spaceId": "string",
        "action" : "string"
    }

    private loadZoo = async ():Promise<void> => {
        if (this.zoo){
            return
        }
        this.zoo = await ZooModel.findOne({
            name: "NoZoo"
        }).exec()
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
            animal_species: [] ,
            type : [],
            time : Date(),
            image : ""
        })

        await this.loadZoo()
        if(!this.zoo){
            res.status(500).json({"message": "This mistake will never happen"})
            return
        }
        
        await ZooModel.updateOne(
            { _id: this.zoo._id },  
            { $push: { spaces: space } } 
        )

        res.status(201).json(space)
    }

    addAnimalGroup = async (req: Request, res: Response): Promise<void> => {

        let space
        let animalGroup
        try{
            space = await SpaceModel.findById(req.body.spaceId).exec()
            animalGroup = await AnimalGroupModel.findById(req.body.animalGroupId).exec()
        }catch(err){
            res.status(404).json({"message": "Space or Animal id is not correct"})
            return 
        }

        if (!space || !animalGroup){res.status(404).json({"message" : "Space or Animal Group not found"}); return }

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
            res.status(409).json({"message": "This animal group is already in this space"})
            return 
        }
    
    }

    getSpace = async (req: Request, res: Response): Promise<void> => {

        try{
            const space = await SpaceModel.findById(req.query.id).populate({
                path: "animal_species",
                populate: {
                    path: "animals"
                }
            }).populate({
                path: "maintenance_booklet",
            }).exec()
            
            if(!space){
                res.status(404).json({"message": "Space not found"})
                return
            }
            res.send(space)
            return

        }catch (error) {
            console.error(`Error in getSpace: ${error}`);
            res.status(404).json({"message": "This is not a valid space id"})
            return 
        }
        
    }

    switchMaintenance = async (req:Request, res:Response): Promise<void> => {
        try{
            await SpaceModel.updateOne(
                { _id: req.body.spaceId },  
                { $set: { maintenance: req.body.state } } 
            );
    
            res.status(200).end()
            return      
        }catch(err){
            res.status(400).json({"message": "This is not a valid space id"})
            return
        }
    }

    switchOpen = async (req:Request, res:Response): Promise<void> => {
        try{
            await SpaceModel.updateOne(
                { _id: req.body.spaceId },  
                { $set: { open: req.body.state } } 
            );
    
            res.status(200).end()
            return    
        }catch(err){
            res.status(400).json({"message": "This is not a valid space id"})
            return
        }
    }

    switchHandicap = async (req:Request, res:Response): Promise<void> => {
        try{
            await SpaceModel.updateOne(
                { _id: req.body.spaceId },  
                { $set: { handicapped_access: req.body.state } } 
            );
    
            res.status(200).end()
            return   
        }catch(err){
            res.status(400).json({"message": "This is not a valid space id"})
            return
        }
    }

    addMaintenanceTask = async (req:Request, res:Response): Promise<void> => {


        const maintenance_task = await MaintenanceBookletModel.create({
            action: req.body.action,
            date: new Date()
        })

        try{
            await SpaceModel.updateOne(
                { _id: req.body.spaceId },  
                { $push: { maintenance_booklet: maintenance_task } } 
            )
            res.status(200).json(maintenance_task)
            return 
        }catch(err){
            res.status(500).json({"message": "This mistake will never happen"})
            return 
        }
    }

    buildRouter = (): Router => {
        const router = express.Router()
        router.get('/', checkUserToken(), checkQuery(this.queryGetSpaceInfo), this.getSpace.bind(this))
        router.post('/', express.json(), checkUserToken(), checkUserRole(RolesEnums.admin), checkBody(this.paramsCreateSpace), this.createSpace.bind(this))
        router.patch('/maintenance', express.json(), checkUserToken(), checkUserRole(RolesEnums.admin), checkBody(this.paramsMaintenance), this.switchMaintenance.bind(this))
        router.patch('/open', express.json(), checkUserToken(), checkUserRole(RolesEnums.admin), checkBody(this.paramsMaintenance), this.switchOpen.bind(this))
        router.patch('/handicap', express.json(), checkUserToken(), checkUserRole(RolesEnums.admin), checkBody(this.paramsMaintenance), this.switchHandicap.bind(this))
        router.patch('/new/animal_group', express.json(), checkUserToken(), checkUserRole(RolesEnums.admin), checkBody(this.paramsAddAnimalGroup), this.addAnimalGroup.bind(this))
        router.patch('/new/maintenance_task', express.json(), checkUserToken(), checkUserRole(RolesEnums.maintenance_agent), checkBody(this.paramsMaintenanceTask), this.addMaintenanceTask.bind(this))
        return router
    }

}
