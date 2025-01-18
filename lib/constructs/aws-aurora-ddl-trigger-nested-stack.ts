import * as cdk from 'aws-cdk-lib';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as path from 'path';
import { Construct } from 'constructs';
import { AwsAuroraPgvectorServerlessBaseStackProps } from '../AwsAuroraPgvectorServerlessStackProps';
import { PythonFunction } from '@aws-cdk/aws-lambda-python-alpha';

export interface AwsAuroraDdlTriggerNestedStackProps extends cdk.NestedStackProps, AwsAuroraPgvectorServerlessBaseStackProps {
    readonly lambdaArchitecture: lambda.Architecture;
}

export class AwsAuroraDdlTriggerNestedStack extends cdk.NestedStack {
    public readonly rdsDdlTriggerQueue: sqs.Queue;

    constructor(scope: Construct, id: string, props: AwsAuroraDdlTriggerNestedStackProps) {
        super(scope, id, props);

        // Queue for triggering initialization (DDL deployment) of RDS
        const rdsDdlDetectionQueue = new sqs.Queue(this, `${props.resourcePrefix}-rdsDdlDetectionQueue`, {
            queueName: `${props.resourcePrefix}-rdsDdlDetectionQueue`,
            visibilityTimeout: cdk.Duration.minutes(6),
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });
        this.rdsDdlTriggerQueue = rdsDdlDetectionQueue;

        // Function that gets triggered on the creation of an RDS cluster
        const rdsDdlTriggerFn = new PythonFunction(this, `${props.resourcePrefix}-rdsDdlTriggerFn`, {
            functionName: `${props.resourcePrefix}-rdsDdlTriggerFn`,
            runtime: cdk.aws_lambda.Runtime.PYTHON_3_13,
            entry: path.join(__dirname, '../../src/lambdas/rds-ddl-trigger'),
            handler: "handler",
            architecture: props.lambdaArchitecture,
            memorySize: 1024,
            timeout: cdk.Duration.seconds(60), // 60 seconds
            logGroup: new cdk.aws_logs.LogGroup(this, `${props.resourcePrefix}-rdsDdlTriggerFn-LogGroup`, {
                logGroupName: `${props.resourcePrefix}-rdsDdlTriggerFn-LogGroup`,
                removalPolicy: cdk.RemovalPolicy.DESTROY,
                retention: cdk.aws_logs.RetentionDays.ONE_WEEK,
            }),
            environment: {
                RDS_DDL_QUEUE_URL: rdsDdlDetectionQueue.queueUrl,
            },
        });
        rdsDdlTriggerFn.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

        // give permission to the function to be able to send messages to the queues
        rdsDdlDetectionQueue.grantSendMessages(rdsDdlTriggerFn);

        //  creates an EventBridge rule that triggers when an RDS database instance is created in AWS, specifically monitoring for the CreateDBInstance API action call recorded in CloudTrail
        const eventBridgeCreateDBRule = new events.Rule(this, `${props.resourcePrefix}-EventBridge-Create-DB-Rule`, {
            eventPattern: {
                source: ["aws.rds"],
                detail: {
                    eventSource: ["rds.amazonaws.com"],
                    eventName: ["CreateDBInstance"]
                },
            },
        });

        // Invoke the rdsDdlTriggerFn upon a matching event
        eventBridgeCreateDBRule.addTarget(new targets.LambdaFunction(rdsDdlTriggerFn));

        // Function that gets triggered on the creation of an RDS cluster
        const rdsDdlClusterTriggerFn = new PythonFunction(this, `${props.resourcePrefix}-rdsDdlClusterTriggerFn`, {
            functionName: `${props.resourcePrefix}-rdsDdlClusterTriggerFn`,
            runtime: cdk.aws_lambda.Runtime.PYTHON_3_13,
            entry: path.join(__dirname, '../../src/lambdas/rds-ddl-cluster-trigger'),
            handler: "handler",
            architecture: props.lambdaArchitecture,
            memorySize: 1024,
            timeout: cdk.Duration.seconds(60), // 60 seconds
            logGroup: new cdk.aws_logs.LogGroup(this, `${props.resourcePrefix}-rdsDdlClusterTriggerFn-LogGroup`, {
                logGroupName: `${props.resourcePrefix}-rdsDdlClusterTriggerFn-LogGroup`,
                removalPolicy: cdk.RemovalPolicy.DESTROY,
                retention: cdk.aws_logs.RetentionDays.ONE_WEEK,
            }),
            environment: {
                RDS_DDL_QUEUE_URL: rdsDdlDetectionQueue.queueUrl,
            },
        });
        rdsDdlClusterTriggerFn.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

        // give permission to the function to be able to send messages to the queues
        rdsDdlDetectionQueue.grantSendMessages(rdsDdlClusterTriggerFn);

        // creates an EventBridge rule that triggers when an RDS database instance is created in AWS, specifically monitoring for the CreateDBCluster API action  call recorded in CloudTrail
        const eventBridgeCreateDBClusterRule = new events.Rule(this, `${props.resourcePrefix}-EventBridge-Create-DB-Cluster-Rule`, {
            eventPattern: {
                source: ["aws.rds"],
                detail: {
                    eventSource: ["rds.amazonaws.com"],
                    eventName: ["CreateDBCluster"]
                },
            },
        });
        // Invoke the rdsDdlTriggerFn upon a matching event
        eventBridgeCreateDBClusterRule.addTarget(new targets.LambdaFunction(rdsDdlClusterTriggerFn));
    }
}
