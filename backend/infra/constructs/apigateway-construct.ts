import * as apiGateway from '@aws-cdk/aws-apigatewayv2';
import * as cdk from '@aws-cdk/core';
import {DEPLOY_ENVIRONMENT, STACK_PREFIX} from '../constants';

export class HttpApiConstruct extends cdk.Construct {
  public readonly httpApi: apiGateway.HttpApi;

  constructor(scope: cdk.Construct, id: string) {
    super(scope, id);

    this.httpApi = new apiGateway.HttpApi(this, 'api', {
      description: `___${DEPLOY_ENVIRONMENT}___ Api for ${STACK_PREFIX}`,
      apiName: `${STACK_PREFIX}-api-${DEPLOY_ENVIRONMENT}`,
      corsPreflight: {
        allowHeaders: [
          'Content-Type',
          'X-Amz-Date',
          'Authorization',
          'X-Api-Key',
        ],
        allowMethods: [
          apiGateway.HttpMethod.OPTIONS,
          apiGateway.HttpMethod.GET,
          apiGateway.HttpMethod.POST,
          apiGateway.HttpMethod.PUT,
          apiGateway.HttpMethod.PATCH,
          apiGateway.HttpMethod.DELETE,
        ],
        allowCredentials: true,
        allowOrigins: ['http://localhost:3000'],
      },
    });
  }
}
