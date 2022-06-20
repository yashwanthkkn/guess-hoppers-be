const {User} = require('../repository/user.repo')
const {Room} = require('../repository/room.repo')

const joinUser = async (data)=>{
    return new Promise((resolve, reject) => {
 
        try{

            let {userName, roomId} = data;
            Room.getRoomById(roomId).then((room)=> {
                console.log("Room: ");
                console.log(room);
                let updatedRecentJoinNumber = parseInt(room['recentJoinNumber']+1);

                let userData = {
                    userName : userName,
                    joinNumber : updatedRecentJoinNumber,
                    roomId: roomId
                } 

                User.addUser(userData).then((user)=> {
                    room.recentJoinNumber = updatedRecentJoinNumber;
                    Room.updateRoom(room).then((room) =>
                    {    
                        resolve(user);             
                    }
                );
                })
            })   
           
        } catch (error) {
            console.log(error);
            reject(error);
          }
    })
}


module.exports.UserService = {
    joinUser
};