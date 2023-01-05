import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as apigw from "aws-cdk-lib/aws-apigateway";

export class UserStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);
    
        const usersTable = new dynamodb.Table(this, 'Users', {
            partitionKey: {name: 'UserID', type: dynamodb.AttributeType.NUMBER}
        });

        const postUserLambda = new lambda.Function(this, 'PostUser',  {
            runtime: lambda.Runtime.NODEJS_16_X,
            code: lambda.Code.fromAsset('src'),
            handler: 'post-user.handler',
            timeout: cdk.Duration.seconds(30),
            environment: {
              DYNAMO_TABLE_NAME: usersTable.tableName,
            },
        });

        const getUserLambda = new lambda.Function(this, 'GetUser', {
            runtime: lambda.Runtime.NODEJS_16_X,
            code: lambda.Code.fromAsset('src'),
            handler: 'get-user.handler',
            timeout: cdk.Duration.seconds(30),
            environment: {
              DYNAMO_TABLE_NAME: usersTable.tableName,
            },
        });

        const putUserLambda = new lambda.Function(this, 'PutUser', {
            runtime: lambda.Runtime.NODEJS_16_X,
            code: lambda.Code.fromAsset('src'),
            handler: 'put-user.handler',
            timeout: cdk.Duration.seconds(30),
            environment: {
              DYNAMO_TABLE_NAME: usersTable.tableName,
            },
        });

        const deleteUserLambda = new lambda.Function(this, 'DeleteUser', {
            runtime: lambda.Runtime.NODEJS_16_X,
            code: lambda.Code.fromAsset('src'),
            handler: 'delete-user.handler',
            timeout: cdk.Duration.seconds(30),
            environment: {
              DYNAMO_TABLE_NAME: usersTable.tableName,
            },
        });

        const getTopCategoryRecommendationsLambda = new lambda.Function(this, 'GetTopCategoryRecommendations', {
            runtime: lambda.Runtime.NODEJS_16_X,
            code: lambda.Code.fromAsset('src'),
            handler: 'get-top-category-recommendations.handler',
            timeout: cdk.Duration.seconds(30),
            environment: {
              DYNAMO_TABLE_NAME: usersTable.tableName,
            },
        });

        usersTable.grantReadData(getUserLambda);
        usersTable.grantWriteData(postUserLambda);
        usersTable.grantWriteData(putUserLambda);
        usersTable.grantWriteData(deleteUserLambda);

        const api = new apigw.RestApi(this, 'users-api');
        const api_users = api.root.addResource('users');
        api_users.addMethod('POST', new apigw.LambdaIntegration(postUserLambda));
        const api_userid = api_users.addResource('{userID}');
        api_userid.addMethod('GET', new apigw.LambdaIntegration(getUserLambda));
        api_userid.addMethod('PUT', new apigw.LambdaIntegration(putUserLambda));
        api_userid.addMethod('DELETE', new apigw.LambdaIntegration(deleteUserLambda));
        const api_recommendations = api_userid.addResource('recommendations');
        api_recommendations.addMethod('GET', new apigw.LambdaIntegration(getTopCategoryRecommendationsLambda));

        new cdk.CfnOutput(this, "REST API URL", {
            value: api.url ?? "Something went wrong with the deploy",
          });
    }
}