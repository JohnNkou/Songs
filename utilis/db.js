import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

export const client = new DynamoDBClient({ region:'us-east-1', endpoint:"http://localhost:8000" });
export const clientD = DynamoDBDocumentClient.from(client);