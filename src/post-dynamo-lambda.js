import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
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
    let item;
    try {
        item = JSON.parse(event.body)['Item'];
    } catch (err) {
        return error_response;
    }
    if (!item) return error_response;
    let [u_id, f_name, l_name, u_age] = [item['user_id'], item['first_name'],
        item['last_name'], item['age']];
    if (!u_id || !f_name || !l_name || !u_age ||
        !(typeof f_name == 'string') || !(typeof l_name == 'string')) {
        return error_response;
    }
    [u_id, f_name, l_name, u_age] = [Number(u_id), f_name.trim(), 
    l_name.trim(), Number(u_age)];
    if (Number.isNaN(u_id) || f_name.length == 0 || (/[^a-zA-Z']/.test(f_name))
        || l_name.length == 0 || (/[^a-zA-Z']/.test(l_name)) 
        || Number.isNaN(u_age)) {
        return error_response;
    }
    const params = {
        TableName: dynamoDBName,
        Item: {
            user_id: u_id,
            first_name: f_name,
            last_name: l_name,
            age: u_age
        }
    };
    try {
        const response = await dynamoDocumentClient.send(new PutCommand(params));
        return {
            "statusCode": response['$metadata']['httpStatusCode'],
            "body": JSON.stringify(params['Item']),
            "isBase64Encoded": false,
            "headers": {
            'Content-Type': 'application/json'
            }
        };
    } catch (err) {
        console.log(err);
        return error_response;
    }
  };
  