# Clean-up-cloud-rogue-instances

[![GitHub Actions](https://img.shields.io/badge/github%20actions-%232671E5.svg?style=for-the-badge&logo=githubactions&logoColor=white)](https://github.com/features/actions)
[![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)](https://en.wikipedia.org/wiki/JavaScript)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Stable Version](https://img.shields.io/github/v/tag/LorenzoDrudi/clean-up-cloud-rogue-instances)](https://img.shields.io/github/v/tag/LorenzoDrudi/clean-up-cloud-rogue-instances)
[![Latest Release](https://img.shields.io/github/v/release/LorenzoDrudi/clean-up-cloud-rogue-instances?color=%233D9970)](https://img.shields.io/github/v/release/LorenzoDrudi/clean-up-cloud-rogue-instances?color=%233D9970)

1. [Prerequisites](#prerequisites)
2. [Explanation](#inputs)
3. [How-to-use](#example-usage)

JavaScript Github Action to clean up AWS running instances (in a specified AWS region) without a Github Runner linked to them. \
To identify the instances are used two [tags](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/Using_Tags.html):

1. Key: `Name`, Value: `<REPO_NAME> Github Runner` (insert the name of your repo).
2. Key: `Runner`, Value: `<Name of the runner linked to the instance>` (it's the value used to understand if its linked runner is online, it must be unique!). 

It works perfectly with the runners deployed using [ephemeral-github-runner](https://github.com/pavlovic-ivan/ephemeral-github-runner) (see also the related [github action](https://github.com/LorenzoDrudi/ephemeral-github-runner-action)).

## Prerequisites

1. You have a repository where you use self-hosted runners.
2. You have an AWS account.
3. You have added secrets to your repository that are later used to set [environment variables](#environment-variables). More information on secrets: [How to set up secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets).

## Inputs

Everything below is required.

- `repo-name`: The name of the repository for which you want to clean up offline runners.
- `repo-owner`: The owner of the repository for which you want to clean up offline runners.
- `aws-region`: AWS region where the instances are located, eg. eu-west-2.

## Environment Variables

- `APP_ID`: GitHub App ID.
- `APP_PRIVATE_KEY`: GitHub App Private Key.
- `AWS_ACCESS_KEY_ID`: Your access key id received when account was created.
- `AWS_SECRET_ACCESS_KEY`: Your secret access key received when account was created.

## Example Usage 

```yaml
name: clean-up-instances
on: <event on which the action has to start>
jobs:
    manage-runners:
        runs-on: ubuntu-latest
        steps:
          - uses: LorenzoDrudi/clean-up-cloud-rogue-instances@<version to use>
            env:
              APP_ID: ${{ secrets.APP_ID }}
              APP_PRIVATE_KEY: ${{ secrets.APP_PRIVATE_KEY }}
              AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
              AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
            with:
              repo-name: <name of the repository for which you want to clean up offline runners>
              repo-owner: <owner of the repository for which you want to clean up offline runners>
              aws-region: <AWS region where the instances are located>
```

All the personal inputs are passed by github secret. 
[See the docs](https://docs.github.com/en/actions/security-guides/encrypted-secrets).

## Tags and Releases

A github action workflow automatically creates a Tag and a Release every push on the main branch. \
That's only a good DevOps practice, furthermore the main branch is protected and changes can come only over PR. \
The idea is to work on develop/features branches and when it's done merge to the main branch, so the workflow starts.

The default behaviour is to create a `minor` tag/release (e.g. 1.*.0), the schema is `<major_version>.<minor_version>.<patch_version>`. \
It's possible also to create major or patch tags/releases adding a tag at the end of the commit message:

- `#major` -> e.g. *.0.0
- `#patch` -> e.g. 1.1.*

For more info see the [references](#references).

## References

- Generated from: [JavaScript-Action](https://github.com/actions/javascript-action)
- To learn how to create a simple action, start here: [Hello-World-JavaScript-Action](https://github.com/actions/hello-world-javascript-action)
- Recommended documentation: [Creating a JavaScript Action](https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action)
- Github action used to create a new tag: [github-tag-action](https://github.com/anothrNick/github-tag-action)
- Github Action used for the release: [action-gh-release](https://github.com/softprops/action-gh-release)
