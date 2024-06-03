import express from 'express';
import path from 'path';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { Socket } from 'dgram';
const PORT = 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());

// cors is used to allow requests from other domains
app.use(cors());

// serve the frontend files
// app.use(express.static(path.join(__dirname, '../frontend')));

// this route is used to get the socket url
app.get('/api/socket-info', (req, res) => {
    res.json({ socketUrl: `http://localhost:${PORT}` });
});

// this is a catch all route, if no other routes are matched, this route will be used
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

// create a http server
const httpServer = createServer(app);
// create a socket server using the http server
const io = new Server(httpServer, {
    // cors options
    cors: {
        origin: "https://chat-application-psi-dusky.vercel.app",
        methods: ["GET", "POST"]
    }
});

// this event is fired when a user connects to the socket server
io.on('connection', (socket) => {
    console.log('a user connected');

    // socket.id = uuidv4(); // generate a unique id for the socket

    socket.emit('your id', socket.id); // send the unique id to the user

    // socket.join(room); // join the room
    // socket.emit('your rooms', socket.rooms); // send the rooms the user is in to the user

    // join a room
    // socket.join('room name');
    
    // set the username of the user
    socket.on('set username', (name) => {
        socket.username = name;
        console.log(`User set their name to: ${socket.username} id: ${socket.id}`);
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
        // console.log(`${socket.username} joined room: ${socket.rooms[0]}`);
        // socket.to(room).emit('room message', { id: socket.id, user: socket.username, text: 'joined the room' });
    });

    socket.on('get rooms', () => {
        const rooms = Array.from(socket.rooms);
        console.log(`Rooms for socket ${socket.id}: ${rooms}`);
        socket.emit('get rooms', rooms);
    });

    // this event is fired when a user sends a message in a room
    socket.on('room message', (room, msg) => {
        if (socket.rooms.has(room)) {
            const rooms = Array.from(socket.rooms);
            io.emit('room message', { id: socket.id, user: socket.username, room: rooms[0], text: msg });
            console.log(rooms);
            console.log(`${socket.username} sent message to room ${room}: ${msg}`);
        }
    });

    // this event is fired when a user leaves a room
    // socket.on('leave room', (room) => {
    //     socket.leave(room);
    //     console.log(`${socket.username} left room: ${room}`);
    // });

    // this event is fired when a user disconnects
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

httpServer.listen(PORT, () => {
    console.log(`listening on PORT:${PORT}`);
});