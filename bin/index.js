#! /usr/bin/env node

// have it open a file that  user can edit, then use contents of file to make PR and release

// look into this: https://rytr.me/

// look into bundling this as a binary so that everything downloads at download

const auth = require("./auth.js")
const config = require("./config.js")

const listPrs = require("./getPullRequests.js")
const createReleaseFile = require("./createFile.js")
const createPullRequest = require("./createPullRequest.js")

const { select, confirm } = require("@inquirer/prompts")

const { repos, username } = config

async function generate() {
  const repo = await select({
    message: "Which repo would you like to create a release for?",
    choices: repos.map((repo) => {
      return {
        name: repo.name,
        value: repo,
      }
    }),
  })

  if (!repo) {
    console.log(
      "No repo selected. Please add repos to config and re-run program."
    )
    return
  }

  const ghRepo = auth.getRepo(repo.org || username, repo.name)
  const unreleasedPrs = await listPrs(ghRepo)

  if (unreleasedPrs) {
    // Create release file with unreleasedPrs data
    await createReleaseFile(unreleasedPrs)
  }

  // At this point, a new file has been created in the release-notes folder with the listed pull request info.

  // We will wait for a confirmation that user is done editing.
  // Once user confirms this prompt, we will begin the process of creating a new release.

  console.log(
    "📝 Please edit the release-notes.md file in the release-notes folder."
  )
  console.log(
    "Once you are done, please confirm that you are ready to create a new release."
  )
  console.log(
    "🚨 Please make sure you have saved the file before confirming. 🚨"
  )
  const createConfirm = await confirm({
    message: "Are you done editing the release notes? (y/n)",
  })

  if (createConfirm) {
    createPullRequest(repo, ghRepo)
  }
}

generate()
