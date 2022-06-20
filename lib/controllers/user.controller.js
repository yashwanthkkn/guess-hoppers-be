const express = require('express');
const router = express.Router();
const {User} = require('../repository/user.repo')

router.get("/:userId",async (req,res)=>{
  try {
    let user = await User.getUserById(req.params)
    res.send({status : 200, user})
  } catch (error) {
    res.send({ status: 400, error })
  }
})

router.post("/", async (req, res) => {
  try {
    let user = await User.addUser(req.body)
    res.send({status : 200, user})
  } catch (error) {
    res.send({status : 400, error})
  }
})

// Update user
router.put("/:userId",async (req,res)=>{
  try {
    req.body.userId = req.params['userId']
    let user = await User.updateUser(req.body)
    res.send({status : 200, user})
     } catch (error) {
    console.log(error);
    res.send({status : 400, error})
  }
})

router.delete("/", async (req,res)=>{
    try {
      let response = await User.removeUserById(req.body)
      res.send({status : 200, response})
    } catch (error) {
      console.log(error)
      res.send({status : 400, error})
    }
})


module.exports = router;