import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Table, AttributeType, BillingMode } from 'aws-cdk-lib/aws-dynamodb';

export class UnoDatabaseStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

        // Crear una tabla DynamoDB para Pokémon
        const pokemonsTable = new Table(this, 'PokemonsTable', {
            partitionKey: { name: 'id', type: AttributeType.STRING },
            billingMode: BillingMode.PROVISIONED,
            readCapacity: 1, // Capacidad mínima de lectura (RCU)
            writeCapacity: 1, // Capacidad mínima de escritura (WCU)
            tableName: 'PokemonDatabase',
            removalPolicy: cdk.RemovalPolicy.DESTROY, // Eliminar en desarrollo para pruebas
          });
          
      
          // Output del nombre de la tabla
        new cdk.CfnOutput(this, 'PokemonsTableNameOutput', {
            value: pokemonsTable.tableName,
            description: 'El nombre de la tabla DynamoDB para Pokémon',
        });

  }
}
