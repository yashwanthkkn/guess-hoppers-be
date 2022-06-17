const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
AWS.config.loadFromPath('./config.json');


const client = new AWS.DynamoDB.DocumentClient();
const tableName = 'gh-chat';

const createChat = async (data)=>