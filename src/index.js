const core = require('@actions/core');
const { DescribeInstancesCommand } = require('@aws-sdk/client-ec2');
const { ec2Client } = require('./ec2Client');

// most @actions toolkit packages have async methods
async function run() {
  try {
    const REPO_NAME = core.getInput('repo-name');

    const data = await ec2Client.send(new DescribeInstancesCommand({}));
    console.log(data.Reservations);
    for (const instance of data.Reservations.Instances) {
      const NAME_TAG = REPO_NAME + " Github Runner";
      console.log(NAME_TAG);
      console.log(instance.Tags["Name"]);
      if (instance.Tags["Name"]) {
        const ID = instance.InstanceId;
        console.log(ID);
      }
    }
    console.log("Success", JSON.stringify(data));
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
