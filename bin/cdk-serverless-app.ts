#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { UserStack } from '../lib/user-stack';

const app = new cdk.App();
new UserStack(app, 'UserStack');
