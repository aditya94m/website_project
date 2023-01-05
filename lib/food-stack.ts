import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as apigw from "aws-cdk-lib/aws-apigateway";

export class FoodStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);
    
        const foodsTable = new dynamodb.Table(this, 'Foods', {
            partitionKey: {name: 'Name', type: dynamodb.AttributeType.STRING}
        });

        foodsTable.addGlobalSecondaryIndex({
            indexName: 'categoryNameIndex',
            partitionKey: {name: 'CategoryName', type: dynamodb.AttributeType.STRING},
            projectionType: dynamodb.ProjectionType.ALL,
        });

        foodsTable.addGlobalSecondaryIndex({
            indexName: 'priceIndex',
            partitionKey: {name: 'Price', type: dynamodb.AttributeType.NUMBER},
            projectionType: dynamodb.ProjectionType.ALL,
        });

        const ratingsTable = new dynamodb.Table(this, 'Ratings', {
            partitionKey: {name: 'RatingID', type: dynamodb.AttributeType.NUMBER}
        });

        ratingsTable.addGlobalSecondaryIndex({
            indexName: 'userIdIndex',
            partitionKey: {name: 'UserID', type: dynamodb.AttributeType.NUMBER},
            projectionType: dynamodb.ProjectionType.ALL,
        });

        const reviewsTable = new dynamodb.Table(this, 'Reviews', {
            partitionKey: {name: 'ReviewID', type: dynamodb.AttributeType.NUMBER}
        });

        reviewsTable.addGlobalSecondaryIndex({
            indexName: 'userIdIndex',
            partitionKey: {name: 'UserID', type: dynamodb.AttributeType.NUMBER},
            projectionType: dynamodb.ProjectionType.ALL,
        });

        const categoriesTable = new dynamodb.Table(this, 'Categories', {
            partitionKey: {name: 'Name', type: dynamodb.AttributeType.STRING}
        });

        const getFoodsLambda = new lambda.Function(this, 'GetFoods',  {
            runtime: lambda.Runtime.NODEJS_16_X,
            code: lambda.Code.fromAsset('src'),
            handler: 'get-foods.handler',
            timeout: cdk.Duration.seconds(30),
            environment: {
              DYNAMO_TABLE_NAME: foodsTable.tableName,
            },
        });

        const getFoodLambda = new lambda.Function(this, 'GetFood',  {
            runtime: lambda.Runtime.NODEJS_16_X,
            code: lambda.Code.fromAsset('src'),
            handler: 'get-food.handler',
            timeout: cdk.Duration.seconds(30),
            environment: {
              DYNAMO_TABLE_NAME: foodsTable.tableName,
            },
        });

        const postRatingLambda = new lambda.Function(this, 'PostRating',  {
            runtime: lambda.Runtime.NODEJS_16_X,
            code: lambda.Code.fromAsset('src'),
            handler: 'post-rating.handler',
            timeout: cdk.Duration.seconds(30),
            environment: {
              DYNAMO_TABLE_NAME: ratingsTable.tableName,
            },
        });

        const getRatingLambda = new lambda.Function(this, 'GetRating',  {
            runtime: lambda.Runtime.NODEJS_16_X,
            code: lambda.Code.fromAsset('src'),
            handler: 'get-rating.handler',
            timeout: cdk.Duration.seconds(30),
            environment: {
              DYNAMO_TABLE_NAME: ratingsTable.tableName,
            },
        });

        const putRatingLambda = new lambda.Function(this, 'PutRating',  {
            runtime: lambda.Runtime.NODEJS_16_X,
            code: lambda.Code.fromAsset('src'),
            handler: 'put-rating.handler',
            timeout: cdk.Duration.seconds(30),
            environment: {
              DYNAMO_TABLE_NAME: ratingsTable.tableName,
            },
        });

        const deleteRatingLambda = new lambda.Function(this, 'DeleteRating',  {
            runtime: lambda.Runtime.NODEJS_16_X,
            code: lambda.Code.fromAsset('src'),
            handler: 'delete-rating.handler',
            timeout: cdk.Duration.seconds(30),
            environment: {
              DYNAMO_TABLE_NAME: ratingsTable.tableName,
            },
        });
        
        const getReviewsLambda = new lambda.Function(this, 'GetReviews',  {
            runtime: lambda.Runtime.NODEJS_16_X,
            code: lambda.Code.fromAsset('src'),
            handler: 'get-reviews.handler',
            timeout: cdk.Duration.seconds(30),
            environment: {
              DYNAMO_TABLE_NAME: reviewsTable.tableName,
            },
        });

        const postReviewLambda = new lambda.Function(this, 'PostReview',  {
            runtime: lambda.Runtime.NODEJS_16_X,
            code: lambda.Code.fromAsset('src'),
            handler: 'post-review.handler',
            timeout: cdk.Duration.seconds(30),
            environment: {
              DYNAMO_TABLE_NAME: reviewsTable.tableName,
            },
        });

        const getReviewLambda = new lambda.Function(this, 'GetReview',  {
            runtime: lambda.Runtime.NODEJS_16_X,
            code: lambda.Code.fromAsset('src'),
            handler: 'get-review.handler',
            timeout: cdk.Duration.seconds(30),
            environment: {
              DYNAMO_TABLE_NAME: reviewsTable.tableName,
            },
        });

        const putReviewLambda = new lambda.Function(this, 'PutReview',  {
            runtime: lambda.Runtime.NODEJS_16_X,
            code: lambda.Code.fromAsset('src'),
            handler: 'put-review.handler',
            timeout: cdk.Duration.seconds(30),
            environment: {
              DYNAMO_TABLE_NAME: reviewsTable.tableName,
            },
        });

        const deleteReviewLambda = new lambda.Function(this, 'DeleteReview',  {
            runtime: lambda.Runtime.NODEJS_16_X,
            code: lambda.Code.fromAsset('src'),
            handler: 'delete-review.handler',
            timeout: cdk.Duration.seconds(30),
            environment: {
              DYNAMO_TABLE_NAME: reviewsTable.tableName,
            },
        });

        const getCategoriesLambda = new lambda.Function(this, 'GetCategories',  {
            runtime: lambda.Runtime.NODEJS_16_X,
            code: lambda.Code.fromAsset('src'),
            handler: 'get-categories.handler',
            timeout: cdk.Duration.seconds(30),
            environment: {
              DYNAMO_TABLE_NAME: categoriesTable.tableName,
            },
        });

        const getUserRatingsLambda = new lambda.Function(this, 'GetUserRatings',  {
            runtime: lambda.Runtime.NODEJS_16_X,
            code: lambda.Code.fromAsset('src'),
            handler: 'get-user-ratings.handler',
            timeout: cdk.Duration.seconds(30),
            environment: {
              DYNAMO_TABLE_NAME: ratingsTable.tableName,
            },
        });

        foodsTable.grantReadData(getFoodsLambda);
        foodsTable.grantReadData(getFoodLambda);
        ratingsTable.grantReadData(getRatingLambda);
        ratingsTable.grantReadData(getUserRatingsLambda);
        ratingsTable.grantWriteData(postRatingLambda);
        ratingsTable.grantWriteData(putRatingLambda);
        ratingsTable.grantWriteData(deleteRatingLambda);
        reviewsTable.grantReadData(getReviewsLambda);
        reviewsTable.grantReadData(getReviewLambda);
        reviewsTable.grantWriteData(postReviewLambda);
        reviewsTable.grantWriteData(putReviewLambda);
        reviewsTable.grantWriteData(deleteReviewLambda);
        categoriesTable.grantReadData(getCategoriesLambda);

        const api = new apigw.RestApi(this, 'orders-api');
        const api_foods = api.root.addResource('foods');
        api_foods.addMethod('GET', new apigw.LambdaIntegration(getFoodsLambda));
        const api_food_id = api_foods.addResource('{foodID}');
        api_food_id.addMethod('GET', new apigw.LambdaIntegration(getFoodLambda));
        const api_ratings = api_food_id.addResource('ratings');
        api_ratings.addMethod('POST', new apigw.LambdaIntegration(postRatingLambda));
        const api_rating_id = api_ratings.addResource('{ratingID}');
        api_rating_id.addMethod('GET', new apigw.LambdaIntegration(getRatingLambda));
        api_rating_id.addMethod('PUT', new apigw.LambdaIntegration(putRatingLambda));
        api_rating_id.addMethod('DELETE', new apigw.LambdaIntegration(deleteRatingLambda));
        const api_reviews = api_food_id.addResource('reviews');
        api_reviews.addMethod('GET', new apigw.LambdaIntegration(getReviewsLambda));
        api_reviews.addMethod('POST', new apigw.LambdaIntegration(postReviewLambda));
        const api_review_id = api_reviews.addResource('{reviewID}');
        api_review_id.addMethod('GET', new apigw.LambdaIntegration(getReviewLambda));
        api_review_id.addMethod('PUT', new apigw.LambdaIntegration(putReviewLambda));
        api_review_id.addMethod('DELETE', new apigw.LambdaIntegration(deleteReviewLambda));
        const api_categories = api_foods.addResource('categories');
        api_categories.addMethod('GET', new apigw.LambdaIntegration(getCategoriesLambda));
        const api_foods_ratings = api_foods.addResource('ratings');
        api_foods_ratings.addMethod('GET', new apigw.LambdaIntegration(getUserRatingsLambda));

        new cdk.CfnOutput(this, "REST API URL", {
            value: api.url ?? "Something went wrong with the deploy",
        });
    }
}