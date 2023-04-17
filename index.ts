import {config} from "dotenv";
config();
import mongoose from "mongoose"
import { Model } from "mongoose";
import * as express from 'express'
const app = express()

async function startServer():Promise<void> {
    const connexion = await mongoose.connect(process.env.MONGODB_URI as string,{
        auth:{
            username: process.env.MONGODB_USER as string,
            password: process.env.MONGODB_PASSWORD as string
        },
        authSource: "root"
    });
    console.log(connexion);
}

//startServer()

app.get('/', (req, res) => {
    res.status(200).send('OK on vas a la pèche')
})

app.listen(process.env.PORT, () => {
    console.log('Server up on port ' + process.env.PORT);
})

startServer().catch(function(err):void{
    console.log(err);
});

console.log("everything fine");