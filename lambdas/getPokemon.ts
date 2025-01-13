import { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

// Inicializar el cliente DynamoDB
const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

// Obtener el nombre de la tabla desde las variables de entorno
const TABLE_NAME = process.env.TABLE_NAME;

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    if (!TABLE_NAME) {
      throw new Error("El nombre de la tabla no está definido en TABLE_NAME");
    }

    // Ejecutar el comando Scan para obtener todos los Pokémon
    const params = {
      TableName: TABLE_NAME,
    };

    const result = await ddbDocClient.send(new ScanCommand(params));

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Pokémon recuperados exitosamente",
        data: result.Items || [],
        event
      }),
    };
  } catch (error) {
    console.error("Error al obtener los Pokémon:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error al obtener los Pokémon",
        error: error
      }),
    };
  }
};
