exports.handler = async function (event) {
  const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
  const { DynamoDBDocumentClient, GetCommand } = require("@aws-sdk/lib-dynamodb");
  const dynamoClient = new DynamoDBClient({region: 'us-east-1'});
  const dynamoDocumentClient = DynamoDBDocumentClient.from(dynamoClient);
  const dynamoDBName = process.env.DYNAMO_TABLE_NAME;
  const converted_uid = Number(event['queryStringParameters']['user_id']);
  const user_id = Number.isNaN(converted_uid) ? -1 : converted_uid;
  const params = {
    TableName: dynamoDBName,
    Key: {
      user_id: user_id
    }
  };
  const response = await dynamoDocumentClient.send(new GetCommand(params));
  if (response['Item'] !== undefined) {
    const ret_response = {
      "statusCode": response['$metadata']['httpStatusCode'],
      "body": JSON.stringify(response['Item']),
      "isBase64Encoded": false,
      "headers": {
        'Content-Type': 'application/json'
      }
    };
    return ret_response;
} else {
    const ret_error = {
      "statusCode": 400,
      "body": JSON.stringify({ 'body': 'ERROR: invalid request'}),
      "isBase64Encoded": false,
      "headers": {
        'Content-Type': 'application/json'
      }
    };
    return ret_error;
  }
}
