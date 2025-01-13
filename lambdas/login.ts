import { APIGatewayProxyHandler } from "aws-lambda";
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  InitiateAuthRequest
} from "@aws-sdk/client-cognito-identity-provider";
import * as crypto from "crypto";

const parsear = (event: any)=>{
  if (typeof event.body === 'string') {
    try {
      return JSON.parse(event.body);
    } catch (error) {
      throw new Error('Invalid JSON');
    }
  }
  return event.body;
}

export const handler = async (event: any) => {
  try {

    const body = parsear(event)

    const clientId = process.env.COGNITO_APP_CLIENT_ID!;
    const poolId = process.env.POOL_ID!;
    const region = process.env.AWS_REGION || "us-east-1";

    const client = new CognitoIdentityProviderClient({ region });

    const input: InitiateAuthRequest = {
      AuthFlow: "USER_PASSWORD_AUTH",
      AuthParameters: {
        PASSWORD: body.password,
        USERNAME: body.email
      },
      ClientId: clientId,
    }

    const command = new InitiateAuthCommand(input)

    const response = await client.send(command)

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Login successful",
        idToken: response.AuthenticationResult?.IdToken,
        accessToken: response.AuthenticationResult?.AccessToken,
        refreshToken: response.AuthenticationResult?.RefreshToken,
        response
      }),
    };
  } catch (error) {
    console.error("Error during login:", error);

    return {
      statusCode: 401,
      body: JSON.stringify({
        message: "Invalid email or password",
        error: error || error,
      }),
    };
  }
};
