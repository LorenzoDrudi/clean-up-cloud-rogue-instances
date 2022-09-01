const core = require('@actions/core');
const DescribeInstancesCommand = require('@aws-sdk/client-ec2');
const ec2Client= require('./ec2Client');


// most @actions toolkit packages have async methods
async function run() {
  try {
    const data = await ec2Client.send(new DescribeInstancesCommand({}));
    console.log("Success", JSON.stringify(data));
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
