import { Document, Model } from "mongoose"
import { Space, SpaceModel, Ticket, TypeTicketModel } from "../../models"

export class TicketService {
    
    static canBeUse = async (ticket:Document<unknown, {}, Ticket> & Omit<Ticket & Required<{_id: string;}>, never>):Promise<boolean> => {
        
        const currentDate = new Date()
        const typeTicket = await TypeTicketModel.findById(ticket.type_ticket)
        if(!typeTicket){return false}

        switch(typeTicket.name){
            case "weekEnd":
                // If the ticket is scanned during the weekend
                if (!(6 <= currentDate.getDay() && currentDate.getDay() <= 7)){
                    return false
                }
                
                // No return true to check that the user scan his ticket in the day too

            case "escapeGame":
            case "day": 

                // If the ticket is scanned during the day
                if(8 < currentDate.getHours() && currentDate.getHours() < 20){
                    return true
                }
                
                return false
            
            case "oneDayMonth":

                if(!ticket.last_activation_date || ticket.last_activation_date.getMonth() != currentDate.getMonth()){
                    if(8 < currentDate.getHours() && currentDate.getHours() < 20){
                        ticket.last_activation_date = currentDate
                        // ticket.save()
                        return true
                    }
                }
                
                return false
                
            case "night":
                // If the ticket is not scanned during the day
                if(!(8 < currentDate.getHours() && currentDate.getHours() < 20)){
                    return true
                }
                
                return false
                
            default:
                console.log("ERROR: There was a problem with the verification of the tickets");
                
                return false
                 
        }

    }

    static canAccessSpace = async (ticket: Document<unknown, {}, Ticket> & Omit<Ticket & Required<{_id: string;}>, never>, space_id: string): Promise<boolean> => {

        // Functionality of the escapeGame type :
        //      Tickets of type escapeGame can only access the space that is in the last index of the list (accessible_spaces), 
        //      this list is used as a stack and once access is given, the last element is deleted

        // For typeTicket escapeGame 
        const typeTicket = await TypeTicketModel.findById(ticket.type_ticket._id)
        if(typeTicket){
            
            if(typeTicket.name === "escapeGame"){
                const space = ticket.accessible_spaces.at(-1)
                
                const spaceInfo = await SpaceModel.findById(space).exec()
                
                if(spaceInfo && spaceInfo._id == space_id){
                    ticket.accessible_spaces.pop()
                    ticket.save()
                    return true
                    
                }
                return false
            }
        }
        

        // For all others types
        for (let space of ticket.accessible_spaces){
            if (space._id == space_id){
                const spaceInfo = await SpaceModel.findById(space_id).exec()

                if (!spaceInfo || !spaceInfo.open || spaceInfo.maintenance){
                    return false
                }

                return true 
            }
        }

        return false
    }
}
