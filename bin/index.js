#! /usr/bin/env node

// Make config file with things like org, main branch, dev branch, repo, etc
// -> config example

// have it open a file that  user can edit, then use contents of file to make PR and release

// look into this: https://rytr.me/

// look into bundling this as a binary so that everything downloads at download

const auth = require("./auth.js");
const config = require("./config.js");

const util = require("util");

const createReleaseFile = require("./createFile.js");

// const yargs = require("yargs/yargs");

const { org, repos } = config;

var repo = auth.getRepo(org, repos[0].name);

const options = { state: "closed", sort: "updated", direction: "desc" };

const listPrs = async () => {
  let data = {};
  try {
    const res = await repo.listPullRequests(options);
    const splitIndex = res.data.findIndex((pr) => pr.base.ref === "main");
    const unreleased = res.data.slice(0, splitIndex);

    // If there are no unreleased PRs, log a message
    // This means the most recent closed PR is "Merge dev into main"
    if (!unreleased.length) {
      console.log("📭 There are no unreleased PRs");
      return;
    }

    // Format relevant info for easier reading
    const unreleasedPrs = unreleased.map((pr) => {
      return {
        title: pr.title,
        body: pr.body,
      };
    });

    data = unreleasedPrs;
  } catch (e) {
    console.log(e);
  } finally {
    createReleaseFile(data);
  }
};

listPrs();
