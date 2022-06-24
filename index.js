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
const {UserService} = require("./lib/services/user.service");
const {Room} = require("./lib/repository/room.repo");

app.use(bodyParser.json())
app.use(routes)


const botName = "Game"

io.on('connection', (socket) => {
  // console.log(socket.id, socket.rooms);
  console.log("User connected");

  socket.on('joinGame', async ({roomId, user}) => {
    console.log(roomId, user)
    socket.join(roomId)
    await User.updateUser({userId: user.userId, socketId: socket.id})
    socket.emit('message', {userName: botName, message: "Welcome to the Game"})

    socket.broadcast
        .to(roomId)
        .emit(
            'message',
            {userName: botName, message: `${user.userName} has joined the Game`},
        );

    // // get already existing users using http req
    // // use this to get new users
    socket.broadcast.to(roomId).emit('newUser', {
      user: user
    });
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

  socket.on("canvas-data",({roomId,userName, canvas})=>{

    socket.broadcast
        .to(roomId)
        .emit(
            'canvas-data',
            {userName : userName,canvas : canvas}
        );
  })

  socket.on("disconnect", async (reason) => {
    console.log("User disconnected", reason)
    let user = await User.getUserBySocketId(socket.id)
    if(user)
      await User.removeUserById({userId:user.userId})
  });

  socket.on("start",async ({roomId}) => {
    let room = await Room.getRoomById(roomId);
    let user = await User.getUserById({userId :room.hostId });
    console.log("Game Start triggered",user)
    io.to(roomId).emit("start",{user});
  })

  socket.on("restart",async ({roomId, currentUserId}) => {

    let room = await Room.getRoomById(roomId);
    let currentUser = await User.getUserById({userId :currentUserId });
    let users = await User.getUsersByRoom(roomId);
    let nextUser = null;
  
    let nextUserIdx = -1
    for(let i = 0 ; i < users.length ; i++){
      if(users[i].joinNumber > currentUser.joinNumber  ){
        if(nextUserIdx == -1 || users[i].joinNumber < users[nextUserIdx].joinNumber){
          nextUserIdx = i
        }
      }
    }
    if(nextUserIdx === -1){
      nextUser = await User.getUserById({userId :room.hostId});
    }else{
      nextUser = users[nextUserIdx];
    }
    if(room.word){
      socket.broadcast
        .to(roomId)
        .emit(
          'message',
          { userName: "Game", message: `Correct answer is ${room.word}` }
        );
    }
    let updatedRoom = await Room.updateRoom({roomId:roomId,word:"",currPlayerUserId:nextUser.userId});
    console.log("Game restart triggered")
    console.log(nextUser)
    io.to(roomId).emit("restart", {user:nextUser});

  })

  socket.on("started-drawing",({roomId,userName})=>{
    socket.broadcast
        .to(roomId)
        .emit(
            'message',
            {userName: "Game", message: userName+" has started drawing..."}
        );
    io.to(roomId)
        .emit(
            'start-timer',);
  })


});

server.listen(3000, () => {
  console.log('listening on :3000');
});