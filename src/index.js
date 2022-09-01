const core = require('@actions/core');
const { ec2Client } = require('./ec2Client');
const { DescribeInstancesCommand, TerminateInstancesCommand } = require('@aws-sdk/client-ec2');

async function run() {
  try {
    const REPO_NAME = core.getInput('repo-name');
    const params = { InstanceIds: []};
    const data = await ec2Client.send(new DescribeInstancesCommand({}));

    for (const reservation of data.Reservations) {
      for (const instance of reservation.Instances) {
        const NAME_TAG = `${REPO_NAME} Github Runner`;
        for (const tag of instance.Tags) {
          if (tag.Key === 'Name' && tag.Value === NAME_TAG) {
            const ID = instance.InstanceId;
            params.InstanceIds.push(ID);
          }
        }
      }
    }

    if (params.InstanceIds.length) {
      await ec2Client.send(new TerminateInstancesCommand(params));
      core.notice(`Removed Rogue Instances ${params.InstanceIds.toString()}`);
    } else {
      core.notice(`No Rogue Instances to remove`);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
