import { copyFile, appendFile, open, readFile } from 'node:fs/promises'

import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)

const __dirname = path.dirname(__filename)

const filename = __dirname + `/release-notes/release-notes-${Date.now()}.md`
const template = __dirname + '/release-notes/template.md'

const append = async (content) => {
  await appendFile(filename, content)
}

const openFile = () => {
  open(filename, 'r+')
}

const appendToNewFile = async (releaseNotes) => {
  await append(
    '\n\n<!---Below is the raw data of PRs that will be included in this release.-->\n\n<!--Raw PR Data-->\n\n'
  )

  await releaseNotes.forEach((pr) => {
    append('- ' + pr.title + '\n\n')
  })

  // openFile(filename)
}

export const createReleaseFile = async (releaseNotes) => {
  try {
    // Create new file
    await copyFile(template, filename)
  } catch (e) {
    throw e
  } finally {
    await appendToNewFile(releaseNotes)
  }

  return filename
}

export const read = async () => {
  return readFile(filename, 'utf8')
}
