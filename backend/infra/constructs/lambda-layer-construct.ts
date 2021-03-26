import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';

type LambdaLayerConstructProps = {
  code: lambda.Code;
  description: string;
};

export class LambdaLayerConstruct extends cdk.Construct {
  public readonly layer: lambda.LayerVersion;

  constructor(
    scope: cdk.Construct,
    id: string,
    props: LambdaLayerConstructProps,
  ) {
    super(scope, id);

    const {code, description} = props;

    this.layer = new lambda.LayerVersion(this, id, {
      compatibleRuntimes: [
        lambda.Runtime.NODEJS_12_X,
        lambda.Runtime.NODEJS_14_X,
      ],
      code,
      description,
    });
  }
}
