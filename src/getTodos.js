const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const TableName= 'TodoTable'

const getTodos = async (event) => {
    const params={
        TableName
    }
    const data = await dynamodb.scan(params).promise()    
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        data
      }
    ),
  };
};
module.exports = {handler:getTodos}
