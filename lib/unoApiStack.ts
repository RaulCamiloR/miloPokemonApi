import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { UserPool } from 'aws-cdk-lib/aws-cognito';
import { CognitoUserPoolsAuthorizer } from 'aws-cdk-lib/aws-apigateway';

interface LambdaFunctions {
  getPokemonLambda: lambda.Function,
  postPokemonLambda: lambda.Function,
  getOnePokemonLambda: lambda.Function,
  updatePokemonLambda: lambda.Function,
  deletePokemonLambda: lambda.Function
}

interface AuthFunctions {
  registerLambda: lambda.Function,
  loginLambda: lambda.Function,
  userPool: UserPool
}

export class UnoApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, lambdas: LambdaFunctions, authFunctions: AuthFunctions, props?: cdk.StackProps) {
    super(scope, id, props);

        // Crear la API Gateway
        const api = new apigateway.RestApi(this, 'PokemonApi', {
          restApiName: 'Pokemon Service',
        });

        // Configurar Authorizer con Cognito
        const authorizer = new CognitoUserPoolsAuthorizer(this, 'PokemonApiAuthorizer', {
          cognitoUserPools: [authFunctions.userPool],
          identitySource: "method.request.header.token"
        });

        // Asociar el authorizer al API Gateway
        authorizer._attachToApi(api);

        const authOptions = {
          authorizationType: apigateway.AuthorizationType.COGNITO,
          authorizer,
        }
    
        // Ruta GET para /pokemon
        const pokemons = api.root.addResource('pokemon');
        pokemons.addMethod('GET', new apigateway.LambdaIntegration(lambdas.getPokemonLambda), authOptions);
        pokemons.addMethod('POST', new apigateway.LambdaIntegration(lambdas.postPokemonLambda), authOptions);

        // Ruta GET para /pokemon/{id}
        const pokemonById = pokemons.addResource('{id}');
        pokemonById.addMethod('GET', new apigateway.LambdaIntegration(lambdas.getOnePokemonLambda), authOptions);
        pokemonById.addMethod('PUT', new apigateway.LambdaIntegration(lambdas.updatePokemonLambda), authOptions);
        pokemonById.addMethod('DELETE', new apigateway.LambdaIntegration(lambdas.deletePokemonLambda), authOptions);

        const register = api.root.addResource('register');
        register.addMethod('POST', new apigateway.LambdaIntegration(authFunctions.registerLambda));
        
        const login = api.root.addResource('login');
        login.addMethod('POST', new apigateway.LambdaIntegration(authFunctions.loginLambda));
  }
}

// UnoAuthStack-RegisterLambda5E35AF61-SHO4pbel4HfF