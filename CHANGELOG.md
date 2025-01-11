## [2025-01-11](https://github.com/OpenWorkspace-o1/aws-aurora-pgvector-serverless/pull/1)

### Added
- Introduced `process-env.d.ts` to define environment variables.
- Added `.env.example` and `.env.production.example` for environment configuration.

### Changed
- Updated `package.json` with new dependencies and peer dependencies:
  - Added `dotenv`, `cdk-nag`, and updated `aws-cdk-lib` to `2.175.1`.
  - Updated `@types/node` from `22.7.9` to `22.10.5`.
  - Updated `typescript` from `~5.6.3` to `~5.7.3`.
- Extended `tsconfig.json` with `@tsconfig/node22` and updated target to `ES2022`.