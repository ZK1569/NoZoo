import { Document, Model } from "mongoose"
import { Ticket } from "../../models"

export class TicketService {
    
    static canBeUse = async (ticket:Document<unknown, {}, Ticket> & Omit<Ticket & Required<{_id: string;}>, never>):Promise<boolean> => {
        
        const currentDate = new Date()
        const typeTicket = ticket.type_ticket.name

        console.log(typeTicket);

        // TODO: Make a switch to do the verification on a case by case basis depending on the type of ticket
        
    
        return false
    }
}
