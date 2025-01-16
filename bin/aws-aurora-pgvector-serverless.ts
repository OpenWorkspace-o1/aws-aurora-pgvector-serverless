#!/usr/bin/env node
import 'source-map-support/register';

import * as cdk from 'aws-cdk-lib';
import * as dotenv from 'dotenv';
import { checkEnvVariables } from '../utils/check-environment-variable';

import { ApplyTags } from '../utils/apply-tag';
import { Aspects } from 'aws-cdk-lib';
import { AwsSolutionsChecks } from 'cdk-nag';
import { AwsAuroraPgvectorServerlessStack } from '../lib/aws-aurora-pgvector-serverless-stack';
import { AwsAuroraPgvectorServerlessStackProps } from '../lib/AwsAuroraPgvectorServerlessStackProps';
import { parseStorageTypeFromEnv } from '../utils/storage-type-parser';
import { parseClusterScalabilityTypeFromEnv } from '../utils/cluster-scalability-parser';

dotenv.config(); // Load environment variables from .env file
const app = new cdk.App();

const appAspects = Aspects.of(app);

// check APP_NAME variable
checkEnvVariables('APP_NAME',
    'CDK_DEPLOY_REGION',
    'ENVIRONMENT',
    'VPC_SUBNET_TYPE',
    'VPC_PRIVATE_SUBNET_IDS',
    'VPC_PRIVATE_SUBNET_AZS',
    'VPC_PRIVATE_SUBNET_ROUTE_TABLE_IDS',
    'OWNER',
    'VPC_ID',
    'SERVERLESS_V2_MAX_CAPACITY',
    'SERVERLESS_V2_MIN_CAPACITY',
    'RDS_USERNAME',
    'RDS_PASSWORD',
    'DEFAULT_DATABASE_NAME',
    'STORAGE_TYPE',
    'MONITORING_INTERVAL',
    'CLUSTER_SCALABILITY_TYPE',
);

const { CDK_DEFAULT_ACCOUNT: account } = process.env;

const cdkRegion = process.env.CDK_DEPLOY_REGION;
const deployEnvironment = process.env.ENVIRONMENT!;

const appName = process.env.APP_NAME!;
const owner = process.env.OWNER!;

// check best practices based on AWS Solutions Security Matrix
appAspects.add(new AwsSolutionsChecks());

appAspects.add(new ApplyTags({
    environment: deployEnvironment as 'development' | 'staging' | 'production' | 'feature',
    project: appName,
    owner: owner,
}));

const stackProps: AwsAuroraPgvectorServerlessStackProps = {
    resourcePrefix: `${appName}-${deployEnvironment}`,
    env: {
        region: cdkRegion,
        account,
    },
    deployRegion: cdkRegion,
    deployEnvironment,
    appName,
    vpcSubnetType: process.env.VPC_SUBNET_TYPE!,
    owner,
    vpcId: process.env.VPC_ID!,
    vpcPrivateSubnetIds: process.env.VPC_PRIVATE_SUBNET_IDS!.split(','),
    vpcPrivateSubnetAzs: process.env.VPC_PRIVATE_SUBNET_AZS!.split(','),
    vpcPrivateSubnetRouteTableIds: process.env.VPC_PRIVATE_SUBNET_ROUTE_TABLE_IDS!.split(','),
    serverlessV2MaxCapacity: Number(process.env.SERVERLESS_V2_MAX_CAPACITY!),
    serverlessV2MinCapacity: Number(process.env.SERVERLESS_V2_MIN_CAPACITY!),
    rdsUsername: process.env.RDS_USERNAME!,
    rdsPassword: process.env.RDS_PASSWORD!,
    defaultDatabaseName: process.env.DEFAULT_DATABASE_NAME!,
    storageType: parseStorageTypeFromEnv(),
    monitoringInterval: Number(process.env.MONITORING_INTERVAL!),
    clusterScalabilityType: parseClusterScalabilityTypeFromEnv(),
};
new AwsAuroraPgvectorServerlessStack(app, `AwsAuroraPgvectorServerlessStack`, {
    ...stackProps,
    stackName: `${deployEnvironment}-AwsAuroraPgvectorServerlessStack`,
    description: `AwsAuroraPgvectorServerlessStack for ${appName} in ${cdkRegion} ${deployEnvironment}.`,
});

app.synth();
