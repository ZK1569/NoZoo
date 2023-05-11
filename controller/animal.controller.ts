import { Model } from "mongoose"
import { Animal, AnimalModel, Role, RoleModel, SessionModel, Space, SpaceModel, User, UserModel } from "../models"
import { Router, Response, Request} from "express"
import * as express from 'express'
import { checkBody, checkUserRole, checkUserToken } from "../middleware"


export class AnimalController {

    readonly path: string
    readonly model: Model<Animal>
    guestRole: Role | null

    constructor(){
        this.path = "/animal"
        this.model = AnimalModel
        this.guestRole = null
    }

    // The body parameters of the different requests 
    readonly paramsCreateAnimal = {
        "name" : "string",
        "sex" : "boolean",
        "date" : "string"
    }

    creatAnimal = async (req: Request, res: Response): Promise<void> => {

        try{
            const animal = await AnimalModel.create({
                name: req.body.name,
                sex: req.body.sex,
                date_of_birth: new Date(req.body.date),
                health_booklet: []
            })
            res.json(animal)

        }catch(err: unknown){
            const me = err as {[key: string]: unknown}
            if (me['name'] === "ValidationError"){
                // If the date does not have a good format
                res.status(400).end()
                return
            }else{
                res.status(500).end()
            }
        }
        
    }

    addTreatment =async (req:Request, res:Response):Promise<void> => {
        res.status(504).send("The functionality in not yet done, will take a coffee in the meantime.")
    }


    buildRouter = (): Router => {
        const router = express.Router()
        router.post('/', express.json(), checkUserToken(), checkUserRole("veterinarian"), checkBody(this.paramsCreateAnimal), this.creatAnimal.bind(this))
        router.patch('/treatment', express.json(), checkUserToken(), checkUserRole("veterinarian"), this.addTreatment.bind(this))
        return router
    }
}