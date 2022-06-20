const express = require('express');
const {Room} = require('../repository/room.repo')
const {User} = require('../repository/user.repo')

const createRoom = async (data)=>{
    return new Promise((resolve, reject) => {
 
        try{
            let {userName} = data;
            let userData = {
                userName : userName,
                joinNumber : 1,
                roomId: null
            } 
            User.addUser(userData).then((host)=> {
                Room.createRoom(host.userId).then((room) =>
                {
                    host.roomId = room.roomId;
                    User.updateUser(host).then(() => {
                        resolve(room);
                    })               
                }
            );
            })
        } catch (error) {
            console.log(error);
            reject(error);
          }
    })
}


module.exports.RoomService = {
    createRoom
};