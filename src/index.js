const core = require('@actions/core');
const { DescribeInstancesCommand, TerminateInstancesCommand } = require('@aws-sdk/client-ec2');
const { ec2Client } = require('./ec2Client');

// most @actions toolkit packages have async methods
async function run() {
  try {
    const REPO_NAME = core.getInput('repo-name');
    const params = { InstanceIds: []};

    const data = await ec2Client.send(new DescribeInstancesCommand({}));
    for (const reservation of data.Reservations) {
      for (const instance of reservation.Instances) {
        const NAME_TAG = REPO_NAME + " Github Runner";
        console.log(NAME_TAG);
        for (const tag of instance.Tags) {
          console.log(tag.Value);
          if (tag.Key === 'Name' && tag.Value === NAME_TAG) {
            const ID = instance.InstanceId;
            console.log(ID);
            params.InstanceIds.push(ID);
          }
        }
      }
    }
    console.log(params.InstanceIds);
    await ec2Client.send(new TerminateInstancesCommand(params));
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
