import * as express from 'express'
const app = express()

app.get('/', (req, res) => {
    res.status(200).send('OK sever up alors')
})

app.listen(process.env.PORT, () => {
    console.log('Server up on port ' + process.env.PORT);
})