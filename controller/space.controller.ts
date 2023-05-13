import { Model } from "mongoose"
import { MaintenanceBookletModel, Role, RoleModel, SessionModel, Space, SpaceModel, User, UserModel } from "../models"
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

    paramsCreateSpace = {
        "name": "string",
        "description": "string",
        "capacity" : "number",
        "handicapped_access": "boolean"
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
        res.status(504).send("The functionality in not yet done, will take a coffee in the meantime.")
    }

    buildRouter = (): Router => {
        const router = express.Router()
        router.post('/', express.json(), checkUserToken(), checkUserRole("admin"), checkBody(this.paramsCreateSpace), this.createSpace.bind(this))
        router.patch('/', express.json(), checkUserToken(), checkUserRole("admin"), this.update.bind(this))
        router.patch('/new/animal_group', express.json(), checkUserToken(), checkUserRole("admin"), this.addAnimalGroup.bind(this))
        return router
    }

}
