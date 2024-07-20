import { Handler, APIGatewayEvent } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { emailRegex } from './regex';

export const handler: Handler = async (event: APIGatewayEvent) => {
  const email: string = JSON.parse(event.body!).email;

  if (!emailRegex.test(email)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid email' }),
    };
  }

  const client = new DynamoDBClient({});

  const command = new DeleteCommand({
    TableName: 'subscription',
    Key: {
      email,
    },
  });

  try {
    await client.send(command);
    return {
      statusCode: 204,
    };
  } catch (error) {
    console.error('Fail');
    console.error(error);
    return {
      statusCode: 500,
    };
  }
};
