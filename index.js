const http = require('http');
const express = require('express');
const cors = require('cors');
const socketIO = require('socket.io');

const app = express();
const port = 4000 ;

app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello Its Working')
})

const server = http.createServer(app);

const users = [{}];

const io = socketIO(server);

io.on("connection", (socket)=> {
    console.log("New Connection")

    socket.on('joined', ({user})=>{
        users[socket.id]= user;
        socket.broadcast.emit('userJoined', {user:"Admin", message: `${users[socket.id]} has Joined`})
        socket.emit("welcome", {user:'Admin', message: ` Welcome to the chatroom ${users[socket.id]}`})
    })

    socket.on("message", ({message, id})=> {
        io.emit("sendMessage", {user: users[id],message, id})
    })
    

    socket.on('disconnect', ()=>{
        socket.broadcast.emit("leave", {user: "Admin", message:`${users[socket.id]} has left`})
        
    })    
    
    
})

server.listen(port, ()=> {
    console.log(`server is working on port http://localhost:${port}`)
})
