import { Model } from "mongoose"
import { Role, RoleModel, SessionModel, Space, SpaceModel, User, UserModel } from "../models"
import { Router, Response, Request} from "express"
import * as express from 'express'
import { checkUserRole, checkUserToken } from "../middleware"


export class SpacesController {

    readonly path: string
    readonly model: Model<Space>
    guestRole: Role | null

    constructor(){
        this.path = "/space"
        this.model = SpaceModel
        this.guestRole = null
    }

    createSpace = async (req: Request, res: Response): Promise<void> => {
        res.status(504).send("The functionality in not yet done, will take a coffee in the meantime.")
    }

    update = async (req: Request, res: Response): Promise<void> => {
        res.status(504).send("The functionality in not yet done, will take a coffee in the meantime.")
    }

    addAnimalGroup = async (req: Request, res: Response): Promise<void> => {
        res.status(504).send("The functionality in not yet done, will take a coffee in the meantime.")
    }

    buildRouter = (): Router => {
        const router = express.Router()
        router.post('/new', express.json(), checkUserToken(), checkUserRole("admin"), this.createSpace.bind(this))
        router.patch('/update', express.json(), checkUserToken(), checkUserRole("admin"), this.update.bind(this))
        router.patch('/new/animal_group', express.json(), checkUserToken(), checkUserRole("admin"), this.addAnimalGroup.bind(this))
        return router
    }

}
