import { RequestHandler, Request, Response } from "express";
import { Role } from "../models";

export function checkUserRole(name: string ): RequestHandler{
    return async function (req:Request, res: Response, next): Promise<void> {
        if (!req.user){
            res.status(401).end()
            return 
        }

        const user = req.user

        const hasRole = user.roles
        for (let role of user.roles){

            if(typeof role === 'object' && role.name === name){
                next()
                return
            }
        }
        res.status(403).end()
    }
}