import { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

// Inicializar el cliente DynamoDB
const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME; 

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    // Validar y parsear los datos del cuerpo de la solicitud
    const body = JSON.parse(event.body || "{}");
    const { id, nombre, tipo } = body;

    if (!id || !nombre || !tipo) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Faltan campos obligatorios: id, nombre, tipo",
        }),
      };
    }

    // Guardar el Pokémon en DynamoDB
    const params = {
      TableName: TABLE_NAME,
      Item: { id, nombre, tipo },
    };

    await ddbDocClient.send(new PutCommand(params));

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Pokémon guardado exitosamente",
        data: { id, nombre, tipo },
      }),
    };
  } catch (error) {
    console.error("Error al guardar el Pokémon:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error al guardar el Pokémon",
        error: error,
      }),
    };
  }
};
