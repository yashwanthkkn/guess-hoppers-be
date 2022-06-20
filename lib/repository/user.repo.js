const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
AWS.config.loadFromPath('./config.json');


const client = new AWS.DynamoDB.DocumentClient();
const tableName = 'gh-user';

// add new user to db
const addUser = async (data) => {
    return new Promise((resolve, reject) => {
        
        let {userName, roomId} = data;
        
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

// remove user from dynamodb
const removeUserById = async (data)=>{
    return new Promise((resolve, reject) => {
        
        let {userId} = data;
      
        var params = {
            TableName: tableName,
            Key: {
                userId : userId
            }
        };

        client.delete(params, function(err, data) {
            if (err){
                console.error("Unable to get item.");
                console.error("Error JSON:", JSON.stringify(err, null, 2));
                reject(err);
            } 
            else{
                console.log("Got item:", JSON.stringify(data, null, 2));
                resolve(data);
            } 
        });
    })
}


// Fetch  a user by Id
const getUserById = async (data) => {
    return new Promise((resolve, reject)=>{

        let {userId} = data

        var params = {
            TableName : tableName,
            Key: {
              userId : userId
            }
        };
        
        client.get(params, function(err, data) {
            if (err){
                console.error("Unable to get item.");
                console.error("Error JSON:", JSON.stringify(err, null, 2));
                reject(err);
            } 
            else{
                console.log("Got item:", JSON.stringify(data, null, 2));
                resolve(data["Item"]);
            } 
        });
    })
}


// Update a user in DB
const updateUser = async (data) => {
    
    return new Promise((resolve, reject) => { 
        
        let {userId} = data 
        let updateExpression='set';
        let ExpressionAttributeNames={};
        let ExpressionAttributeValues = {};
        
        for(const property in data){
            if(property == 'userId')
                continue
            updateExpression += ` #${property} = :${property} ,`;
            ExpressionAttributeNames['#'+property] = property ;
            ExpressionAttributeValues[':'+property]= data[property];
        }
        
        updateExpression= updateExpression.slice(0, -1);
       
        var params = {
            TableName : tableName,
            Key : {
                userId : userId
            },
            UpdateExpression: updateExpression,
            ExpressionAttributeNames: ExpressionAttributeNames,
            ExpressionAttributeValues: ExpressionAttributeValues,
        }
        client.update(params, function(err) {
            if (err){
                console.error("Unable to update item.");
                console.error("Error JSON:", JSON.stringify(err, null, 2));
                reject(err)
            } 
            else{
                console.log("Updated item:", JSON.stringify(data, null, 2));
                resolve(data)
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
        .catch(err => reject(err))
    })

}

// Delete all users of a Room
const deleteUsersByRoom = async (roomId)=>{
    return new Promise(async(resolve, reject) => {
 
        try{
            let users = await getUsersByRoom(roomId)
            for(user in users){
                // user act as a iterator
                await removeUserById(users[user])
            }
            resolve('deleted');

        } catch (error) {
            console.log(error);
            reject(error);
          }
    })
}

module.exports.User = {
    addUser,
    getUserById,
    updateUser,
    getUsersByRoom,
    deleteUsersByRoom,
    removeUserById    
}