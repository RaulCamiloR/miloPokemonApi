import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export class UnoLambdaStack extends cdk.Stack {

  public readonly getPokemonLambda: lambda.Function;
  public readonly postPokemonLambda: lambda.Function;
  public readonly getOnePokemonLamdba: lambda.Function;
  public readonly updatePokemonLamdba: lambda.Function;
  public readonly deletePokemonLamdba: lambda.Function;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const table = dynamodb.Table.fromTableName(this, 'PokemonTable', 'PokemonDatabase');

    this.getPokemonLambda = new lambda.Function(this, 'GetPokemonLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'getPokemon.handler', // Archivo y función definidos en la carpeta "lambdas"
      code: lambda.Code.fromAsset('dist'),
      environment: {
        TABLE_NAME: 'PokemonDatabase', // Pasar el nombre de la tabla como variable de entorno
      },
    });

    table.grantReadData(this.getPokemonLambda)

    this.postPokemonLambda = new lambda.Function(this, 'PostPokemonLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'postPokemon.handler', // Archivo y función definidos en la carpeta "lambdas"
      code: lambda.Code.fromAsset('dist'),
      environment: {
        TABLE_NAME: 'PokemonDatabase', // Pasar el nombre de la tabla como variable de entorno
      },
    });

    table.grantReadWriteData(this.postPokemonLambda)

    this.getOnePokemonLamdba = new lambda.Function(this, 'GetOnePokemonLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'getPokemonById.handler', // Archivo y función definidos en la carpeta "lambdas"
      code: lambda.Code.fromAsset('dist'),
      environment: {
        TABLE_NAME: 'PokemonDatabase', // Pasar el nombre de la tabla como variable de entorno
      },
    });

    table.grantReadData(this.getOnePokemonLamdba)

    this.updatePokemonLamdba = new lambda.Function(this, 'UpdatePokemonLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'updatePokemon.handler', // Archivo y función definidos en la carpeta "lambdas"
      code: lambda.Code.fromAsset('dist'),
      environment: {
        TABLE_NAME: 'PokemonDatabase', // Pasar el nombre de la tabla como variable de entorno
      },
    });

    table.grantReadWriteData(this.updatePokemonLamdba)

    this.deletePokemonLamdba = new lambda.Function(this, 'DeletePokemonLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'deletePokemon.handler', // Archivo y función definidos en la carpeta "lambdas"
      code: lambda.Code.fromAsset('dist'),
      environment: {
        TABLE_NAME: 'PokemonDatabase', // Pasar el nombre de la tabla como variable de entorno
      },
    });

    table.grantReadWriteData(this.deletePokemonLamdba)

  }
}
