import { AwsAuroraPgvectorServerlessBaseStackProps } from './../AwsAuroraPgvectorServerlessStackProps';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import path = require("path");
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';

export interface AwsAuroraDDLSourceRDSNestedStackProps extends cdk.NestedStackProps, AwsAuroraPgvectorServerlessBaseStackProps {
  /**
     * Identifier for the cluster
     */
  readonly clusterIdentifier: string;
}

export class AwsAuroraDDLSourceRDSNestedStack extends cdk.NestedStack {
  readonly sourceS3Bucket: s3.Bucket;

  constructor(scope: Construct, id: string, props: AwsAuroraDDLSourceRDSNestedStackProps) {
    super(scope, id, props);

    // create S3 bucket to host DDL file
    const ddlSourceBucket = new s3.Bucket(this, `${props.resourcePrefix}-ddl-source-bucket`, {
      bucketName: `${props.resourcePrefix}-ddl-source-${props.clusterIdentifier}`
    });
    this.sourceS3Bucket = ddlSourceBucket;

    // create s3 bucket deployment to upload the DDL file
    new s3deploy.BucketDeployment(this, `${props.resourcePrefix}-deploy-ddl-source-rds`, {
        sources: [s3deploy.Source.asset(path.join(__dirname, "../scripts/rds-ddl-sql"))],
        destinationBucket: ddlSourceBucket
    });
  }
}
