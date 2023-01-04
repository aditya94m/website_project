#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { UserStack } from '../lib/user-stack';
import { OrderStack } from '../lib/order-stack';

const app = new cdk.App();
new UserStack(app, 'UserStack');
new OrderStack(app, 'OrderStack');