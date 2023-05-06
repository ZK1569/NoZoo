import { Model } from "mongoose"
import { Role, RoleModel, SessionModel, User, UserModel } from "../models"
import { Router, Response, Request} from "express"
import * as express from 'express'
import { SecurityUtils } from "../utils"
import { checkUserToken } from "../middleware"


export class UserController {

    readonly path: string
    readonly model: Model<User>
    guestRole: Role | null

    constructor(){
        this.path = "/auth"
        this.model = UserModel
        this.guestRole = null
    }

    private loadGuestRole = async ():Promise<void> => {
        if (this.guestRole) {
            return
        }
        this.guestRole = await RoleModel.findOne({
            name: "guest"
        }).exec()
    }

    subscribe = async (req: Request, res: Response):Promise<void> => {
        
        if(!req.body){
            res.status(400).end()
            return 
        }
        
        if (typeof req.body.login !== "string" || req.body.login.length < 4){
            res.status(400).end()
            return
        }
        
        if (typeof req.body.password !== "string" || req.body.password.length < 8){
            res.status(400).end()
            return
        }

        const login: string = req.body.login
        const password: string  = req.body.password

        try{
            await this.loadGuestRole()
            const user = await UserModel.create({
                login,
                password: SecurityUtils.toSHA512(password),
                roles:[this.guestRole]
            })
            res.json(user)

        }catch(err: unknown){
            const me = err as {[key: string]: unknown}
            if (me['name'] === "MongoServerError" && me['code'] === 11000){
                res.status(409).end()
            }else{
                res.status(500).end()
            }
        }

    }

    login = async (req: Request, res: Response): Promise<void> => {
        if (!req.body || typeof req.body.login !== "string" || typeof req.body.password !== 'string'){
            res.status(400).end()
            return 
        }

        const user = await UserModel.findOne({
            login: req.body.login,
            password: SecurityUtils.toSHA512(req.body.password)
        })
        
        // Platform
        const platform = req.headers['user-agent']

        // Token
        const session = await SessionModel.create({
            user: user,
            platform: platform
        })

        res.json({
            token: session._id
        });
    }

    me = async (req:Request, res: Response) => {
        res.json(req.user)
    }

    buildRouter = (): Router => {
        const router = express.Router()
        router.post(`/subscribe`, express.json(), this.subscribe.bind(this))
        router.post('/login', express.json(), this.login.bind(this))
        router.get('/me', checkUserToken(), this.me.bind(this))

        return router
    }
}