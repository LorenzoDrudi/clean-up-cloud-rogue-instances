const  { EC2Client } = require( "@aws-sdk/client-ec2");

// // Set the AWS Region.
// const REGION = "REGION"; //e.g. "us-east-1"
// // Create anAmazon EC2 service client object.
// const ec2Client = new EC2Client({ region: REGION });
const ec2Client = new EC2Client();

module.exports = { ec2Client };