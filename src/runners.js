const core = require('@actions/core');
const { App } = require("@octokit/app");

async function getRepoRunningRunnersName(REPO_NAME, REPO_OWNER) {
  try {
    // Log in
    const app = new App({
      appId: process.env.APP_ID,
      privateKey: process.env.APP_PRIVATE_KEY,
    });

    // List all the repository where the App is installed
    for await (const { octokit, repository } of app.eachRepository.iterator()) {
      if (repository.owner.login === REPO_OWNER && repository.name === REPO_NAME) {
        return (await octokit.request('GET /repos/{owner}/{repo}/actions/runners', {
          owner: REPO_OWNER,
          repo: REPO_NAME
        })).data
          .runners
          .filter(runner => runner.status === 'online')
          .map(runner => runner.name);
      }
    } 
  } catch (error) {
    core.setFailed(error.message);
  }
}

module.exports = { getRepoRunningRunnersName };