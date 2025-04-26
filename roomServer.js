const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'roomClient.html'));
});

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // STEP 1: Socket joins 'some room'
    socket.join('some room');
    console.log(`${socket.id} joined 'some room'`);

    // STEP 2: Broadcast only to people inside 'some room'
    io.to('some room').emit('message', `User ${socket.id} says hello to room!`);

    // STEP 3: Broadcast to everyone EXCEPT people in 'some room'
    io.except('some room').emit('message', `User ${socket.id} says hello to others (not in room)!`);

    // Optional: After 5 seconds, leave the room
    setTimeout(() => {
        socket.leave('some room');
        console.log(`${socket.id} left 'some room'`);
    }, 5000);



    socket.on('private-message', ({ recipientId, message }) => {
        // Send to only that particular socket

        console.log(`The user ${recipientId} has sent the message ${message}`)
        io.to(recipientId).emit('private-message', {
            from: socket.id,
            message,
        });
    });



    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

server.listen(3000, () => {
    console.log('Server listening on http://localhost:3000');
});
