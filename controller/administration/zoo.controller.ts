import { Model } from "mongoose"
import { Zoo, ZooModel } from "../../models/zoo.model"
import { Router, Request, Response } from "express"

import * as express from "express"
import { checkBody, checkUserRole, checkUserToken } from "../../middleware"
import { Employee_postModel } from "../../models/administration/employee_post.model"



export class ZooController {

    readonly path: string
    readonly model: Model<Zoo>

    constructor(){
        this.path = "/zoo"
        this.model = ZooModel
    }

    readonly paramsNewZoo = {
        "name": "string",
    }

    newZoo = async (req:Request, res:Response): Promise<void> => {

        // Check if there is a zoo in the database
        const nbrZoo = await ZooModel.countDocuments()

        if (nbrZoo > 0){
            res.status(409).json({message: "The zoo has already been created"})
            return
        }

        const employee_post = await Employee_postModel.create({
            receptionist: [],
            veterinarian: [],
            maintenance_agent: [],
            salesman: [] 
        })

        const zoo = await ZooModel.create({
            name: req.body.name,
            spaces: [],
            is_open: false,
            employee_post
        })

        res.json(zoo)
        return 
    }



    buildRouter = (): Router => {
        const router = express.Router()
        router.post('/', express.json(), checkUserToken(), checkUserRole('admin'), checkBody(this.paramsNewZoo), this.newZoo.bind(this))

        return router
    }

}