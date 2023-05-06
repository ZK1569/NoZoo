import {config} from "dotenv";
config();

import * as express from 'express'
import * as mongoose from 'mongoose'
import { Response, Request} from "express"

const startServer = async (): Promise<void> => {
    const connection = await mongoose.connect(process.env.MONGODB_URI as string, {auth: {
            username: process.env.MANGODB_USER as string,
            password: process.env.MANGODB_PASSWORD as string
        },
        authSource: "admin"
    })
    
    const app = express()

    app.get("/", (req:Request, res:Response) => {
        res.send('Server up')
    })
    
    app.listen(process.env.PORT, () => {
        console.log(`Server up on PORT : ${process.env.PORT}`)
    })
       
}

startServer().catch((err) => {
    console.error(err)
})