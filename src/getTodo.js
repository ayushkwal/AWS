const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const TableName= 'TodoTable'

const getTodo = async (event) => {
    console.log(event.pathParameters.id)
    const id = event.pathParameters.id
    const params={
        TableName,
        Key:{id}
    }
    const data = await dynamodb.get(params).promise()    
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        data
      }
    ),
  };
};
module.exports = {handler:getTodo}
