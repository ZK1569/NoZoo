import {config} from "dotenv";
config();

import * as mongoose from 'mongoose'
import { RoleModel, TypeTicketModel } from "./models";
import morgan = require("morgan");
import { ZooModel } from "./models/zoo.model";
import { Employee_postModel } from "./models/administration/employee_post.model";

import app from './app'

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
    
    app.use(morgan("short"))
    
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


    const ticketNames: string[] = ["day", "weekEnd", "oneDayMonth", "escapeGame", "night"]
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
        employee_post
    })

}

startServer().catch((err) => {
    console.error(err)
})