import { ClusterScalabilityType } from "aws-cdk-lib/aws-rds";

export const parseClusterScalabilityTypeFromEnv = (): ClusterScalabilityType => {
    const clusterScalabilityType = process.env.CLUSTER_SCALABILITY_TYPE;
    if (!clusterScalabilityType) {
        throw new Error('CLUSTER_SCALABILITY_TYPE is not set');
    }
    const clusterScalabilityTypeLower = clusterScalabilityType.toLocaleLowerCase();
    const acceptedValues = [ClusterScalabilityType.STANDARD.toString(), ClusterScalabilityType.LIMITLESS.toString()];
    console.log(`acceptedValues: ${acceptedValues}`);
    if (!acceptedValues.includes(clusterScalabilityTypeLower)) {
        throw new Error(`Invalid CLUSTER_SCALABILITY_TYPE value: ${clusterScalabilityType}. Must be one of: ${acceptedValues.join(', ')}`);
    }
    return clusterScalabilityTypeLower === ClusterScalabilityType.STANDARD.toString() ? ClusterScalabilityType.STANDARD : ClusterScalabilityType.LIMITLESS;
}
