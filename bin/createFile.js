const fs = require("fs");
const util = require("util");

const filename = __dirname + `/release-notes/release-notes-${Date.now()}.md`;

const writeFile = util.promisify(fs.writeFile);
const open = util.promisify(fs.open);
const promisifiedAppend = util.promisify(fs.appendFile);
const append = (content) => {
  promisifiedAppend(filename, content);
};

const openFile = (filename) => {
  open(filename, "r+", function (err) {
    if (err) throw err;
    console.log("File is opened successfully.");
  });
};

const createReleaseFile = async (releaseNotes) => {
  await writeFile(
    filename,
    `<!---Configure your release notes into the sections below.-->\n\n`
  );

  await append("**Updates/Additions**\n\n");
  await append("-\n\n");
  await append("**Technical**\n\n");
  await append("-\n\n");
  await append(
    "<!---Below is the raw data of PRs that will be included in this release.-->\n\n"
  );

  await append("### Raw PR Data \n\n");

  releaseNotes.forEach(async (pr) => {
    await append("- " + pr.title + "\n\n");
  });

  openFile(filename);
};

module.exports = createReleaseFile;
