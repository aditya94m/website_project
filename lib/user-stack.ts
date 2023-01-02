import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as apigw from "aws-cdk-lib/aws-apigateway";

export class UserStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);
    
        const userTable = new dynamodb.Table(this, 'Users', {
            partitionKey: {name: 'UserID', type:dynamodb.AttributeType.NUMBER}
        });

        const postUserLambda = new lambda.Function(this, "PostUser",  {
            runtime: lambda.Runtime.NODEJS_16_X,
            code: lambda.Code.fromAsset("src"),
            handler: "get-dynamo-lambda.handler",
            timeout: cdk.Duration.seconds(30),
            environment: {
              DYNAMO_TABLE_NAME: userTable.tableName,
            },
          });
    }
        
}