import express from "express";
import http from 'http'
import { Server } from "socket.io";
import { formatMessage } from "./utils/messages.js";
import { userJoin, getCurrentUser, userLeave, getRoomUsers } from "./utils/users.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server)

app.use(express.static("public"))

const botName = 'Room Chat BOT'


io.on('connection', socket => {
    socket.on('joinRoom', ({username, room}) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room); 
        socket.emit('message', formatMessage(botName, 'Bienvenido(a) a Room Chat'));
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} se ha unido al chat`));

        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })

    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    })

    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if(user) {
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} a dejado el chat`));
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }
    })
})

const PORT =  process.env.PORT || 3000
server.listen(PORT, ()=> console.log("🔥🔥🔥 http://localhost:" + PORT));