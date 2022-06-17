const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const {User} = require('./repository/user.repo')

app.use(bodyParser.json())

io.on('connection', (socket) => {
  console.log('a user connected');
});

app.post("/user", async (req,res)=>{
  try {
    let user = await User.addUser(req.body)
    res.send({status : 200, user})
  } catch (error) {
    res.send({status : 400, error})
  }
})

app.get("/user/:userId",async (req,res)=>{
  try {
    let user = await User.getUserById(req.params)
    res.send({status : 200, user})
  } catch (error) {
    res.send({status : 400, error})
  }
})

app.post("/user/:userId",async (req,res)=>{
  try {
    let user = await User.updateUser(req.body)
    res.send({status : 200, user})
  } catch (error) {
    res.send({status : 400, error})
  }
})

server.listen(3000, () => {
  console.log('listening on :3000');
});