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

module.exports = {
    addUser
}