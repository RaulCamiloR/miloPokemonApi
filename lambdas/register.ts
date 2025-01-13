import { APIGatewayProxyHandler } from "aws-lambda";
import { CognitoIdentityProviderClient, SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import * as crypto from "crypto";

export const handler: APIGatewayProxyHandler = async (event) => {
  const { email, password } = JSON.parse(event.body || "{}");

  if (!email || !password) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Email and password are required" }),
    };
  }

  const clientId = process.env.COGNITO_APP_CLIENT_ID!;

  // Crear cliente de Cognito
  const client = new CognitoIdentityProviderClient({ region: "us-east-1" });

  // Configurar los parámetros de entrada
  const input = {
    ClientId: clientId,
    Username: email,
    Password: password,
    UserAttributes: [{ Name: "email", Value: email }],
  };

  try {
    // Crear y enviar el comando
    const command = new SignUpCommand(input);
    const response = await client.send(command);

    return {
      statusCode: 201,
      body: JSON.stringify({ message: "User registered successfully", data: response }),
    };
  } catch (error) {
    console.error("Error during user registration:", error);

    return {
      statusCode: 400,
      body: JSON.stringify({
        message: error || "Failed to register user",
        details: error,
      }),
    };
  }
};
