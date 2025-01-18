import * as lambda from 'aws-cdk-lib/aws-lambda';

export const parseLambdaArchitectureFromEnv = (): lambda.Architecture => {
    const architecture = process.env.ARCHITECTURE;
    if (!architecture) {
        throw new Error('ARCHITECTURE is not set.');
    }
    if (architecture === 'ARM_64') {
        return lambda.Architecture.ARM_64;
    }
    return lambda.Architecture.X86_64;
};
