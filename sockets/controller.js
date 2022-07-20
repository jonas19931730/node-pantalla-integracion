const socketController = (socket) => {

    socket.on('disconnect',()=>{
        //console.log("cliente desconectado")
    })

    socket.on('confirmar-datos',(payload)=>{
        socket.broadcast.emit('recibir-notificaciones',payload);    
    })
    
    socket.on('id-integracion',(payload)=>{
        socket.broadcast.emit('id-integracion',payload);    
    })
}

module.exports = {
    socketController
}

