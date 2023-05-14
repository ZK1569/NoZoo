import {config} from "dotenv";
config();

import * as express from 'express'
import * as mongoose from 'mongoose'
import { Response, Request} from "express"
import { UserController } from "./controller/user.controller";
import { RoleModel } from "./models";
import morgan = require("morgan");
import { SpacesController } from "./controller/space.controller";
import { AnimalController } from "./controller/animal.controller";
import { AnimalGroupController } from "./controller/animalGroup.controller";

const startServer = async (): Promise<void> => {
    const connection = await mongoose.connect(process.env.MONGODB_URI as string, {auth: {
            username: process.env.MANGODB_USER as string,
            password: process.env.MANGODB_PASSWORD as string
        },
        authSource: "admin"
    })

    await upsertRoles()
    
    const app = express()

    app.use(morgan("short"))

    app.get("/", (req:Request, res:Response) => {
        res.send('Server up')
    })

    const userController = new UserController()
    const spaceController = new SpacesController()
    const animalController = new AnimalController()
    const animalGroupController = new AnimalGroupController()

    app.use(userController.path, userController.buildRouter())
    app.use(spaceController.path, spaceController.buildRouter())
    app.use(animalController.path, animalController.buildRouter())
    app.use(animalGroupController.path, animalGroupController.buildRouter())
    
    app.listen(process.env.PORT, () => {
        console.log(`Server up on PORT : ${process.env.PORT}`)
    })
       
}

const upsertRoles = async () => {
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

startServer().catch((err) => {
    console.error(err)
})