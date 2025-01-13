import { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";
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

    // Obtener el ID del parámetro de la ruta
    const id = event.pathParameters?.id;

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "El ID del Pokémon es obligatorio",
        }),
      };
    }

    // Ejecutar el comando Delete para eliminar el Pokémon
    const params = {
      TableName: TABLE_NAME,
      Key: { id },
    };

    await ddbDocClient.send(new DeleteCommand(params));

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Pokémon eliminado exitosamente",
      }),
    };
  } catch (error) {
    console.error("Error al eliminar el Pokémon:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error al eliminar el Pokémon",
        error: error,
      }),
    };
  }
};
