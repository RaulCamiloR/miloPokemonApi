import * as cdk from 'aws-cdk-lib';
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as iam from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";
import { UserPool, UserPoolClient } from 'aws-cdk-lib/aws-cognito';

export class UnoAuthStack extends cdk.Stack {

    public readonly registerLambda: lambda.Function;
    public readonly loginLambda: lambda.Function;
    public readonly userPool: UserPool;

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

            // Crear User Pool
            this.userPool = new UserPool(this, 'UnoUserPool', {
                userPoolName: 'uno-user-pool',
                selfSignUpEnabled: true,
                signInAliases: { email: true },
            });

            // Crear User Pool Client
            const userPoolClient = new UserPoolClient(this, 'UnoUserPoolClient', {
                userPool: this.userPool,
                generateSecret: false,
                    authFlows: {
                        userPassword: true, // Habilita USER_PASSWORD_AUTH
                    },
                    accessTokenValidity: cdk.Duration.hours(6), // Access Token válido por 6 horas
                    idTokenValidity: cdk.Duration.hours(6),    // ID Token válido por 6 horas
                    refreshTokenValidity: cdk.Duration.days(30),
            });

            // Lambda de Registro
            this.registerLambda = new lambda.Function(this, "RegisterLambda", {
                runtime: lambda.Runtime.NODEJS_18_X,
                handler: "register.handler", // Ruta del archivo y función
                code: lambda.Code.fromAsset('dist'),
                environment: {
                    COGNITO_APP_CLIENT_ID: userPoolClient.userPoolClientId, // Reemplaza con tu ID
                },
            });
        
            // Permisos IAM para Lambda Registro
            this.registerLambda.addToRolePolicy(
                new iam.PolicyStatement({
                effect: iam.Effect.ALLOW,
                actions: ["cognito-idp:SignUp"],
                resources: [this.userPool.userPoolArn], // Puedes especificar recursos específicos más adelante
                })
            );

            // Lambda de Login
            this.loginLambda = new lambda.Function(this, "LoginLambda", {
                runtime: lambda.Runtime.NODEJS_18_X,
                handler: "login.handler", // Ruta del archivo y función
                code: lambda.Code.fromAsset('dist'),
                environment: {
                    COGNITO_APP_CLIENT_ID: userPoolClient.userPoolClientId, // Reemplaza con tu ID
                    POOL_ID: this.userPool.userPoolId
                },
            });

            // Permisos para Lambda de Login
            this.loginLambda.addToRolePolicy(
                new iam.PolicyStatement({
                  effect: iam.Effect.ALLOW,
                  actions: [
                    "cognito-idp:InitiateAuth",
                    "cognito-idp:AdminInitiateAuth"
                  ],
                  resources: [
                    this.userPool.userPoolArn
                  ],
                })
            );

    }

}
