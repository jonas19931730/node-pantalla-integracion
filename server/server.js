require('dotenv').config();
const express = require('express');
const cors = require('cors');
const socketController = require('../sockets/controller')
class Server {

    constructor() {
        this.app  = express();
        this.port = process.env.PORT;
        this.paths = {
            atunera:       '/api/atunera',
            integrador:     '/api/integrador'
        }
        this.server = require('http').createServer(this.app);
        this.io = require('socket.io')(this.server, {
            cors: {origin : '*'}
        });

        this.middlewares();
        //this.routes();
        this.sockets();
    }
    middlewares() {

        // CORS
        this.app.use( cors() );

        // Lectura y parseo del body
        this.app.use( express.json() );

        // Directorio Público
        //this.app.use( express.static('public') );

    }

    routes() {
        this.app.use( this.paths.atunera, require('../routes/atunera'));
        this.app.use( this.paths.integrador, require('../routes/integrador'));
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en puerto', this.port );
        });
    }
    sockets(){
        this.io.on('connection',socketController);
    }

}
module.exports = Server;
