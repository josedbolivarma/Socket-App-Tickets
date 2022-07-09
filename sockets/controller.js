const TicketControl = require('../models/ticket-control');

const ticketControl = new TicketControl;

const socketController = (socket) => {

    socket.emit('ultimo-ticket', ticketControl.ultimo );
    
    socket.emit('tickets-en-cola', ticketControl.tickets.length );

    socket.emit('estado-actual', ticketControl.ultimos4 );

    socket.on('siguiente-ticket', ( payload, callback ) => {
        const siguiente = ticketControl.siguiente();
        callback( siguiente );
        socket.broadcast.emit('tickets-en-cola', ticketControl.tickets.length );
    });

    socket.on('atender-ticket', ( { escritorio }, callback ) => {
        
        if ( !escritorio )  {
            return callback({
                ok: false,
                msg: 'El escritorio es obligatorio'
            });
        };
        
        const ticket = ticketControl.atenderTicket( escritorio );

        socket.broadcast.emit('estado-actual', ticketControl.ultimos4 );
        
        socket.emit('tickets-en-cola', ticketControl.tickets.length );
        socket.broadcast.emit('tickets-en-cola', ticketControl.tickets.length );

        if ( !ticket ) {
            callback({
                ok: false,
                msg: 'Ya no hay tickets pendientes'
            });
        } else {
            callback({
                ok: true,
                ticket,
            });
        };

    })


    
}



module.exports = {
    socketController
}

