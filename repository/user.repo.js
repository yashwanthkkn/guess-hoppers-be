const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
AWS.config.loadFromPath('./config.json');


const client = new AWS.DynamoDB.DocumentClient();
const tableName = 'gh-user';

const addUser = async (data) => {
    return new Promise((resolve, reject) => {
        
        let {userName} = data;
        let {roomId} = data;
        
        let user = {
            userName : userName,
            userId : uuidv4(),
            joinNumber : 0,
            roomId: roomId
        }    

        let params = {
            TableName: tableName,
            Item: user
        };

        client.put(params, (err) => {
            if (err) {
                console.error("Unable to add item.");
                console.error("Error JSON:", JSON.stringify(err, null, 2));
                reject(err)
            } else {
                console.log("Added item:", JSON.stringify(user, null, 2));
                resolve(user)
            }
        });
    })

}

// Get all users of a Room
const getUsersByRoom = async (roomId)=>{
    return new Promise((resolve, reject) => {
 
        let roomIdValue = parseInt(roomId)
        let params = {
            TableName: tableName,
            FilterExpression: "roomId = :roomId",
            ExpressionAttributeValues: {
            ":roomId": roomIdValue
             }
        }
        
        client.scan(params).promise()
        .then(users => {
            resolve(users["Items"])
        })
        .catch(reject(err))
    })

}

// Delete all users of a Room
const deleteUsersByRoom = async (roomId)=>{
    return new Promise((resolve, reject) => {
 
        try{
            let users = getUsersByRoom(roomId)
            users.forEach((user) => {
                removeUserById(user.userId)
            });
            resolve('deleted');

        } catch (error) {
            console.log(error);
            reject(error);
          }
    })
}

module.exports = {
    addUser,
    getUsersByRoom,
    deleteUsersByRoom
}