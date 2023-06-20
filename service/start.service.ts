import { Document, Types } from "mongoose"
import { Role, RoleModel, TypeTicketModel, UserModel } from "../models"
import { Employee_postModel } from "../models/administration/employee_post.model"
import { ZooModel } from "../models/zoo.model"
import { SecurityUtils } from "../utils"

export class StartService{
    static userRoles = async () => {
        const countRoles = await RoleModel.count().exec()
        if(countRoles !== 0 ){
            return 
        }
    
        const rolesNames: string[] = ["admin", "guest", "receptionist", "veterinarian", "maintenance agent", "seller"]
        const rolesRequest = rolesNames.map((name) => {
            RoleModel.create({
                name
            })
        })
        await Promise.all(rolesRequest)
    }

    static typeTickets = async () => {
        const countTicket = await TypeTicketModel.count().exec()
        if(countTicket !== 0 ){
            return 
        }
    
    
        const ticketNames: string[] = ["day", "weekEnd", "oneDayMonth", "escapeGame", "night", "annual"]
        const tocketRequest = ticketNames.map((type) => {
            TypeTicketModel.create({
                name: type
            })
        })
        await Promise.all(tocketRequest)
    }

    static zooCreation = async () => {
        const doesZooExist = await ZooModel.count().exec()
        if(doesZooExist !== 0 ){
            return 
        }
    
        const employee_post = await Employee_postModel.create({
            receptionist: [],
            veterinarian: [],
            maintenance_agent: [],
            salesman: [] 
        })
    
        const zoo = await ZooModel.create({
            name: "NoZoo",
            spaces: [],
            is_open: false,
            employee_post,
            totalVisitors: 0,
            visitorsLive: 0
        })
    
    }

    static createUsers = async ():Promise<void> => {
        const countUsers = await UserModel.count().exec()
        if(countUsers !== 0 ){
            return 
        }
    
        const roles = await RoleModel.find().exec()
        
        const usersNames: string[] = ["admin@mail.com", "guest@mail.com"]
    
        const usersRequest = usersNames.map((login) => {
            let userRoles:(Document<unknown, {}, Role> & Omit<Role & {_id: Types.ObjectId;}, never>)[] = []
            if (login.includes("admin")){
                userRoles = roles.map((role) => {if(role.name === "admin"){return role} else {return null}}).filter((role) => {if(role){return role} else {return null}}) as (Document<unknown, {}, Role> & Omit<Role & {_id: Types.ObjectId;}, never>)[]
            }else{
                userRoles = roles.map((role) => {if(role.name === "guest"){return role} else {return null}}).filter((role) => {if(role){return role} else {return null}}) as (Document<unknown, {}, Role> & Omit<Role & {_id: Types.ObjectId;}, never>)[]
            }
            UserModel.create({
                login,
                password: SecurityUtils.toSHA512("password"),
                roles: userRoles
            })
        })
        await Promise.all(usersRequest)
    } 
}