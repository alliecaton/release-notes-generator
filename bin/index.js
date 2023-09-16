#! /usr/bin/env node
import fs from 'fs'

import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)

const __dirname = path.dirname(__filename)

let postDeploy = null
if (fs.existsSync(__dirname + '/post-deploy.js')) {
  await import('./post-deploy.js').then((script) => {
    if (script) {
      postDeploy = script.default
    }
  })
}

console.log(fs.existsSync(__dirname + '/post-deploy.js'))

import { auth } from './auth.js'
import { config } from './config.js'
import { listPrs } from './getPullRequests.js'
import { createReleaseFile, read } from './createFile.js'
import { createPullRequest } from './createPullRequest.js'
import { createRelease } from './createRelease.js'
import { listTags } from './getRecentTags.js'

import { select, confirm, input } from '@inquirer/prompts'
import { exists } from 'node:fs'

const { repos, username } = config

async function generate() {
  // Select repo to create release for.
  const repo = await select({
    message: 'Which repo would you like to create a release for?',
    choices: repos.map((repo) => {
      return {
        name: repo.name,
        value: repo,
      }
    }),
  })

  if (!repo) {
    console.log(
      'No repo selected. Please add repos to config and re-run program.'
    )
    return
  }

  console.log('🍳 Cooking up release notes...')
  console.log('')

  // ghRepo is the repo object from the github-api library.
  // Will be used as context when calling any repo class methods from the github-api library.
  const ghRepo = auth.getRepo(repo.org || username, repo.name)

  // Get list of unreleased PRs.
  const unreleasedPrs = await listPrs(ghRepo)

  // If there are no unreleased PRs, log a message and exist
  if (!unreleasedPrs?.length) {
    console.log('📭 There are no unreleased PRs')
    console.log('Exiting...')
    return
  }

  // Create release notes markdown file with unreleasedPrs data.
  const filename = await createReleaseFile(unreleasedPrs)

  console.log('✅ Release notes created!')
  console.log('')
  console.log('📝 Edit release notes here: ' + filename)
  console.log('')

  // Prompt user to confirm that they are done editing the release notes.
  // TODO: check file hash to see if it has unsaved changes
  const createConfirm = await confirm({
    message:
      'Are you done editing the release notes? Make sure your file is saved! (y/n)',
  })

  console.log('')

  // If user confirms, create PR and release.
  if (createConfirm) {
    const fileBody = await read()

    await createPullRequest(repo, ghRepo, fileBody)

    const releaseTitle = await input({
      message: '🖊️  What is the title of the release?',
    })

    console.log('')

    // Get recent tags
    const tags = await listTags(ghRepo)

    if (tags.length) {
      console.log(`Last ${tags.length} release tag(s):`)
      console.log(tags.map((tag) => tag.name).join('\n'))
    } else {
      console.log('No previous release tags found.')
    }

    console.log('')

    const tagName = await input({
      message: '🏷️  What is the tag of the release?',
    })

    console.log('')

    if (tagName && releaseTitle) {
      await createRelease(repo, ghRepo, releaseTitle, tagName, fileBody)
    }

    console.log('')
    console.log('------------------------------------')
    console.log('')
    console.log('⏭️  Next steps:')
    console.log('')
    console.log('1️⃣  Merge PR into main')
    console.log('2️⃣  Publish draft release')
    console.log('🚀  Deploy!')
    console.log('')
    console.log('------------------------------------')
    console.log('')

    if (postDeploy) {
      console.log('💻  You have a post-deploy script installed.')
      console.log('')

      const createConfirm = await confirm({
        message: 'Would you like to run your post-deploy script now? (y/n)',
      })

      if (createConfirm) {
        await postDeploy({
          repo,
          ghRepo,
          tagName,
          releaseTitle,
          fileBody,
        })
      }

      console.log('')
      console.log('------------------------------------')
    }

    console.log('')
    console.log('🎉  All done!')
  }
}

generate()
