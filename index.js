const express = require('express');
const bodyParser = require('body-parser');
const app = express();
var cors = require('cors')

app.use(cors())
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: '*'
  }
});
const routes = require('./lib/controllers');
const { User } = require('./lib/repository/user.repo');
const { RoomService } = require('./lib/services/room.service');

app.use(bodyParser.json())
app.use(routes)


const botName = "Game"

io.on('connection', (socket) => {
  // console.log(socket.id, socket.rooms);
  console.log("User connected");

  socket.on('joinGame', ({ roomId, user }) => {
    console.log(roomId, user)
    socket.join(roomId)

    socket.emit('message', { userName: botName, message: "Welcome to the Game" })

    socket.broadcast
      .to(roomId)
      .emit(
        'message',
        { userName: botName, message: `${user.userName} has joined the Game` },
      );

    // // get already existing users using http req
    // // use this to get new users
    // io.to(roomId).emit('newUser', {
    //   user: user
    // });
  })

  socket.on('guess', async ({ roomId, userId, userName, guess }) => {

    let guessValidationResult = await RoomService.validateGuess(roomId, userId, guess);
    console.log(guessValidationResult);
    if (guessValidationResult) {
      socket.broadcast.to(roomId).emit('updatePoints', {
        userId: userId, points: guessValidationResult.points, userName: guessValidationResult.userName
      })

      socket.emit('updatePoints', {
        userId: userId, points: guessValidationResult.points, userName: guessValidationResult.userName
      })

    } else {
      socket.broadcast
        .to(roomId)
        .emit(
          'guess',
          { userName: userName, guess: guess }
        );
    }
  })

  socket.on('message', ({ roomId, userName, message }) => {
    socket.broadcast
      .to(roomId)
      .emit(
        'message',
        { userName: userName, message: message }
      );
  })

  socket.on("disconnect", (reason) => {
    console.log("User disconnected", reason)
  });
});

server.listen(3000, () => {
  console.log('listening on :3000');
});