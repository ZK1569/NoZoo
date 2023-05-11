import { Model } from "mongoose"
import { Animal, AnimalModel, Role, RoleModel, SessionModel, Space, SpaceModel, User, UserModel } from "../models"
import { Router, Response, Request} from "express"
import * as express from 'express'
import { checkUserRole, checkUserToken } from "../middleware"


export class AnimalController {

    readonly path: string
    readonly model: Model<Animal>
    guestRole: Role | null

    constructor(){
        this.path = "/animal"
        this.model = AnimalModel
        this.guestRole = null
    }

    creatAnimal = async (req: Request, res: Response): Promise<void> => {
        res.status(504).send("The functionality in not yet done, will take a coffee in the meantime.")
    }

    addTreatment =async (req:Request, res:Response):Promise<void> => {
        res.status(504).send("The functionality in not yet done, will take a coffee in the meantime.")
    }


    buildRouter = (): Router => {
        const router = express.Router()
        router.post('/', express.json(), checkUserToken(), checkUserRole("veterinarian"), this.creatAnimal.bind(this))
        router.patch('/treatment', express.json(), checkUserToken(), checkUserRole("veterinarian"), this.addTreatment.bind(this))
        return router
    }
}