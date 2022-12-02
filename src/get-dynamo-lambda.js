exports.handler = async function (event) {
  console.log("processed request:", JSON.stringify(event));
  const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
  const { DynamoDBDocumentClient, GetCommand } = require("@aws-sdk/lib-dynamodb");
  const dynamoClient = new DynamoDBClient({region: 'us-east-1'});
  const dynamoDocumentClient = DynamoDBDocumentClient.from(dynamoClient);
  const dynamoDBName = process.env.DYNAMO_TABLE_NAME;
  console.log(dynamoDBName);
  const params = {
    TableName: dynamoDBName,
    Key: {
      first_name: event['queryStringParameters']['first_name']
    }
  };
  console.log(params['Key']['first_name']); 
  try {
    const response = await dynamoDocumentClient.send(new GetCommand(params));
    console.log(response);
    const ret_response = {
      "statusCode": response['$metadata']['httpStatusCode'],
      "body": JSON.stringify(response['Item']),
      "isBase64Encoded": false,
      "headers": {
        'Content-Type': 'application/json'
      }
    };
    console.log(ret_response);
    return ret_response;
  } catch (err) {
    const ret_error = {
      "statusCode": 400,
      "body": JSON.stringify({ 'body': 'invalid request'}),
      "isBase64Encoded": false,
      "headers": {
        'Content-Type': 'application/json'
      }
    };
    console.log(ret_error);
    return ret_error;
  }
}
