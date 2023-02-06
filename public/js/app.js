const nombreSala = document.getElementById('nombre-sala');
const listaUsuarios = document.getElementById('usuarios');
const nickUsuario = document.getElementById('usernameid');

const formularioChat = document.getElementById('formulario-chat');
const mensajeChat = document.querySelector('.mensaje-chat');


const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
  });

outPutUserName(username)


const socket = io();

socket.emit('joinRoom', {username, room})

socket.on('roomUsers', ({room, users}) => {
    outPutRoomName(room);
    outPutUsers(users);
})

socket.on('message', (message) => {
    outputMessage(message);

    mensajeChat.scrollTop = mensajeChat.scrollHeight;
})


formularioChat.addEventListener('submit', e => {
    e.preventDefault();

    const mensaje = e.target.elements.msg.value;
    
    socket.emit('chatMessage', mensaje)

    e.target.elements.msg.value = ''
    e.target.elements.msg.focus()
})

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


function outPutRoomName(room) {
    nombreSala.innerHTML = room;
}

function outPutUsers(users) {
    listaUsuarios.innerHTML = 
    `
    ${users.map(user => `<li>${user.username}</li>`)
    .join('')}
    `
}

function outPutUserName(username) {
    nickUsuario.innerHTML = username;
}