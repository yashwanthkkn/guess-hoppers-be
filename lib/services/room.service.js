const express = require('express');
const { Room } = require('../repository/room.repo')
const { User } = require('../repository/user.repo')

const createRoom = async (data) => {
    return new Promise(async (resolve, reject) => {

        try {
            let { userName } = data;
            let userData = {
                userName: userName,
                joinNumber: 1,
                roomId: null
            }
            let host = await User.addUser(userData);
            let room = await Room.createRoom(host.userId);
            host.roomId = room.roomId;
            await User.updateUser(host);
            resolve({ room: room, user: host });
        } catch (error) {
            console.log(error);
            reject(error);
        }
    })
}

const validateGuess = async (roomId, userId, guess) => {
    return new Promise(async (resolve, reject) => {
        try {

            let room = await Room.getRoomById(roomId);
            console.log(room.roomId);
            if (room.word.toUpperCase() === guess.toUpperCase()) {
                console.log("Guess is correct");
                console.log(userId);
                let user = await User.getUserById({ userId: userId });
                console.log(user)
                user.points = user.points + 1;
                await User.updateUser(user);
                console.log("updated");
                resolve(user);
            }
            else {
                console.log("Guess is wrong");
                resolve(null);
            }

        } catch (error) {
            console.log(error);
            reject(error);
        }
    })
}

module.exports.RoomService = {
    createRoom,
    validateGuess
};