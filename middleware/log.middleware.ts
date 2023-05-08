import {RequestHandler} from 'express'

export const log = (): RequestHandler => {
    return (req, res, next) => {
        console.log(`${req.method} ${req.path}`);
        next()
    }
}