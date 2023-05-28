import {config} from "dotenv";
config();

import * as express from 'express'
import * as mongoose from 'mongoose'
import { Response, Request} from "express"
import { Document, Types } from "mongoose";
import { UserController } from "./controller/user.controller";
import { Role, RoleModel, TypeTicketModel, UserModel } from "./models";
import { SpacesController } from "./controller/space/space.controller"
import { AnimalController } from "./controller/space/animal.controller";
import { AnimalGroupController } from "./controller/space/animalGroup.controller";
import morgan = require("morgan");
import { ZooController } from "./controller/administration/zoo.controller";
import { ZooModel } from "./models/zoo.model";
import { Employee_postModel } from "./models/administration/employee_post.model";
import { TicketController } from "./controller/ticket/ticket.controller";
import { SecurityUtils } from "./utils";

const startServer = async (): Promise<void> => {
    const connection = await mongoose.connect(process.env.MONGODB_URI as string, {auth: {
            username: process.env.MANGODB_USER as string,
            password: process.env.MANGODB_PASSWORD as string
        },
        authSource: "admin"
    })

    await userRoles()
    await typeTickets()
    await zooCreation()
    await createUsers()
    
    const app = express()

    app.use(morgan("short"))

    app.get("/", (req:Request, res:Response) => {
        res.send('Server up')
    })

    const userController = new UserController()
    const spaceController = new SpacesController()
    const animalController = new AnimalController()
    const animalGroupController = new AnimalGroupController()
    const zooController = new ZooController()
    const ticketController = new TicketController()

    app.use(userController.path, userController.buildRouter())
    app.use(spaceController.path, spaceController.buildRouter())
    app.use(animalController.path, animalController.buildRouter())
    app.use(animalGroupController.path, animalGroupController.buildRouter())
    app.use(zooController.path, zooController.buildRouter())
    app.use(ticketController.path, ticketController.buildRouter())
    
    app.listen(process.env.PORT, () => {
        console.log(`Server up on PORT : ${process.env.PORT}`)
    })
       
}

const userRoles = async () => {
    const countRoles = await RoleModel.count().exec()
    if(countRoles !== 0 ){
        return 
    }

    const rolesNames: string[] = ["admin", "guest", "receptionist", "veterinarian", "maintenance agent", "seller"]
    const rolesRequest = rolesNames.map((name) => {
        RoleModel.create({
            name
        })
    })
    await Promise.all(rolesRequest)
}

const typeTickets = async () => {
    const countTicket = await TypeTicketModel.count().exec()
    if(countTicket !== 0 ){
        return 
    }


    const ticketNames: string[] = ["day", "weekEnd", "oneDayMonth", "escapeGame", "night", "annual"]
    const tocketRequest = ticketNames.map((type) => {
        TypeTicketModel.create({
            name: type
        })
    })
    await Promise.all(tocketRequest)
}

const zooCreation = async () => {
    const doesZooExist = await ZooModel.count().exec()
    if(doesZooExist !== 0 ){
        return 
    }

    const employee_post = await Employee_postModel.create({
        receptionist: [],
        veterinarian: [],
        maintenance_agent: [],
        salesman: [] 
    })

    const zoo = await ZooModel.create({
        name: "NoZoo",
        spaces: [],
        is_open: false,
        employee_post,
        totalVisitors: 0,
        visitorsLive: 0
    })

}

const createUsers = async ():Promise<void> => {
    const countUsers = await UserModel.count().exec()
    if(countUsers !== 0 ){
        return 
    }

    const roles = await RoleModel.find().exec()
    
    const usersNames: string[] = ["admin@mail.com", "guest@mail.com"]

    const usersRequest = usersNames.map((login) => {
        let userRoles:(Document<unknown, {}, Role> & Omit<Role & {_id: Types.ObjectId;}, never>)[] = []
        if (login.includes("admin")){
            userRoles = roles
        }else{
            userRoles = roles.map((role) => {if(role.name === "guest"){return role} else {return null}}).filter((role) => {if(role){return role} else {return null}}) as (Document<unknown, {}, Role> & Omit<Role & {_id: Types.ObjectId;}, never>)[]
        }
        UserModel.create({
            login,
            password: SecurityUtils.toSHA512("password"),
            roles: userRoles
        })
    })
    await Promise.all(usersRequest)
}

startServer().catch((err) => {
    console.error(err)
})