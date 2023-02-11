const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const TableName= 'TodoTable'

const updateTodo = async (event) => {
    console.log(event.pathParameters.id)
    const completedOrNot = JSON.parse(event.body).completed 
    const id = event.pathParameters.id
    const params={
        TableName,
        Key:{id},
        UpdateExpression:'set completed = :c',
        ExpressionAttributeValues:{
            ':c' : completedOrNot
        },
        ReturnValues:'ALL_NEW'

    }
    const data = await dynamodb.update(params).promise()    
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        data
      }
    ),
  };
};
module.exports = {handler:updateTodo}
