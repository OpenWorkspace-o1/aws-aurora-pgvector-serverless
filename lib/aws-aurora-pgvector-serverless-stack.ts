import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AwsAuroraPgvectorServerlessStackProps } from './AwsAuroraPgvectorServerlessStackProps';
import { AwsAuroraPgvectorServerlessNestedStack } from './constructs/aws-aurora-serverless-nested-stack';
import { AwsAuroraDDLSourceRDSNestedStack } from './constructs/aws-aurora-ddl-source-rds-nested-stack';
import { AwsAuroraDdlTriggerNestedStack } from './constructs/aws-aurora-ddl-trigger-nested-stack';
import { parseLambdaArchitectureFromEnv } from '../utils/lambda-architect-parser';

export class AwsAuroraPgvectorServerlessStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: AwsAuroraPgvectorServerlessStackProps) {
    super(scope, id, props);
    const awsAuroraDdlTriggerNestedStack = new AwsAuroraDdlTriggerNestedStack(this, `${props.resourcePrefix}-Aurora-DDL-Trigger-Nested-Stack`, {
      ...props,
      lambdaArchitecture: parseLambdaArchitectureFromEnv(),
    });

    const awsAuroraPgvectorServerlessNestedStack = new AwsAuroraPgvectorServerlessNestedStack(this, `${props.resourcePrefix}-Aurora-Serverless-Nested-Stack`, props);
    const awsAuroraDDLSourceRDSNestedStack = new AwsAuroraDDLSourceRDSNestedStack(this, `${props.resourcePrefix}-Aurora-DDL-Source-RDS-Nested-Stack`, {
      ...props,
      clusterIdentifier: awsAuroraPgvectorServerlessNestedStack.clusterIdentifier
    });
  }
}
