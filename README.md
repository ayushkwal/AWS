# AWS
1) Table
2) Role
3) Lambda (Don't forget to import role)
4) Connect Table
5) Making Inline Code

![image](https://user-images.githubusercontent.com/70058068/120980481-4a442800-c794-11eb-8c5d-deeaae63f192.png)

Here,S is just type of primary key
Make it more simpler :: Just reduce this : AWS.config.update({region:'us-east-1'}) and also {apiVersion: '2012-08-10'}
Don't forget to import aws-sdk
This was just funky json syntax
Get Rid of that:
use doc client

![image](https://user-images.githubusercontent.com/70058068/120982342-3ef1fc00-c796-11eb-84ad-94a55195bc8a.png)

Note:: Here, get and put are used.
More Best way ::: 

![image](https://user-images.githubusercontent.com/70058068/120985386-30591400-c799-11eb-8fc7-031de5c5e83d.png)

PUT Requests Handling
 
Remember use key in get and use Item in put(not post)
now it's time for api
6) create API
7) 
![image](https://user-images.githubusercontent.com/70058068/121002251-c7c66300-c7a9-11eb-8e4e-0bf0ff85e703.png)

![image](https://user-images.githubusercontent.com/70058068/121002494-065c1d80-c7aa-11eb-95bf-e7ecad4dc529.png)

7)   GET REQUEST
'use strict'
const AWS = require('aws-sdk');

exports.handler =async (event, context, callback)=> {
var dynamodb = new AWS.DynamoDB.DocumentClient();
    
    var params = {
        Key: {
         id:123,
        }, 
        TableName: "testing"
       };
       try{
           const data = await dynamodb.get(params).promise();
           console.log(data);
       }
       catch(err){
           console.log(err);
       }
}
NOTE: Make sure to check use proxy integration
8) MODIFIED GET REQUEST
'use strict'
const AWS = require('aws-sdk');

AWS.config.update({ region: "us-east-1"});
console.log('...........................................')
exports.handler = async (event, context) => {
  console.log('...........................................')
  const ddb = new AWS.DynamoDB({ apiVersion: "2012-10-08"});
  const documentClient = new AWS.DynamoDB.DocumentClient({ region: "us-east-1"});

  let responseBody = "";
  let statusCode = 0;
  const id = parseInt(event.pathParameters.id);

  const params = {
    TableName: "testing",
    Key: {
      id: id
    }
  }
;
  try {
    const data = await documentClient.get(params).promise();
    responseBody = JSON.stringify(data.Item);
    statusCode = 200;
  } catch (err) {
    responseBody = `Unable to get user data`;
    statusCode = 403;
  }

  const response = {
    statusCode: statusCode,
   
    body: responseBody
  }
;
  return response;
}

![image](https://user-images.githubusercontent.com/70058068/121108440-6218bc00-c827-11eb-9883-e430ed25d324.png)

How flow looks like:

![image](https://user-images.githubusercontent.com/70058068/121108502-7c529a00-c827-11eb-8201-9f4ee00e7032.png)

Note:: You may also need to update IAM Roles 

![image](https://user-images.githubusercontent.com/70058068/121108729-e10df480-c827-11eb-8587-e297e8301cef.png)

make new inline policy::

![image](https://user-images.githubusercontent.com/70058068/121108887-28948080-c828-11eb-9df3-4f2ec7151fbb.png)

//Now handling post request
make model in your api then you can configure flow
Take help of structure: https://docs.aws.amazon.com/apigateway/latest/developerguide/models-mappings.html

![image](https://user-images.githubusercontent.com/70058068/121111977-63e57e00-c82d-11eb-8405-47d8ccf328bb.png)

now in method execution : 

![image](https://user-images.githubusercontent.com/70058068/121112343-e4a47a00-c82d-11eb-8dd7-5098e0722aab.png)

![image](https://user-images.githubusercontent.com/70058068/121112364-ecfcb500-c82d-11eb-9193-c1476ecf0dd5.png)

I hope you have copied data:

![image](https://user-images.githubusercontent.com/70058068/121113035-faff0580-c82e-11eb-8ab4-b032c16e8aef.png)

. I am removing it.
'use strict'
const AWS = require('aws-sdk');

AWS.config.update({ region: "us-east-1"});
exports.handler = async (event, context) => {
  
  
  const documentClient = new AWS.DynamoDB.DocumentClient({ region: "us-east-1"});

  let responseBody = "";
  let statusCode = 0;
  const {id,name} = JSON.parse(event.body);

  const params = {
    TableName: "testing",
    Item: {
      id: id,
      name:name
    }
  }
;
  try {
    const data = await documentClient.put(params).promise();
    responseBody = JSON.stringify(data);    //because we are just returning an empty obje
    statusCode = 200;
  } catch (err) {
    responseBody = `Unable to submit user data`;
    statusCode = 403;
  }

  const response = {
    statusCode: statusCode,
   
    body: responseBody
  }
;
  return response;
}

![image](https://user-images.githubusercontent.com/70058068/121114294-166b1000-c831-11eb-817b-405d4be60bfa.png)


Now, we will integrate s3 bucket
create S3 bucket
integrate with lambda
now we are uploading any json file and will fetch it's data
like we have created bucket name testforapi and item be users.json  
use PUT in Triggering else it will fire every time.
const AWS = require('aws-sdk');
const s3 = new AWS.S3(); 

exports.handler = async (event)=>{
  const name = 'testbucketforapi';   //name of api
  const key = 'users.json';          //name of data
  
  const params = {
    Bucket:name,
    Key:key
  }
  try{
  const data = await s3.getObject(params).promise();
  const userData = data.Body.toString();
  const userJson = JSON.parse(userData);
  console.log('------------------',userJson)
  }catch(err){
    console.log(err);
  }
    
  }

now we will save this data to dynamo db table which is crucially step.
create table
const AWS = require('aws-sdk');
const s3 = new AWS.S3(); 
const dynamodb = new AWS.DynamoDB.DocumentClient();
exports.handler = async (event)=>{
  const name = 'testbucketforapi';
  const key = 'users.json';
  
  const params = {
    Bucket:name,
    Key:key
  }
 
  
  try{
  const data = await s3.getObject(params).promise();
  const userData = data.Body
  const userJson = JSON.parse(userData);
  console.log(userJson);
  
  
  
   const putparams = {
    TableName:"testing",
    Item:{
      id:Math.floor(Math.random()*(100000-200+1)+200),
      name:userJson[0].firstname                         //all names will be assigned with firstname of first returned user. To get real names we have to use map method
    }
  }
  console.log(putparams);
  const putData = await dynamodb.put(putparams).promise();
  console.log(putData);
  
  }
  catch(err){
    console.log(err);
  }
    
  }
  <h4>Now we are using AWS Cognito</h4>
  it is identity provider.
  Easy to signin facility.
  We'll first using user pools which is db and amplify.
  Cognito uses jwt token.
  we don't ned to refresh these tokens, it does automatically.
  
<h2> Now create cognito </h2>
 
1) nnpm install aws-amplify
2) amplify init
3) amplify add auth
4) ![image](https://user-images.githubusercontent.com/70058068/121204530-91b1dd80-c894-11eb-9935-662e86e9bf5f.png)
5) 
6) ![image](https://user-images.githubusercontent.com/70058068/121204897-db9ac380-c894-11eb-83f3-81076ee0d825.png)
7) 
8) ![image](https://user-images.githubusercontent.com/70058068/121205143-0be26200-c895-11eb-85d1-003fd6abdbd2.png)


 In other words :: Refer https://docs.amplify.aws/lib/auth/getting-started/q/platform/js#option-1-use-pre-built-ui-components
 
 7) In order to get data like user's id, email,username, Contact number Refer below->
 
 9) ![image](https://user-images.githubusercontent.com/70058068/121205432-49df8600-c895-11eb-8699-860142c47735.png)

 11) Reference:https://docs.amplify.aws/lib/auth/manageusers/q/platform/js#account-recovery-verification

![image](https://user-images.githubusercontent.com/70058068/121205757-8e6b2180-c895-11eb-8512-c117ff600faa.png)

