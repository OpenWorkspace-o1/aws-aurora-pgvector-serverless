import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AwsAuroraPgvectorServerlessStackProps } from './AwsAuroraPgvectorServerlessStackProps';
import { AwsAuroraPgvectorServerlessNestedStack } from './constructs/aws-aurora-serverless-nested-stack';

export class AwsAuroraPgvectorServerlessStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: AwsAuroraPgvectorServerlessStackProps) {
    super(scope, id, props);

    const awsAuroraPgvectorServerlessNestedStack = new AwsAuroraPgvectorServerlessNestedStack(this, `${props.resourcePrefix}-Aurora-Serverless-Nested-Stack`, props);
  }
}
