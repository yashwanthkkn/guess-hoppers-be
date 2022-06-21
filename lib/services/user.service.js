const { User } = require('../repository/user.repo')
const { Room } = require('../repository/room.repo')

const joinUser = async (data) => {
    return new Promise(async (resolve, reject) => {

        try {

            let { userName, roomId } = data;
            let room = await Room.getRoomById(roomId);
            let updatedRecentJoinNumber = parseInt(room['recentJoinNumber'] + 1);
            let userData = {
                userName: userName,
                joinNumber: updatedRecentJoinNumber,
                roomId: roomId
            }

            let user = await User.addUser(userData);
            room.recentJoinNumber = updatedRecentJoinNumber;
            await Room.updateRoom(room)
            resolve(user);


        } catch (error) {
            console.log(error);
            reject(error);
        }
    })
}


module.exports.UserService = {
    joinUser
};