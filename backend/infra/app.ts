#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import 'source-map-support/register';
import {DEPLOY_ENVIRONMENT, DEPLOY_REGION, STACK_PREFIX} from './constants';
import {PresignedUrlStack} from './presigned-url-stack';

const app = new cdk.App();

// DEV Stack
new PresignedUrlStack(app, `${STACK_PREFIX}-${DEPLOY_ENVIRONMENT}`, {
  stackName: `${STACK_PREFIX}-${DEPLOY_ENVIRONMENT}`,
  env: {
    region: DEPLOY_REGION,
  },
  tags: {
    env: 'dev',
  },
});
