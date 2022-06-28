const { Stack } = require('aws-cdk-lib');
const { Vpc } = require('aws-cdk-lib/aws-ec2');

class AwsElasticDbVpcStack extends Stack {
  /**
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);


    const vpc = new Vpc(this, 'AwsElasticDbVpc', { maxAzs: 2 });
  }
}

module.exports = { AwsElasticDbVpcStack };
