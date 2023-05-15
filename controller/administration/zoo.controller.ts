import { Model } from "mongoose"
import { Zoo, ZooModel } from "../../models/zoo.model"
import { Router, Request, Response } from "express"

import * as express from "express"
import { checkBody, checkUserRole, checkUserToken } from "../../middleware"
import { Employee_post, Employee_postModel } from "../../models/administration/employee_post.model"
import { UserModel } from "../../models"



export class ZooController {

    readonly path: string
    readonly model: Model<Zoo>
    zoo: Zoo | null

    constructor(){
        this.path = "/zoo"
        this.model = ZooModel
        this.zoo = null
    }

    readonly paramsNewZoo = {
        "name": "string",
    }

    private loadZoo = async ():Promise<void> => {
        if (this.zoo){
            return
        }
        this.zoo = await ZooModel.findOne({
            name: "NoZoo"
        }).populate({
            path: "spaces",
            populate: ({
                path: "maintenance_booklet"
            })
        }).populate({
            path:"employee_post"
        }).exec()
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

    getZoo = async (req:Request, res:Response): Promise<void> => {
        await this.loadZoo()
        
        res.status(200).json(this.zoo)

    }

    readonly paramsEmployeeIn = {
        "empId": "string"
    }
    employeeIn = async (req:Request, res: Response): Promise<void> => {
        
        const userId = req.body.empId
        const user = await UserModel.findById(userId).populate({path: "roles"}).exec()
        if(!user){res.status(404).json({"message" : "User not found"}); return}
        
        await this.loadZoo()
        if(!this.zoo){res.status(500).end(); return}

        const userRoles = user.roles

        for (let role of userRoles){
            if(typeof role !== 'object'){continue}
            
            switch(role.name){
                case "veterinarian":
                        
                    if (this.zoo.employee_post.veterinarian.indexOf(userId) >= 0){
                        res.status(409).json({"message": "The employee is already at his workstation "})
                        return 
                    }

                    await Employee_postModel.updateOne(
                        { _id: this.zoo.employee_post._id },  
                        { $push: { veterinarian: user } } 
                    )
                    res.status(200).end()
                    return 

                case "maintenance agent":

                    if (this.zoo.employee_post.maintenance_agent.indexOf(userId) >= 0){
                        res.status(409).json({"message": "The employee is already at his workstation "})
                        return 
                    }
                    
                    await Employee_postModel.updateOne(
                        { _id: this.zoo.employee_post._id },  
                        { $push: { maintenance_agent: user } } 
                    )
                    res.status(200).end()
                    return 

                case "seller":

                    if (this.zoo.employee_post.salesman.indexOf(userId) >= 0){
                        res.status(409).json({"message": "The employee is already at his workstation "})
                        return 
                    }
                    
                    await Employee_postModel.updateOne(
                        { _id: this.zoo.employee_post._id },  
                        { $push: { salesman: user } } 
                    )
                    res.status(200).end()
                    return 

                case "receptionist":

                    if (this.zoo.employee_post.receptionist.indexOf(userId) >= 0){
                        res.status(409).json({"message": "The employee is already at his workstation "})
                        return 
                    }

                    await Employee_postModel.updateOne(
                        { _id: this.zoo.employee_post._id },  
                        { $push: { receptionist: user } } 
                    )
                    res.status(200).end()
                    return 

                default:
                    continue
                    
                    
            }
        }

        res.status(401).json({"message": "None of your workstations have been recognized"})
        return

    }

    readonly paramsEmployeeOut = {
        "empId": "string"
    }
    employeeOut = async (req:Request, res: Response): Promise<void> => {

        const userId = req.body.empId
        const user = await UserModel.findById(userId).populate({path: "roles"}).exec()
        if(!user){res.status(404).json({"message" : "User not found"}); return}
        
        await this.loadZoo()
        if(!this.zoo){res.status(500).end(); return}

        const userRoles = user.roles
        
        for (let role of userRoles){
            if(typeof role !== 'object'){continue}

            switch(role.name){
                case "veterinarian":

                    const indexToDelete = this.zoo.employee_post.veterinarian.indexOf(userId)
                        
                    if (indexToDelete < 0){
                        res.status(409).json({"message": "The employee is not at his workstation "})
                        return 
                    }

                    const rep = await Employee_postModel.findOneAndUpdate(
                        { _id: this.zoo.employee_post._id },  
                        { $pull: { veterinarian: { _id: user._id } } }
                    ).exec()
                    
                    console.log(rep);
                    

                    res.status(200).end()
                    return 

                default:
                    continue
            }
        }
        res.status(501).send("Not implemented")


    }




    buildRouter = (): Router => {
        const router = express.Router()
        router.get('/', checkUserToken(), checkUserRole('admin'), this.getZoo.bind(this))
        router.post('/', express.json(), checkUserToken(), checkUserRole('admin'), checkBody(this.paramsNewZoo), this.newZoo.bind(this))
        router.patch('/employee/in', express.json(), checkBody(this.paramsEmployeeIn), this.employeeIn.bind(this))
        router.patch('/employee/out', express.json(), checkBody(this.paramsEmployeeOut), this.employeeOut.bind(this))
        return router
    }

}