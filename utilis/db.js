import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const dynamoEndpoint = process.env.DYNAMODB_ENDPOINT,
endpoint = (dynamodEndpoint)? `https://${dynamoEndpoint}`:'http://localhost:8000';

export const client = new DynamoDBClient({ region:'us-east-1', endpoint });
export const clientD = DynamoDBDocumentClient.from(client);