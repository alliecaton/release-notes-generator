# Release Notes Generator

A node CLI to help generate and create releases on GitHub.

This tool will prompt you through a flow that:

👉 Generates release notes based on titles of PRs merged into config-specified dev branch

👉 Creates a PR to merge dev branch into config-specified master branch with release notes populating the body

👉 Drafts a title & tagged GitHub release with release notes populating the body

![Screenshot 2023-09-15 at 12 15 56 PM](https://github.com/alliecaton/release-notes-generator/assets/56280128/0bf41853-328b-49d5-835c-3d69cf99fd7e)

## Installation

Install packages:

```console
$ npm install
```

To install and run CLI from anywhere on your system, install with:

```console
$ npm install -g .
```

## Configuration

**This steps are required!**

### Environment Variables

This tool requires a GitHub personal access token to authenticate your account. [Follow GitHub instructions on how to generate one.](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)

Once you have a token, create a `.env` file based on the `.env-example` included in the root of this repository:

```console
$ cp .env-examlple .env
```

Swap out example `TOKEN` for your GitHub personal access token.

### Config File

This tool relies on a config file with GitHub information in order to interact with GitHub accounts and repositories.

An example config is included in this repository:

```js
// bin/example.config.js

const config = {
  username: 'janedoe',
  org: 'MyOrganization', // optional
  repos: [
    {
      displayTitle: 'Ecommerce App' // optional, only passed to post-deploy script
      org: 'MyOrganization', // optional
      name: 'ecommerce-app',
      mainBranch: 'main',
      devBranch: 'dev',
    },
    {
      name: 'ecommerce-api',
      mainBranch: 'master',
      devBranch: 'dev',
    },
  ],
}
```

Copy the example config file into a `config.js` file and fill out with your GitHub information:

```console
$ cd bin
$ cp .example.config.js config.js
```

**Optional steps**

- Included in this repository is a `/bin/release-notes/template.md` that is used to generate the format of the PR and release body. Update this file to customize your release notes format.
- You made include a `bin/post-deploy.js` file

## Usage

To run from root of this repository, use:

```console
$ npm run generate-release
```

If you installed globally, you can run from anywhere by simply using:

```console
$ generate-release
```

## Roadmap

- Set up code check to verify that there are not unsaved changes to release notes file before moving on to create a dev to master PR
- Set up optional support for post-deploy script that, if present, can be run at the end of the flow
- Prep to be open source
