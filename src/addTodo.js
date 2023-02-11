const AWS = require('aws-sdk');
const {v4} =require('uuid');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const TableName= 'TodoTable'
const id=v4()
const createdAt = new Date().toISOString()
// Adding Middleware

const addTodo = async (event) => {
    const abc = JSON.parse(event.body);
    console.log(abc)
    const newTodo = {
        id,
        createdAt,
        work:abc.work,
        completed:false
    }
    const params={
        TableName,
        Item:newTodo
    }
    await dynamodb.put(params).promise()    
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        data:newTodo
      }
    ),
  };
};
module.exports = {handler: addTodo}
