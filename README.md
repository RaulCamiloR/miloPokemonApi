# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template

## More Commands that I need

aws configure
aws configure --profile udemy-camilo
aws sts get-caller-identity --profile udemy-camilo
set AWS_PROFILE=udemy-camilo
aws sts get-caller-identity

export AWS_PROFILE=992382689910_AWSAdministratorAccess

export AWS_PROFILE=udemy-camilo

aws lambda list-functions --region us-east-1

aws cloudformation describe-stack-resources --stack-name LambdaStack --region us-east-1

aws lambda get-policy --function-name <NombreExacto> --region us-east-1

LambdaStack-HelloLambda3D9C82D6-GKttM2IK3u1j

aws s3 ls


# CDK Commands

cdk init app --language=typescript

# se ejecuta cada vez que se crea un proyecto por primera vez en una region
cdk bootstrap       
cdk bootstrap aws://<accountId>/<region>

cdk synth

cdk deploy

cdk list

cdk diff  // It shows you the difference between what you have locally and in the cloud

cdk doctor

cdk destroy

cdk deploy --parameters .... example: duration=4  Nombre de la funcion que se crea con CfnParameter

aws cognito-idp admin-set-user-password --user-pool-id <id del user pool> --username <usuario> --password "<el password>" --permanent

https://us-east-1_gjiUMW4Is.auth.us-east-1.amazoncognito.com/oauth2/token

61d82cl88pt10jo2udkckurqai

cdk deploy --all --outputs-file outputs.json

npx tsc    para typescript
