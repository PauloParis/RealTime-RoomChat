const nombreSala = document.getElementById('nombre-sala');
const listaUsuarios = document.getElementById('usuarios');
const nombreSala2 = document.getElementById('nombre-sala2');
const listaUsuarios2 = document.getElementById('usuarios2');

const nickUsuario = document.getElementById('usernameid');
const formularioChat = document.getElementById('formulario-chat');
const mensajeChat = document.querySelector('.mensaje-chat');

const sidebarLabel = document.getElementById('sidebarLabel');


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
    div.classList.add('mensaje', 'mx-3', 'py-1');
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
    nombreSala2.innerHTML = room;
}

// se añade lista de usuarios conectados al html
function outPutUsers(users) {
    listaUsuarios.innerHTML = 
    `
    ${users.map(user => `<li class="m-3">${user.username}</li>`)
    .join('')}
    `
    listaUsuarios2.innerHTML = 
    `
    ${users.map(user => `<li class="m-3">${user.username}</li>`)
    .join('')}
    `
}

// se añade el username al html
function outPutUserName(username) {
    nickUsuario.innerHTML = username;
    sidebarLabel.innerHTML = username;
}