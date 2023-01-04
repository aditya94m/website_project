import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as apigw from "aws-cdk-lib/aws-apigateway";

export class OrderStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);
    
        const ordersTable = new dynamodb.Table(this, 'Orders', {
            partitionKey: {name: 'OrderID', type: dynamodb.AttributeType.NUMBER}
        });

        ordersTable.addGlobalSecondaryIndex({
            indexName: 'userIdIndex',
            partitionKey: {name: 'UserID', type: dynamodb.AttributeType.NUMBER},
            projectionType: dynamodb.ProjectionType.ALL,
        });

        const getOrdersLambda = new lambda.Function(this, 'GetOrders',  {
            runtime: lambda.Runtime.NODEJS_16_X,
            code: lambda.Code.fromAsset('src'),
            handler: 'get-orders.handler',
            timeout: cdk.Duration.seconds(30),
            environment: {
              DYNAMO_TABLE_NAME: ordersTable.tableName,
            },
          });

        const postOrderLambda = new lambda.Function(this, 'PostOrder', {
            runtime: lambda.Runtime.NODEJS_16_X,
            code: lambda.Code.fromAsset('src'),
            handler: 'post-order.handler',
            timeout: cdk.Duration.seconds(30),
            environment: {
              DYNAMO_TABLE_NAME: ordersTable.tableName,
            },
        });

        const getOrderLambda = new lambda.Function(this, 'GetOrder', {
            runtime: lambda.Runtime.NODEJS_16_X,
            code: lambda.Code.fromAsset('src'),
            handler: 'get-order.handler',
            timeout: cdk.Duration.seconds(30),
            environment: {
              DYNAMO_TABLE_NAME: ordersTable.tableName,
            },
        });

        const putOrderLambda = new lambda.Function(this, 'PutOrder', {
            runtime: lambda.Runtime.NODEJS_16_X,
            code: lambda.Code.fromAsset('src'),
            handler: 'put-order.handler',
            timeout: cdk.Duration.seconds(30),
            environment: {
              DYNAMO_TABLE_NAME: ordersTable.tableName,
            },
        });

        const deleteOrderLambda = new lambda.Function(this, 'DeleteOrder', {
            runtime: lambda.Runtime.NODEJS_16_X,
            code: lambda.Code.fromAsset('src'),
            handler: 'delete-order.handler',
            timeout: cdk.Duration.seconds(30),
            environment: {
              DYNAMO_TABLE_NAME: ordersTable.tableName,
            },
        });

        const getTopOrderedFoodsLambda = new lambda.Function(this, 'GetTopOrderedFoods', {
            runtime: lambda.Runtime.NODEJS_16_X,
            code: lambda.Code.fromAsset('src'),
            handler: 'get-top-ordered-foods.handler',
            timeout: cdk.Duration.seconds(30),
            environment: {
              DYNAMO_TABLE_NAME: ordersTable.tableName,
            },
        });


        ordersTable.grantReadData(getOrdersLambda);
        ordersTable.grantReadData(getOrderLambda);
        ordersTable.grantReadData(getTopOrderedFoodsLambda);
        ordersTable.grantWriteData(postOrderLambda);
        ordersTable.grantWriteData(putOrderLambda);
        ordersTable.grantWriteData(deleteOrderLambda);

        const api = new apigw.RestApi(this, 'orders-api');
        const api_users = api.root.addResource('users');
        const api_userid = api_users.addResource('{userID}');
        const api_orders = api_userid.addResource('orders');
        api_orders.addMethod('GET', new apigw.LambdaIntegration(getOrdersLambda));
        api_orders.addMethod('POST', new apigw.LambdaIntegration(postOrderLambda));
        const api_orderid = api_orders.addResource('{orderID}');
        api_orderid.addMethod('GET', new apigw.LambdaIntegration(getOrderLambda));
        api_orderid.addMethod('PUT', new apigw.LambdaIntegration(putOrderLambda));
        api_orderid.addMethod('DELETE', new apigw.LambdaIntegration(deleteOrderLambda));
        const api_frequents = api_orders.addResource('frequents');
        api_frequents.addMethod('GET', new apigw.LambdaIntegration(getTopOrderedFoodsLambda));

        new cdk.CfnOutput(this, "REST API URL", {
            value: api.url ?? "Something went wrong with the deploy",
          });
    }
}