require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT;
const paths = {
    atunera:       '/api/atunera',
    integrador:     '/api/integrador'
}

const server = require('http').createServer(app);
const io = require('socket.io')(server);

const iniciarServer = () =>{
    app.use( cors() );
    app.use( express.json() );
    app.use( express.static('public') );
    app.use( paths.atunera, require('../routes/atunera'));
    app.use( paths.integrador, require('../routes/integrador'));
    app.listen( port, () => {
        console.log('Servidor corriendo en puerto', port );
    });
}

const getSocket = () =>{
    return io;
}

module.exports = {
    iniciarServer,
    getSocket
}

