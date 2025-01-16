import { StackProps } from "aws-cdk-lib";
import { ClusterScalabilityType, DBClusterStorageType } from "aws-cdk-lib/aws-rds";

export interface AwsAuroraPgvectorServerlessBaseStackProps {
    /** Resource prefix for all AWS resources */
    readonly resourcePrefix: string;
    /** AWS region where resources will be deployed */
    readonly deployRegion: string | undefined;
    /** Deployment environment (e.g., development, staging, production) */
    readonly deployEnvironment: string;
    /** Name of the application */
    readonly appName: string;
    /** Type of VPC subnet (e.g., public, private) */
    readonly vpcSubnetType: string;
    /** Owner or team responsible for the resources */
    readonly owner: string;
    /** ID of the VPC where resources will be deployed */
    readonly vpcId: string;
    /** List of private subnet IDs in the VPC */
    readonly vpcPrivateSubnetIds: string[];
    /** List of Availability Zones for private subnets */
    readonly vpcPrivateSubnetAzs: string[];
    /** List of route table IDs for private subnets */
    readonly vpcPrivateSubnetRouteTableIds: string[];
}

export interface AwsAuroraPgvectorServerlessStackProps extends StackProps, AwsAuroraPgvectorServerlessBaseStackProps {
    /** Maximum capacity units for Aurora Serverless v2 */
    readonly serverlessV2MaxCapacity: number;
    /** Minimum capacity units for Aurora Serverless v2 */
    readonly serverlessV2MinCapacity: number;
    /** Username for RDS database access */
    readonly rdsUsername: string;
    /** Password for RDS database access */
    readonly rdsPassword: string;
    /** Name of the default database to be created */
    readonly defaultDatabaseName: string;
    /** Storage type for the Aurora cluster */
    readonly storageType: DBClusterStorageType;
    /** Enhanced monitoring interval in minutes */
    readonly monitoringInterval: number;
    /** Type of cluster scalability configuration */
    readonly clusterScalabilityType: ClusterScalabilityType;
}
