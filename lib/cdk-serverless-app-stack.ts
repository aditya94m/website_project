import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as apigw from "aws-cdk-lib/aws-apigateway";

export class CdkServerlessAppStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const table = new dynamodb.Table(this, "Users", {
      partitionKey: { name: "user_id", type:dynamodb.AttributeType.NUMBER }, 
    });

    const getDynamoLambda = new lambda.Function(this, "GetDynamoLambda", {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset("src"),
      handler: "get-dynamo-lambda.handler",
      timeout: cdk.Duration.seconds(30),
      environment: {
        DYNAMO_TABLE_NAME: table.tableName,
      },
    });

    const postDynamoLambda = new lambda.Function(this, "PostDynamoLambda", {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset("src"),
      handler: "post-dynamo-lambda.handler",
      timeout: cdk.Duration.seconds(30),
      environment: {
        DYNAMO_TABLE_NAME: table.tableName,
      },
    });

    table.grantReadData(getDynamoLambda);
    table.grantWriteData(postDynamoLambda);

    const api = new apigw.RestApi(this, "the-rest-api");
    api.root
      .resourceForPath("users")
      .addMethod("GET", new apigw.LambdaIntegration(getDynamoLambda));
    api.root
      .resourceForPath("users")
      .addMethod("POST", new apigw.LambdaIntegration(postDynamoLambda));

      new cdk.CfnOutput(this, "REST API URL", {
        value: api.url ?? "Something went wrong with the deploy",
      });
  }
}
