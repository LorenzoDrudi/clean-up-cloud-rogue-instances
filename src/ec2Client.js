const core = require('@actions/core');
const  { EC2Client } = require( "@aws-sdk/client-ec2");

// Set the AWS Region.
const REGION = core.getInput('aws-region');
// Create anAmazon EC2 service client object.
const ec2Client = new EC2Client({ region: REGION });

module.exports = { ec2Client };