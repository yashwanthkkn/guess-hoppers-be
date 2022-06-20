const express = require('express');
const router = express.Router();
const {Room} = require('../repository/room.repo')
const {User} = require('../repository/user.repo')

router.post("/", async (req, res) => {
    try {
      let room = await Room.createRoom(req.body);
      res.send({ status: 200, room });
    } catch (error) {
      res.send({ status: 400, error });
    }
});

router.put("/:roomId", async (req, res) => {
    try {
      let updateroom = await Room.updateRoom(req.body)
      res.send({ status: 200, updateroom })
    } catch (error) {
      res.send({ status: 400, error })
    }
})

router.delete("/", async (req, res) => {
    try {
      let room = await Room.clearRoom(req.body);
      res.send({ status: 200, room });
    } catch (error) {
      res.send({ status: 400, error });
    }
});

router.get("/users/:roomId", async (req,res)=>{
    try {
      let users = await User.getUsersByRoom(req.params['roomId'])
      res.send({status : 200, users})
    } catch (error) {
      console.log(error);
      res.send({status : 400, error})
    }
})

router.delete("/users/:roomId", async (req,res)=>{
  try {
    let response = await User.deleteUsersByRoom(req.params['roomId'])
    res.send({status : 200, response})
  } catch (error) {
    console.log(error);
    res.send({status : 400, error})
  }
})

module.exports = router;