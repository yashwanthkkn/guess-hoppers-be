const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server,{
  cors : {
    origin : '*'
  }
});
const routes = require('./lib/controllers');
const { User } = require('./lib/repository/user.repo');

app.use(bodyParser.json())
app.use(routes)

const formatMessage = (username, message)=>{
  return {username, message}
}

const botName = "GameBot"

io.on('connection', (socket) => {
  // console.log(socket.id, socket.rooms);
  console.log("User connected");

  socket.on('joinGame', ({roomId,user}) => {
    
    socket.join(roomId) 

    socket.emit('message', formatMessage(botName,"Welcome to the Game"))

    socket.broadcast
      .to(roomId)
      .emit(
        'message',
        formatMessage(botName, `${user.username} has joined the Game`)
      );

    // get already existing users using http req
    // use this to get new users
    io.to(roomId).emit('newUser', {
      user: user
    });
  })

  socket.on('guess', ({roomId, userId, guess}) => {
    // Todo
  })

  socket.on('message', ({roomId,userName, message}) => {
    socket.broadcast
      .to(roomId)
      .emit(
        'message',
        formatMessage(userName, message)
      );
  })

  socket.on("disconnect", (reason) => {
    console.log("User disconnected", reason)
  });
});

server.listen(3000, () => {
  console.log('listening on :3000');
});