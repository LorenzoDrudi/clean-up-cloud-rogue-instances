const core = require('@actions/core');
const { ec2Client } = require('./ec2Client');
const { DescribeInstancesCommand, TerminateInstancesCommand } = require('@aws-sdk/client-ec2');

async function run() {
  try {
    const REPO_NAME = core.getInput('repo-name');
    const params = { InstanceIds: []};
    // Get all the infos about the instances in the specified aws region.
    const data = await ec2Client.send(new DescribeInstancesCommand({}));

    // Iterate over the instances.
    for (const reservation of data.Reservations) {
      for (const instance of reservation.Instances) {
        console.log(instance)
        const NAME_TAG = `${REPO_NAME} Github Runner`;
        if (instance.State.Name === 'running') {
          for (const tag of instance.Tags) {
            // Check if there are instances that need to be removed.
            if (tag.Key === 'Name' && tag.Value === NAME_TAG) {
              const ID = instance.InstanceId;
              params.InstanceIds.push(ID);
            }
          }
        }
      }
    }

    if (params.InstanceIds.length) {
      await ec2Client.send(new TerminateInstancesCommand(params));
      core.notice(`Removed Rogue Instances: ${params.InstanceIds.toString()}.`);
    } else {
      core.notice(`No Rogue Instances to remove.`);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
