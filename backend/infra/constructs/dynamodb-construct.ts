import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as cdk from '@aws-cdk/core';

type DynamodbTableProps = {
  removalPolicy?: cdk.RemovalPolicy;
  partitionKey: dynamodb.Attribute;
  sortKey?: dynamodb.Attribute | undefined;
};

export class DynamodbTableConstruct extends cdk.Construct {
  public readonly table: dynamodb.Table;

  constructor(scope: cdk.Construct, id: string, props: DynamodbTableProps) {
    super(scope, id);

    const {removalPolicy, partitionKey, sortKey} = props;

    this.table = new dynamodb.Table(this, id, {
      // billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      billingMode: dynamodb.BillingMode.PROVISIONED,
      readCapacity: 1,
      writeCapacity: 1,
      removalPolicy: removalPolicy ?? cdk.RemovalPolicy.DESTROY,
      partitionKey,
      sortKey,
    });
  }
}
