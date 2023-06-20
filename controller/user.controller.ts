import { Model } from "mongoose"
import { Role, RoleModel, SessionModel, User, UserModel } from "../models"
import { Router, Response, Request} from "express"
import * as express from 'express'
import { SecurityUtils } from "../utils"
import { checkBody, checkUserRole, checkUserToken } from "../middleware"
import { RolesEnums } from "../enums"


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

    readonly paramsGiveRole = {
        "user_id" : "string",
        "role" : "string"
    }

    addRole = async (req:Request, res:Response): Promise<void> => {

        if(!req.user){res.status(500).end(); return}

        // Check that we don't assign roles to ourselves 
        if ( req.body.user_id === String(req.user._id)){
            res.status(409).json({"message" : "You can't assign roles to yourself"})
            return
        }

        try{
            const role = await RoleModel.findById(req.body.role)
            const user = await UserModel.findById(req.body.user_id)
            if(!role || !user){res.status(404).json({"message" : "Role or User not found"}); return}
            if(!user.roles.some(userRole => String(role._id) === String(userRole._id))){
                user.roles.push(role)
                user.save()
                res.status(200).json({"message" : "Role assign"})
                return 
            }
        
            res.status(409).json({"message" : "The user already has the role"})
            return

        }catch(err){
            res.status(400).json({"message" : "One of the ID is incorrect"})
            return
        }
    }

    readonly paramsSubscribe = {
        "login" : "string",
        "password" : "string"
    }

    subscribe = async (req: Request, res: Response):Promise<void> => {
        
        if (req.body.login.length < 4 || req.body.password.length < 8){
            res.status(400).json({"message" : "Login or password too short"})
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
                res.status(409).json({"message" : "Login already taken"})
            }else{
                res.status(500).end()
            }
        }

    }

    readonly paramsLogin = {
        "login" : "string",
        "password" : "string"
    }

    login = async (req: Request, res: Response): Promise<void> => {
        let user 
        try{
            user = await UserModel.findOne({
                login: req.body.login,
                password: SecurityUtils.toSHA512(req.body.password)
            })
        }catch(err){
            res.status(404).json({"message": "User not found"})
            return
        }
        if (!user){
            res.status(500).end()
            return
        }
        
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

    logout = async (req:Request, res:Response): Promise<void> => {
        const session = req.session

        if (!session){
            res.status(404).json({"message": "This session does not exist"});
            return;
        }

        await SessionModel.deleteOne({_id: session})

        res.status(200).end()
    }

    me = async (req:Request, res: Response) => {
        res.json(req.user)
    }

    getRoles = async (req: Request, res: Response): Promise<void> => {

        const roles = await RoleModel.find()

        res.send(roles)
    }

    buildRouter = (): Router => {
        const router = express.Router()
        router.post(`/subscribe`, express.json(),checkBody(this.paramsSubscribe), this.subscribe.bind(this))
        router.post('/login', express.json(),checkBody(this.paramsLogin), this.login.bind(this))
        router.patch('/role', express.json(), checkUserToken(), checkUserRole(RolesEnums.admin), checkBody(this.paramsGiveRole), this.addRole.bind(this))
        router.delete('/logout', checkUserToken(), this.logout.bind(this))
        router.get('/me', checkUserToken(), this.me.bind(this))
        router.get('/role', checkUserToken(), checkUserRole(RolesEnums.admin), this.getRoles.bind(this)) // Return the list of all possible roles 

        return router
    }
}