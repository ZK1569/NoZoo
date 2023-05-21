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

                    await Employee_postModel.findOneAndUpdate(
                        { _id: this.zoo.employee_post._id },  
                        { $pull: { veterinarian: { $in : user._id } } }
                    ).exec()
                    

                    res.status(200).end()
                    return 
                
                case "receptionist":

                    const indexToDeleteRece = this.zoo.employee_post.receptionist.indexOf(userId)
                        
                    if (indexToDeleteRece < 0){
                        res.status(409).json({"message": "The employee is not at his workstation "})
                        return 
                    }

                    await Employee_postModel.findOneAndUpdate(
                        { _id: this.zoo.employee_post._id },  
                        { $pull: { receptionist: { $in : user._id } } }
                    ).exec()
                
                
                    res.status(200).end()
                    return 

                case "maintenance agent":

                    const indexToDeleteAg = this.zoo.employee_post.maintenance_agent.indexOf(userId)
                        
                    if (indexToDeleteAg < 0){
                        res.status(409).json({"message": "The employee is not at his workstation "})
                        return 
                    }

                    await Employee_postModel.findOneAndUpdate(
                        { _id: this.zoo.employee_post._id },  
                        { $pull: { maintenance_agent: { $in : user._id } } }
                    ).exec()
                
                
                    res.status(200).end()
                    return 

                case "salesman":

                    const indexToDeleteSel = this.zoo.employee_post.salesman.indexOf(userId)
                        
                    if (indexToDeleteSel < 0){
                        res.status(409).json({"message": "The employee is not at his workstation "})
                        return 
                    }

                    await Employee_postModel.findOneAndUpdate(
                        { _id: this.zoo.employee_post._id },  
                        { $pull: { salesman: { $in : user._id } } }
                    ).exec()
                
                
                    res.status(200).end()
                    return 

                default:
                    continue
                
            }
        }
        res.status(501).send("Not implemented")


    }


    readonly paramsOpenZoo = {
        "status": "boolean"
    }

    openZoo = async (req:Request, res:Response): Promise<void> => {

        await this.loadZoo()

        if (!this.zoo){res.status(500).end(); return }

        
        if (req.body.status == true){
            const nbrVeterinarian = await this.zoo.employee_post.veterinarian.length
            const nbrReceptionist = await this.zoo.employee_post.receptionist.length
            const nbrMaintenance  = await this.zoo.employee_post.maintenance_agent.length
            const nbrSalesman     = await this.zoo.employee_post.salesman.length

            if (nbrVeterinarian > 0 && nbrReceptionist > 0 && nbrMaintenance > 0 && nbrSalesman > 0){
                await ZooModel.updateOne(
                    { _id: this.zoo._id },  
                    { $set: { is_open: true } } 
                );
        
                res.status(200).end()
                return 
            }else{
                res.status(400).json({"message": "The conditions for opening the zoo are not respected"})
            }

        }
        

        await ZooModel.updateOne(
            { _id: this.zoo._id },  
            { $set: { is_open: req.body.status } } 
        );

        res.status(200).end()
        return      
    }



    buildRouter = (): Router => {
        const router = express.Router()
        router.get('/', checkUserToken(), checkUserRole('admin'), this.getZoo.bind(this))
        // router.post('/', express.json(), checkUserToken(), checkUserRole('admin'), checkBody(this.paramsNewZoo), this.newZoo.bind(this))
        router.patch('/employee/in', express.json(), checkBody(this.paramsEmployeeIn), this.employeeIn.bind(this))
        router.patch('/employee/out', express.json(), checkBody(this.paramsEmployeeOut), this.employeeOut.bind(this))
        router.patch("/open", express.json(), checkUserToken(), checkUserRole('admin'), checkBody(this.paramsOpenZoo), this.openZoo.bind(this))
        return router
    }

}