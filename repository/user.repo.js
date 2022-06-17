const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
AWS.config.loadFromPath('./config.json');


const client = new AWS.DynamoDB.DocumentClient();
const tableName = 'gh-user';

const addUser = async (data)=>{
    return new Promise((resolve, reject) => {
        
        let {userName} = data;
        
        let user = {
            userName : userName,
            userId : uuidv4(),
            joinNumber : 0
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
                resolve(data);
            } 
        });
    })
}

const updateUser = async (data) => {
    
    return new Promise((resolve, reject) => {
        let {userId} = data 
        
        let updateExpression='set';
        let ExpressionAttributeNames={};
        let ExpressionAttributeValues = {};
        console.log(data);
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

module.exports.User = {
    addUser,
    getUserById,
    updateUser
}