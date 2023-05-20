import { Document, Model } from "mongoose"
import { Ticket, TypeTicketModel } from "../../models"

export class TicketService {
    
    static canBeUse = async (ticket:Document<unknown, {}, Ticket> & Omit<Ticket & Required<{_id: string;}>, never>):Promise<boolean> => {
        
        const currentDate = new Date()
        const typeTicket = await TypeTicketModel.findById(ticket.type_ticket)

        switch(typeTicket?.name){
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
                console.log("C'est que un jour par mois, a ne pas supprimer");
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
}
