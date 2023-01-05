#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { UserStack } from '../lib/user-stack';
import { OrderStack } from '../lib/order-stack';
import { FoodStack } from '../lib/food-stack';

const app = new cdk.App();
new UserStack(app, 'UserStack');
new OrderStack(app, 'OrderStack');
new FoodStack(app, 'FoodStack');