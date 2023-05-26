import * as express from 'express'
import {Request, Response} from 'express'
import { AnimalController, AnimalGroupController, SpacesController, TicketController, UserController, ZooController } from './controller'

const app = express()

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

export default app