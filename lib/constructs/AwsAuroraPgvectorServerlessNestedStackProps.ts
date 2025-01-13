import { NestedStackProps } from "aws-cdk-lib";
import { AuroraEngine, AwsAuroraPgvectorServerlessBaseStackProps } from "../AwsAuroraPgvectorServerlessStackProps";
import { DBClusterStorageType } from "aws-cdk-lib/aws-rds";
import { ClusterScailabilityType } from "aws-cdk-lib/aws-rds";

export interface AwsAuroraPgvectorServerlessNestedStackProps extends NestedStackProps, AwsAuroraPgvectorServerlessBaseStackProps {
    /** Aurora database engine type */
    readonly auroraEngine: AuroraEngine;
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
    readonly clusterScailabilityType: ClusterScailabilityType;
}
