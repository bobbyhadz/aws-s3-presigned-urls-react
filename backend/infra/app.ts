#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import 'source-map-support/register';
import {DEPLOY_ENVIRONMENT, DEPLOY_REGION, STACK_PREFIX} from './constants';
import {PresgiendUrlStack} from './presigned-url-stack';

const app = new cdk.App();

// DEV Stack
new PresgiendUrlStack(app, `${STACK_PREFIX}-${DEPLOY_ENVIRONMENT}`, {
  stackName: `${STACK_PREFIX}-${DEPLOY_ENVIRONMENT}`,
  env: {
    region: DEPLOY_REGION,
  },
  tags: {
    env: 'dev',
  },
});
