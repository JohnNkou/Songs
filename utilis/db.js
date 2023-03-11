import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const dynamoEndpoint = process.env.DYNAMODB_ENDPOINT,
endpoint = (dynamoEndpoint)? `https://${dynamoEndpoint}`:'http://localhost:8000';

const options = {
	getClient:()=> new DynamoDBClient({ region:'us-east-1', endpoint})
	,
	getClientD:(client)=> DynamoDBDocumentClient.from(client)
	
};

export default options