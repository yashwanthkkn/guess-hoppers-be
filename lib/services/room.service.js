const express = require('express');
const {Room} = require('../repository/room.repo')
const {User} = require('../repository/user.repo')

const createRoom = async (data)=>{
    return new Promise(async(resolve, reject) => {
 
        try{
            let {userName} = data;
            let userData = {
                userName : userName,
                joinNumber : 1,
                roomId: null
            } 
            let host = await User.addUser(userData);
            let room = await Room.createRoom(host.userId);
            host.roomId = room.roomId;
            await User.updateUser(host);
            resolve(room);
        } catch (error) {
            console.log(error);
            reject(error);
          }
    })
}


module.exports.RoomService = {
    createRoom
};