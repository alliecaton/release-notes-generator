const { copyFile, appendFile, open, writeFile } = require("node:fs/promises")

const filename = __dirname + `/release-notes/release-notes-${Date.now()}.md`
const template = __dirname + "/release-notes/template.md"

const append = async (content) => {
  await appendFile(filename, content)
}

const openFile = () => {
  open(filename, "r+")
}

const appendToNewFile = async (releaseNotes) => {
  await append(
    "\n\n<!---Below is the raw data of PRs that will be included in this release.-->\n\n### Raw PR Data\n\n"
  )

  await releaseNotes.forEach((pr) => {
    append("- " + pr.title + "\n\n")
  })

  // openFile(filename)
}

const createReleaseFile = async (releaseNotes) => {
  try {
    // Create new file
    await copyFile(template, filename)
  } catch (e) {
    throw e
  } finally {
    await appendToNewFile(releaseNotes)
  }
}

module.exports = createReleaseFile
