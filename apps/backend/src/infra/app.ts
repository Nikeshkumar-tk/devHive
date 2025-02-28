#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { DevHiveBackendStack } from './stack';
import { createResourceName } from '@dev-hive/aws';

const app = new cdk.App();

new DevHiveBackendStack(app, createResourceName('stack'), {
    env: {
        account: '933227355598',
        region: 'us-east-1',
    },
});
