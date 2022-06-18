const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const {addUser, removeUserById} = require('./repository/user.repo')

const { createRoom, updateRoom, clearRoom} = require('./repository/room.repo');

app.use(bodyParser.json())

io.on('connection', (socket) => {
  console.log('a user connected');
});

app.post("/user", async (req,res)=>{
  try {
    let user = await addUser(req.body)
    res.send({status : 200, user})
  } catch (error) {
    res.send({status : 400, error})
  }
})

app.delete("/user", async (req,res)=>{
  try {
    let response = await removeUserById(req.body)
    res.send({status : 200, response})
  } catch (error) {
    console.log(error)
    res.send({status : 400, error})
  }
})

app.post("/room", async (req, res) => {
  try {
    let room = await createRoom(req.body);
    res.send({ status: 200, room });
  } catch (error) {
    res.send({ status: 400, error });
  }
});


app.post("/room/:roomId", async (req, res) => {
  try {
    let updateroom = await updateRoom(req.body)
    res.send({ status: 200, updateroom })
  } catch (error) {
    res.send({ status: 400, error })
  }
})

app.delete("/room", async (req, res) => {
  try {
    let room = await clearRoom(req.body);
    res.send({ status: 200, room });
  } catch (error) {
    res.send({ status: 400, error });
  }
});

server.listen(3000, () => {
  console.log('listening on :3000');
});