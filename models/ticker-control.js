const path = require('path');
const fs = require('fs');

class Ticket{
    constructor(numero,escritorio){
        this.numero = numero;
        this.escritorio = escritorio;
    }
}
class TicketControl{
    
    constructor(
    ){
        this.ultimo = 0;
        this.hoy   =  new Date().getDay();
        this.tickets = [];
        this.ultimos4 = [];
        this.init();
    }

    get toJson(){
        return{
            ultimo:this.ultimo,
            hoy:this.hoy,
            tickets:this.tickets,
            ultimos4:this.ultimos4
        }
    }

    get ultimoSocket(){
        return `Ticket - ${this.ultimo} `;
    }

    get encola4(){
        return this.ultimos4;
    }

    init(){
        const { hoy , ultimo , tickets , ultimos4 } = require('../db/data.json');

        if(hoy == this.hoy){
            this.ultimo = ultimo;
            this.tickets = tickets;
            this.ultimos4 = ultimos4;
        }
        else{
            this.guardarDb();
        }

    }
    guardarDb(){
        const pathArchivo = path.join(__dirname,'../db/data.json');
        
        fs.writeFileSync(pathArchivo,JSON.stringify(this.toJson));

    }
    siguiente(){
        this.ultimo +=1;
        this.tickets.push(new Ticket(this.ultimo,null));
        return `Ticket - ${this.ultimo} `
    }
    atender(escritorio){
        if(this.tickets.length === 0){
            return null;
        }
        const ticket = this.tickets.shift();
        
        ticket.escritorio = escritorio;
        
        this.ultimos4.unshift(ticket);

        if(this.ultimos4.length > 4){
            this.ultimos4.splice(-1,1);
        }
        console.log(this.ultimos4);

        this.guardarDb();
        return ticket.numero;
    }
}
module.exports = TicketControl;