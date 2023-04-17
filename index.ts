import {config} from "dotenv";
config();
import * as express from 'express'
const app = express()

app.get('/', (req, res) => {
    res.status(200).send('OK on vas a la pèche')
})

app.listen(process.env.PORT, () => {
    console.log('Server up on port ' + process.env.PORT);
})