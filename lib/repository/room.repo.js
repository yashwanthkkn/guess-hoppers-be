const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
AWS.config.loadFromPath('./config.json');


const client = new AWS.DynamoDB.DocumentClient();
const tableName = 'gh-room';


const createRoom = async (data) => {
    return new Promise((resolve, reject) => {

        let { roomName } = data;
        let { word } = data;

        let room = {
            roomName: roomName,
            roomId: uuidv4(),
            host_id: 0,
            word: word,
            curr_player: 0,
            recent_user_id: 0
        }

        let params = {
            TableName: tableName,
            Item: room
        };

        client.put(params, (err) => {
            if (err) {
                console.error("Unable to add item.");
                console.error("Error JSON:", JSON.stringify(err, null, 2));
                reject(err)
            } else {
                console.log("Added item:", JSON.stringify(room, null, 2));
                resolve(room)
            }
        });
    })

}


const updateRoom = async (data) => {

    return new Promise((resolve, reject) => {
        let { roomId } = data

        let updateExpression = 'set';
        let ExpressionAttributeNames = {};
        let ExpressionAttributeValues = {};
        console.log(data);
        for (const property in data) {
            ExpressionAttributeValues[':' + property] = data[property];
            if (property == 'roomId')
                continue
            ExpressionAttributeNames['#' + property] = property;
            updateExpression += ` #${property} = :${property} ,`;
        }
        console.log(ExpressionAttributeNames);
        console.log(ExpressionAttributeValues);
        updateExpression = updateExpression.slice(0, -1);

        var params = {
            TableName: tableName,
            Key: {
                roomId: roomId
            },
            UpdateExpression: updateExpression,
            ConditionExpression: 'roomId = :roomId',
            ExpressionAttributeNames: ExpressionAttributeNames,
            ExpressionAttributeValues: ExpressionAttributeValues,
        }
        client.update(params, function (err) {
            if (err) {
                console.error("Unable to update item.");
                console.error("Error JSON:", JSON.stringify(err, null, 2));
                reject(err)
            }
            else {
                console.log("Updated item:", JSON.stringify(data, null, 2));
                resolve(data)
            }
        });
    })

}

const clearRoom = async (data) => {
    return new Promise((resolve, reject) => {

        let {roomId} = data;


        var params = {
            TableName: tableName,
            Key: {
                roomId: roomId
            }
        };

        client.delete(params, function(err, data) {
            if (err){
                console.error("Unable to delete item.");
                console.error("Error JSON:", JSON.stringify(err, null, 2));
                reject(err);
            } 
            else{
                console.log("Deleted item:", JSON.stringify(data, null, 2));
                resolve(data);
            } 
        });
    })

}

module.exports.Room = {
    createRoom,
    updateRoom,
    clearRoom
}