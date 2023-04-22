import {config} from "dotenv";
config();
import * as mongoDB from "mongodb";
import * as express from 'express'
const app = express()

async function connectToDatabase () { 
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.MONGODB_URI as string);
            
    await client.connect();
    console.log(`Successfully connected to database: ${process.env.MONGODB_URI}`);
}

//startServer()

app.get('/', (req, res) => {
    res.status(200).send('OK on vas a la pèche')
})

app.listen(process.env.PORT, () => {
    console.log('Server up on port ' + process.env.PORT);
})

connectToDatabase().catch(function(err):void{
    console.log(err);
});

console.log("everything fine");
console.log(process.env.MONGODB_URI);