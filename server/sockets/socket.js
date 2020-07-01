const { io } = require('../server');
const { TicketControl } = require('../classes/ticket-control');

const ticketControl = new TicketControl();

io.on('connection', (client) => {

    console.log('Usuario conectado');

    client.on('disconnect', () => {
        console.log('Usuario desconectado');
    });

    client.on('siguienteTicket', (data, callback) => {

        let mensaje = ticketControl.siguiente();
        //console.log(mensaje);

        callback(mensaje);
    });

    client.emit('estadoActual', {
        actual: ticketControl.getUltimoTicket(),
        ultimos4: ticketControl.getUltimos4()
    });

    client.on('atenderTicket', (data, callback) => {

        if (!data.escritorio) {
            return callback({
                err: true,
                mensaje: 'El escritorio es necesario'
            });
        }

        let atenterTicket = ticketControl.atenderTicket(data.escritorio);

        callback(atenterTicket);

        client.broadcast.emit('ultimos4', {
            //actual: ticketControl.getUltimoTicket(),
            ultimos4: ticketControl.getUltimos4()
        });

    })
});