import * as apiGateway from '@aws-cdk/aws-apigatewayv2-alpha';
import * as apiGatewayIntegrations from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import {NodejsFunction} from 'aws-cdk-lib/aws-lambda-nodejs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import path from 'path';
import {DEPLOY_ENVIRONMENT, FRONTEND_BASE_URL, STACK_PREFIX} from './constants';

export class PresignedUrlStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const s3Bucket = new s3.Bucket(this, id, {
      cors: [
        {
          allowedMethods: [
            s3.HttpMethods.GET,
            s3.HttpMethods.POST,
            s3.HttpMethods.PUT,
          ],
          allowedOrigins: [FRONTEND_BASE_URL],
          allowedHeaders: ['*'],
        },
      ],
    });

    const httpApi = new apiGateway.HttpApi(this, 'api', {
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
          apiGateway.CorsHttpMethod.OPTIONS,
          apiGateway.CorsHttpMethod.GET,
          apiGateway.CorsHttpMethod.POST,
          apiGateway.CorsHttpMethod.PUT,
          apiGateway.CorsHttpMethod.PATCH,
          apiGateway.CorsHttpMethod.DELETE,
        ],
        allowCredentials: true,
        allowOrigins: [FRONTEND_BASE_URL],
      },
    });

    const getPresignedUrlFunction = new NodejsFunction(
      this,
      'get-presigned-url',
      {
        runtime: lambda.Runtime.NODEJS_16_X,
        memorySize: 1024,
        timeout: cdk.Duration.seconds(5),
        handler: 'main',
        entry: path.join(__dirname, '/../src/get-presigned-url-s3/index.ts'),
        environment: {BUCKET_NAME: s3Bucket.bucketName},
      },
    );

    s3Bucket.grantPut(getPresignedUrlFunction);
    s3Bucket.grantPutAcl(getPresignedUrlFunction);

    httpApi.addRoutes({
      path: '/get-presigned-url-s3',
      methods: [apiGateway.HttpMethod.GET],
      integration: new apiGatewayIntegrations.HttpLambdaIntegration(
        'get-url-integration',
        getPresignedUrlFunction,
      ),
    });

    new cdk.CfnOutput(this, 'region', {value: cdk.Stack.of(this).region});
    new cdk.CfnOutput(this, 'apiUrl', {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      value: httpApi.url!,
    });
    new cdk.CfnOutput(this, 'bucketName', {value: s3Bucket.bucketName});
  }
}
