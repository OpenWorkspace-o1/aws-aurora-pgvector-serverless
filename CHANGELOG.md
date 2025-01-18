## [2025-01-18] [PR#10](https://github.com/OpenWorkspace-o1/aws-aurora-pgvector-serverless/pull/10)

### Added
- Added `AwsAuroraDdlTriggerNestedStack` to handle RDS DDL triggers.
- Implemented `rdsDdlTriggerFn` and `rdsDdlClusterTriggerFn` Lambda functions for RDS instance and cluster creation events.
- Configured EventBridge rules for `CreateDBInstance` and `CreateDBCluster` events.
- Added `@aws-cdk/aws-lambda-python-alpha` dependency for Python Lambda support.

## [2025-01-18] [PR#8](https://github.com/OpenWorkspace-o1/aws-aurora-pgvector-serverless/pull/8)

### Added
- Added `ARCHITECTURE` environment variable and `parseLambdaArchitectureFromEnv` utility for Lambda architecture configuration.
- Enhanced Aurora Serverless stack with `instanceUpdateBehaviour`, `port`, and `subnetGroup` configurations.

### Changed
- Updated stack naming convention to include `owner` and `deployEnvironment`.
- Improved deletion protection and monitoring role configuration for production environments.

## [2025-01-16] [PR#6](https://github.com/OpenWorkspace-o1/aws-aurora-pgvector-serverless/pull/6)

### Changed
- Removed `AURORA_ENGINE` configuration and hardcoded PostgreSQL support.
- Simplified stack naming by removing region from `stackName`.
- Updated monitoring role configuration and interval to seconds.

### Added
- Added `AwsAuroraDDLSourceRDSNestedStack` for DDL script deployment via S3.
- Improved parsing for `clusterScalabilityType` and `storageType`.

## [2025-01-11] [PR#3](https://github.com/OpenWorkspace-o1/aws-aurora-pgvector-serverless/pull/3)

### Added
- Introduced `AwsAuroraPgvectorServerlessStack` for deploying Aurora Serverless v2 with PostgreSQL and MySQL support.
- Added `AwsAuroraPgvectorServerlessStackProps` interface for stack configuration, including VPC, subnets, and database credentials.
- Implemented utility functions for environment variable validation and parsing.
- Added tagging and best-practice checks using `ApplyTags` and `AwsSolutionsChecks`.

## [2025-01-11] [PR#1](https://github.com/OpenWorkspace-o1/aws-aurora-pgvector-serverless/pull/1)

### Added
- Introduced `process-env.d.ts` to define environment variables.
- Added `.env.example` and `.env.production.example` for environment configuration.

### Changed
- Updated `package.json` with new dependencies and peer dependencies:
  - Added `dotenv`, `cdk-nag`, and updated `aws-cdk-lib` to `2.175.1`.
  - Updated `@types/node` from `22.7.9` to `22.10.5`.
  - Updated `typescript` from `~5.6.3` to `~5.7.3`.
- Extended `tsconfig.json` with `@tsconfig/node22` and updated target to `ES2022`.
