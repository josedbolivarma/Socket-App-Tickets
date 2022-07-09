// Referencias HTML
const lblEscritorio = document.querySelector('h1');
const btnAtender = document.querySelector('button');
const lblTicket = document.querySelector('small');
const divAlerta = document.querySelector('.alert');
const lblPendientes = document.querySelector('#lblPendientes');

const searchParams = new URLSearchParams( window.location.search );

if ( !searchParams.has('escritorio') ) {
    window.location = 'index.html';
    throw new Error('El escritorio es obligatorio');
}

const escritorio = searchParams.get('escritorio');
lblEscritorio.innerText = escritorio;

divAlerta.style.display = 'none';

const socket = io();

socket.on('connect', () => {
    btnAtender.disabled = false;
});

socket.on('disconnect', () => {
    // console.log('Desconectado del servidor');
    btnAtender.disabled = true;
});

socket.on('ultimo-ticket', ( ultimoTicket ) => {
    // lblNuevoTicket.innerText = 'Ticket ' + ultimoTicket;
})

socket.on('tickets-en-cola', ( ticketsEnCola ) => {
    if ( ticketsEnCola === 0 ) {
        lblPendientes.style.display = 'none';
    } else {
        lblPendientes.style.display = '';
        lblPendientes.innerText = ticketsEnCola;
    }
})

btnAtender.addEventListener( 'click', () => {

    const audio = new Audio('../audio/new-ticket.mp3');
    audio.play();

    socket.emit( 'atender-ticket', { escritorio }, ( { ok, ticket, msg } ) => {
        if ( !ok ) {
            lblTicket.innerText = `Nadie.`;
            return divAlerta.style.display = '';
        }

        lblTicket.innerText = `Ticket ${ ticket.numero }`;
        
    });
    // socket.emit( 'siguiente-ticket', null, ( ticket ) => {
    //     lblNuevoTicket.innerText = ticket;
    // });

});