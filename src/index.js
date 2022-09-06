const core = require('@actions/core');
const { DescribeInstancesCommand, TerminateInstancesCommand } = require('@aws-sdk/client-ec2');
const { ec2Client } = require('./ec2Client');
const { getRepoRunningRunnersName } = require('./runners');

async function run() {
  try {
    const REPO_NAME = core.getInput('repo-name');
    const REPO_OWNER = core.getInput('repo-owner');
    const ROGUE_INSTANCE = 2;
    const PARAMS = { InstanceIds: []};
    // Get all the infos about the instances in the specified aws region.
    const DATA = await ec2Client.send(new DescribeInstancesCommand({}));
    // Get all the runners linked to the repo
    const RUNNERS_NAME = await getRepoRunningRunnersName(REPO_NAME, REPO_OWNER);

    // Iterate over the instances.
    for (const reservation of DATA.Reservations) {
      for (const instance of reservation.Instances) {
        if (instance.State.Name === 'running') {
          const NAME_TAG = `${REPO_NAME} Github Runner`;
          const CHECK = instance.Tags
            .filter(tag => (tag.Key === 'Name' && tag.Value === NAME_TAG)
              || (tag.Key === 'Runner' && !RUNNERS_NAME.includes(tag.Value)))
            .length;
          if (CHECK === ROGUE_INSTANCE) {
            const ID = instance.InstanceId;
            PARAMS.InstanceIds.push(ID);
          }
        }
      }
    }

    if (PARAMS.InstanceIds.length) {
      await ec2Client.send(new TerminateInstancesCommand(PARAMS));
      core.notice(`Removed Rogue Instances: ${PARAMS.InstanceIds.toString()}.`);
    } else {
      core.notice(`No Rogue Instances to remove.`);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
