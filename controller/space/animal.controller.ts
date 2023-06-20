import { Model } from "mongoose"
import { Animal, AnimalModel, HealthBookletModel, Role } from "../../models"
import { Router, Response, Request} from "express"
import * as express from 'express'
import { checkBody, checkUserRole, checkUserToken } from "../../middleware"
import { RolesEnums } from "../../enums"


export class AnimalController {

    readonly path: string
    readonly model: Model<Animal>

    constructor(){
        this.path = "/animal"
        this.model = AnimalModel
    }

    // The body parameters of the different requests 
    readonly paramsCreateAnimal = {
        "name" : "string",
        "sex" : "boolean",
        "date" : "string"
    }

    readonly paramsAddTreatment = {
        "animalId" : "string",
        "action" : "string",
        "date" : "string"
    }

    readonly paramsGetAnimal = {
        "animalId" : "string"
    }

    private getAnimalById = async (ID: string) => {
        // Check aniaml ID if its real and return his info 

        try {
            const animalInfo = await AnimalModel.findById(ID).populate({
                path: "health_booklet",
                populate: ({
                    path: "veto"
                })
            }).exec();
            
            if (!animalInfo) {
                return false;
            }
            return animalInfo;
        } catch (error) {
            console.error(`Error in getAnimalById: ${error}`);
            return false;
        }
    };

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

    addTreatment = async (req:Request, res:Response):Promise<void> => {
        
        const animalInfo = await this.getAnimalById(req.body.animalId)
        
        if(!animalInfo){
            res.status(404).end()
            return
        }

        const health_task = await HealthBookletModel.create({
            action: req.body.action,
            date: req.body.date,
            veto: req.user
        })

        await AnimalModel.updateOne(
            { _id: animalInfo._id },  
            { $push: { health_booklet: health_task } } 
          );

        res.status(200).end()
    
    }

    getAnimal = async (req:Request, res: Response): Promise<void> => {

        const animal = await this.getAnimalById(req.body.animalId)

        if(!animal){
            res.status(404).end()
            return
        }

        res.send(animal)
    }


    buildRouter = (): Router => {
        const router = express.Router()
        router.get('/', express.json(), checkUserToken(), checkBody(this.paramsGetAnimal), this.getAnimal.bind(this))
        router.post('/', express.json(), checkUserToken(), checkUserRole(RolesEnums.veterinarian), checkBody(this.paramsCreateAnimal), this.creatAnimal.bind(this))
        router.post('/treatment', express.json(), checkUserToken(), checkUserRole(RolesEnums.veterinarian), checkBody(this.paramsAddTreatment), this.addTreatment.bind(this))
        return router
    }
}