const express = require("express")
const {createServer}=require("node:http")
const { join } = require('node:path');
const {Server}= require("socket.io")


const app = express()
const server = createServer(app)
const io= new Server(server)

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
  });
  
  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    socket.on('chat:message', (data) => {
        console.log((data))
        console.log(`This is the message you received: `,data)
        io.emit('chat:message', data); // broadcast to all users


      });
  });
server.listen(3000,()=>{
    console.log('Server running at localhost://3000')
})