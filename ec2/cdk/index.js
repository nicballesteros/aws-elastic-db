// Nic Ballesteros

const ec2 = require('aws-cdk-lib/aws-ec2');
const ecs = require('aws-cdk-lib/aws-ecs');
const ecs_patterns = require('aws-cdk-lib/aws-ecs-patterns');
const cdk = require('aws-cdk-lib');

const EPHEMERAL_PORT_RANGE = ec2.Port.tcpRange(32768, 65535);

class HelloECS extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    // Create a vpc. It is recommended that this step happen in a secondary step
    const vpc = new ec2.Vpc(this, 'testVpc', {
      maxAzs: 1,
    });

    const cluster = new ecs.Cluster(this, 'testEc2Cluster', { vpc });

    // Add an ec2 to the cluster
    cluster.addCapacity('DefaultAutoScaling', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
      minCapacity: 1,
      maxCapacity: 1,
    });

    const ecsService = new ecs_patterns.NetworkLoadBalancedEc2Service(this, "testEc2Service", {
      cluster,
      memoryLimitMiB: 512,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      },
    });

    ecsService.service.connections.allowFromAnyIpv4(EPHEMERAL_PORT_RANGE);
  }
}

const app = new cdk.App();

new HelloECS(app, 'hello');

app.synth();
