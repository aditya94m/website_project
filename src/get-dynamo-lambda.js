import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
export const handler = async (event) => {
  const dynamoClient = new DynamoDBClient({region: 'us-east-1'});
  const dynamoDocumentClient = DynamoDBDocumentClient.from(dynamoClient);
  const dynamoDBName = process.env.DYNAMO_TABLE_NAME;
  const error_response = {
    "statusCode": 400,
    "body": JSON.stringify({ 'body': 'ERROR: invalid request'}),
    "isBase64Encoded": false,
    "headers": {
      'Content-Type': 'application/json'
    }
  };
  const u_id = Number(event['queryStringParameters']['user_id']);
  if (Number.isNaN(u_id)) {
    return error_response;
  } 
  const params = {
    TableName: dynamoDBName,
    Key: {
      user_id: u_id
    }
  };
  const response = await dynamoDocumentClient.send(new GetCommand(params));
  if (response['Item'] !== undefined) {
    return {
      "statusCode": response['$metadata']['httpStatusCode'],
      "body": JSON.stringify(response['Item']),
      "isBase64Encoded": false,
      "headers": {
        'Content-Type': 'application/json'
      }
    };
} else {
    console.error(response);
    return error_response;
  }
};
