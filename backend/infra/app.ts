#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import 'source-map-support/register';
import {DEPLOY_ENVIRONMENT, DEPLOY_REGION, STACK_PREFIX} from './constants';
import {TypescriptLambdaStack} from './typescript-lamba-stack';

const app = new cdk.App();

// DEV Stack
new TypescriptLambdaStack(app, `${STACK_PREFIX}-${DEPLOY_ENVIRONMENT}`, {
  stackName: `${STACK_PREFIX}-${DEPLOY_ENVIRONMENT}`,
  env: {
    region: DEPLOY_REGION,
  },
  tags: {
    env: 'dev',
  },
});
