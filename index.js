const express = require('express');
const bodyParser = require('body-parser');
const app = express();
var cors = require('cors')

app.use(cors())
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const routes = require('./lib/controllers')

app.use(bodyParser.json())
app.use(routes)

io.on('connection', (socket) => {
  console.log('a user connected');
});

server.listen(3000, () => {
  console.log('listening on :3000');
});