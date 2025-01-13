import { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
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

    // Obtener el ID y los datos a actualizar
    const id = event.pathParameters?.id;
    const body = JSON.parse(event.body || "{}");
    const { nombre, tipo } = body;

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "El ID del Pokémon es obligatorio",
        }),
      };
    }

    if (!nombre && !tipo) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Se debe proporcionar al menos un campo para actualizar (nombre o tipo)",
        }),
      };
    }

    // Construir los parámetros para el comando Update
    const updateExpression: string[] = [];
    const expressionAttributeNames: { [key: string]: string } = {};
    const expressionAttributeValues: { [key: string]: any } = {};

    if (nombre) {
      updateExpression.push("#nombre = :nombre");
      expressionAttributeNames["#nombre"] = "nombre";
      expressionAttributeValues[":nombre"] = nombre;
    }

    if (tipo) {
      updateExpression.push("#tipo = :tipo");
      expressionAttributeNames["#tipo"] = "tipo";
      expressionAttributeValues[":tipo"] = tipo;
    }

    const params = {
      TableName: TABLE_NAME,
      Key: { id },
      UpdateExpression: `SET ${updateExpression.join(", ")}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
    };

    await ddbDocClient.send(new UpdateCommand(params));

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Pokémon actualizado exitosamente",
      }),
    };
  } catch (error) {
    console.error("Error al actualizar el Pokémon:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error al actualizar el Pokémon",
        error: error,
      }),
    };
  }
};
