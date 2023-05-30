import {config} from "dotenv";
config();

import * as express from 'express'
import * as mongoose from 'mongoose'
import { Response, Request} from "express"
import { UserController } from "./controller/user.controller";
import { SpacesController } from "./controller/space/space.controller"
import { AnimalController } from "./controller/space/animal.controller";
import { AnimalGroupController } from "./controller/space/animalGroup.controller";
import morgan  from "morgan"
import { ZooController } from "./controller/administration/zoo.controller";
import { TicketController } from "./controller/ticket/ticket.controller";
import { StartService } from "./service";

const startServer = async (): Promise<void> => {
    const connection = await mongoose.connect(process.env.MONGODB_URI as string, {auth: {
            username: process.env.MANGODB_USER as string,
            password: process.env.MANGODB_PASSWORD as string
        },
        authSource: "admin"
    })

    await StartService.userRoles()
    await StartService.typeTickets()
    await StartService.zooCreation()
    await StartService.createUsers()
    
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

startServer().catch((err) => {
    console.error(err)
})