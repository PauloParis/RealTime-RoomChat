const nombreSala = document.getElementById('nombre-sala');
const listaUsuarios = document.getElementById('usuarios');
const nickUsuario = document.getElementById('usernameid');
const formularioChat = document.getElementById('formulario-chat');
const mensajeChat = document.querySelector('.mensaje-chat');


// --------- Tamaño Pantalla Configuración ---------------

// se calculan los altos
function AltoChat() {
    let altoPantalla =  window.innerHeight; //total
    let altoNavnar = nav.clientHeight; // navbar
    let altoUsuarios  = users.clientHeight; // nombre de la sala y usuarios
    let altoInput  = formularioChat.clientHeight // input & button
    let altoChatMensajes = altoPantalla - altoNavnar - altoUsuarios - altoInput // chat mensajes
    return altoChatMensajes;
}
// dependiendo del tamaño de la pantalla el alto de Chat Mensaje cambia
function altopantalla() {
    let altoChatMensajes = AltoChat();
    if(window.innerWidth < 768) {
        chat.style.setProperty('height', `${altoChatMensajes - 5}px`)
    }
    else {
        chat.style.setProperty('height', '300px')
    }
}
altopantalla() // se llama a la función 
window.onresize = altopantalla; // para cuando hay un cambio en el tamaño



// obtener username y room desde la url
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
  });
outPutUserName(username)

// --------- Socket Configuración ---------------

const socket = io();

// unirse a la sala especifica 
socket.emit('joinRoom', {username, room})

// obtener sala y usuarios para agregarlos a html
socket.on('roomUsers', ({room, users}) => {
    outPutRoomName(room);
    outPutUsers(users);
})

// traer mensajes desde el servidor y agregarlos al html
socket.on('message', (message) => {
    outputMessage(message);
    mensajeChat.scrollTop = mensajeChat.scrollHeight;
})

// mandar mensajes al servidor
formularioChat.addEventListener('submit', e => {
    e.preventDefault();
    const mensaje = e.target.elements.msg.value; // se obtiene el mensaje
    socket.emit('chatMessage', mensaje) // se envia el mensaje al servidor
    e.target.elements.msg.value = '' // limpiar input
    e.target.elements.msg.focus() // limpirar input
})


// --------- FuncioneS ---------------

// se crea la estructura de Chat Mensaje
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('mensaje');
    div.innerHTML = ` <p class="meta">
                          ${message.username} 
                            <span class="time">
                                ${message.time}
                            </span>
                      </p>
                      <p class="text">
                          ${message.text}
                      </p>`;
    document.querySelector('.mensaje-chat').appendChild(div)
  }

// se añade el nombre de la sala al html
function outPutRoomName(room) {
    nombreSala.innerHTML = room;
}

// se añade lista de usuarios conectados al html
function outPutUsers(users) {
    listaUsuarios.innerHTML = 
    `
    ${users.map(user => `<li>${user.username}</li>`)
    .join('')}
    `
}

// se añade el username al html
function outPutUserName(username) {
    nickUsuario.innerHTML = username;
}