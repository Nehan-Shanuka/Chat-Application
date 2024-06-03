import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
const PORT = 5000;

const app = express();

app.use(express.json());

// cors is used to allow requests from other domains
app.use(cors());

// create a http server
const httpServer = createServer(app);

// create a socket server using the http server
const io = new Server(httpServer, {
    // cors options
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// this event is fired when a user connects to the socket server
io.on('connection', (socket) => {
    socket.emit('your id', socket.id); // send the unique id to the user
    
    // set the username of the user
    socket.on('set username', (name) => {
        socket.username = name;
    });

    // this event is fired when a user sends a message
    socket.on('chat message', (msg) => {
        if (socket.username) {
            io.emit('chat message', { id: socket.id, user: socket.username, text: msg });
        }
    });

    // this event is fired when a user joins a room
    socket.on('join room', (room) => {
        socket.join(room);
    });

    socket.on('get rooms', () => {
        const rooms = Array.from(socket.rooms);
    });

    // this event is fired when a user sends a message in a room
    socket.on('room message', (room, msg) => {
        if (socket.rooms.has(room)) {
            const rooms = Array.from(socket.rooms);
            io.emit('room message', { id: socket.id, user: socket.username, room: rooms[1], text: msg });
        }
    });
});

httpServer.listen(PORT);