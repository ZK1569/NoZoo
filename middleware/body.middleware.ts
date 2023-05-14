import { Request, RequestHandler } from "express";

export function checkBody(params: Record<string, string>): RequestHandler{
    return async (req: Request, res, next) => {
        
        // Check if there is a body
        if(!req.body){
            res.status(400).end()
            return 
        }

        // Check if every element in params is in body 
        for (let param of Object.keys(params)){
            let type = params[param]

            if (!(param in req.body)){
                res.status(400).end()
                return
            }

            // Check the type
            if ( typeof req.body[param] !== type){
                console.log(`${param} not the right type, now it's ${typeof req.body[param]}`);
                
                res.status(400).end()
                return
            }
            
        }
    
        next()

    }
}