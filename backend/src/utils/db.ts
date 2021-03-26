import {DynamoDB} from 'aws-sdk';

export const client = new DynamoDB.DocumentClient();

export const db = {
  get: (
    params: DynamoDB.DocumentClient.GetItemInput,
  ): Promise<DynamoDB.DocumentClient.GetItemOutput> =>
    client.get(params).promise(),
  put: (
    params: DynamoDB.DocumentClient.PutItemInput,
  ): Promise<DynamoDB.DocumentClient.PutItemOutput> =>
    client.put(params).promise(),
  query: (
    params: DynamoDB.DocumentClient.QueryInput,
  ): Promise<DynamoDB.DocumentClient.QueryOutput> =>
    client.query(params).promise(),
  update: (
    params: DynamoDB.DocumentClient.UpdateItemInput,
  ): Promise<DynamoDB.DocumentClient.UpdateItemOutput> =>
    client.update(params).promise(),
  delete: (
    params: DynamoDB.DocumentClient.DeleteItemInput,
  ): Promise<DynamoDB.DocumentClient.DeleteItemOutput> =>
    client.delete(params).promise(),
  scan: (
    params: DynamoDB.DocumentClient.ScanInput,
  ): Promise<DynamoDB.DocumentClient.ScanOutput> =>
    client.scan(params).promise(),
};
