const express=require('express')
const path=require('path')
const socketio = require('socket.io')
const http =require('http')


const app= express();
const server = http.createServer(app);
const io = socketio(server)

let usersockets = {}

app.use('/', express.static(path.join(__dirname,'frontend')))

io.on('connection',(socket)=>{
    console.log("New socket formed from " + socket.id)
    socket.emit('connected')

    socket.on('login', (data) => {
        //username is on data.user
        usersockets[data.user]=socket.id
        console.log(usersockets)
    })


    socket.on('send_msg',(data)=>{
        //if we use io.emit everyone gets it
        //if we use socket.broadcast.emit only others get it 
       
        if(data.message.startsWith('@')){
            //data.message = "@a:hello"
            let recipient = data.message.split(':')[0].substr(1);
            let recptSocket = usersockets[recipient];
            io.to(recptSocket).emit('recv_msg',data)
        }
        else{
            socket.broadcast.emit('recv_msg',data)
        }
       
       
       // io.emit('recv_msg', data)
     //socket.broadcast.emit('recv_msg', data)

    })
})

server.listen(2345,() =>
 console.log("server is runnning")
)