import * as apiGateway from '@aws-cdk/aws-apigatewayv2';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import {HttpApiConstruct} from './constructs/apigateway-construct';
import {DynamodbTableConstruct} from './constructs/dynamodb-construct';
import {EndpointConstruct} from './constructs/endpoint-construct';
import {LambdaLayerConstruct} from './constructs/lambda-layer-construct';

export class TypescriptLambdaStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const {httpApi} = new HttpApiConstruct(this, 'http-api');

    const {table: todosTable} = new DynamodbTableConstruct(
      this,
      'todos-table',
      {partitionKey: {name: 'id', type: dynamodb.AttributeType.STRING}},
    );

    const {layer: yupValidationLayer} = new LambdaLayerConstruct(this, 'yup', {
      code: lambda.Code.fromAsset('src/layers/yup-utils'),
      description:
        'Validating user request information using the `yup` library',
    });

    new EndpointConstruct(this, 'create-todo', {
      httpApi,
      dynamo: {table: todosTable, permissions: ['dynamodb:PutItem']},
      methods: [apiGateway.HttpMethod.POST],
      routePath: '/todos',
      assetPath: 'create-todo/index.ts',
      layers: [yupValidationLayer],
      externalModules: ['yup'],
      environment: {TABLE_NAME: todosTable.tableName},
    });

    new EndpointConstruct(this, 'list-todos', {
      httpApi,
      dynamo: {table: todosTable, permissions: ['dynamodb:Scan']},
      methods: [apiGateway.HttpMethod.GET],
      routePath: '/todos',
      assetPath: 'list-todos/index.ts',
      environment: {TABLE_NAME: todosTable.tableName},
    });

    new cdk.CfnOutput(this, 'region', {value: cdk.Stack.of(this).region});
    new cdk.CfnOutput(this, 'apiUrl', {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      value: httpApi.url!,
    });
    new cdk.CfnOutput(this, 'tableName', {value: todosTable.tableName});
  }
}
