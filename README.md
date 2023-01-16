# Restaurant Website Application

This is the code for a restaurant website I designed and am currently implementing that allows user to select foods from a menuplace orders, rate and review the foods, and review user order and account activity. The backend infrastructure is hosted on AWS using API Gateway, Lambda, DynamoDB, S3, SQS and is implemented as IaC with the AWS CDK in Typescript and the backend Lambdas are being implemented in Node.js The website uses REST API endpoints for the frontend to communicate with backend microservices. The front end will be implemented using React to display the UI for all functionality. 

The backend architecture design can be found below. [AWS_Proj_Idea.docx](https://github.com/aditya94m/website_project/files/10427861/AWS_Proj_Idea.docx)



## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template
