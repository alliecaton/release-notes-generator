const options = { state: 'closed', sort: 'updated', direction: 'desc' }
import { ghRequest } from './ghRequest.js'

export const listPrs = async (repo) => {
  let formattedData = null

  const data = await ghRequest(repo.listPullRequests(options))

  console.log(data)

  if (data) {
    const comparePr = data.find((pr) => pr.base.ref === 'main')
    const splitIndex = data.findIndex((pr) => pr.base.ref === 'main')

    let unreleased

    // If splitIndex does not exist, this means that it is the first PR to be merged into main,
    // so we should collect all closed PRs.
    if (!comparePr) {
      unreleased = data
    } else {
      unreleased = data.slice(0, splitIndex)
    }

    // Format relevant info for easier reading
    const unreleasedPrs = unreleased?.map((pr) => {
      return {
        title: pr.title,
        body: pr.body,
      }
    })

    formattedData = unreleasedPrs
  }

  return formattedData
}
