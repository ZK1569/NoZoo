import { RequestHandler, Request, Response } from "express";
import { ZooModel } from "../models/zoo.model";

export function checkTicket(checkZooAccess: boolean, checkSpaceAccess: boolean): RequestHandler{
    return async function (req:Request, res: Response, next): Promise<void> {
        if(checkZooAccess){
            const zoo = await ZooModel.findOne({
                name: "NoZoo"
            })

            if (!zoo){res.status(500).json({"message": "Internal problem"}); return}

            if (!zoo?.is_open){res.status(401).json({"message": "The zoo is not open"}); return }

        }

        next()
    }
}