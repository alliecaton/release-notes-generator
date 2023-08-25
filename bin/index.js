#! /usr/bin/env node 

// Make config file with things like org, main branch, dev branch, repo, etc
// -> config example

// have it open a file that  user can edit, then use contents of file to make PR and release

// look into this: https://rytr.me/

// look into bundling this as a binary so that everything downloads at download

const auth = require('./auth.js')

var marketedge = auth.getRepo('TheAtlasMarketplaceCo', 'the-marketedge-app');

const options = { state: 'closed', sort: 'updated', direction: 'desc' }

// const getPrList = (repo) => {
  marketedge.listPullRequests(options, function (err, pullRequests) {
    if (err) {
      console.log(err)
    } else {
      // Format relevant info for easier reading
      const info = pullRequests.map(pr => {
        return {
          title: pr.title,
          body: pr.body,
        }
      })

      // Split at most recent "Merge dev into main" PR

      // TODO: get commits as part of the last release & compare commits after that for dev PRs to main branch
      const splitIndex = info.findIndex(pr => pr.title === 'Merge dev into main')
      const unreleased = info.slice(0, splitIndex)

      // If there are no unreleased PRs, log a message
      // This means the most recent closed PR is "Merge dev into main"
      if (!unreleased.length) {
        console.log('📭 There are no unreleased PRs')
        return
      }

      const prReleaseNotes = unreleased.map(pr => {
        // If a "Release Notes" section is included in PR, grab that list. 
        // Otherwise get list under ## Changes
        const changesSection = pr.body.split('##').find(section => section.includes('Release Notes' || 'Changes'))
        const changesArray = changesSection.split('- ')
        // Remove "## Changes" header and just get list of changes
        changesArray.shift()

        const stripped = changesArray.map(change => change.replace(/\n|\r/g, ''))

        console.log(stripped)
        return stripped
      })
    }
  })
// }

// const releaseNotesUnformatted = getPrList(marketedge)

// console.log(releaseNotesUnformatted)


// Plan: 

// run ./generate-releasenotes.mjs --rep=<marketedge>
// run getPrList(repo), output unformatted list
// for each through each item in list, pass U, T, or D to bash output to categorize list into Updates/Additons, Techincal, or Disregard
// Output final list