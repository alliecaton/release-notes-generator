import { ghRequest } from './ghRequest.js'

export const createPullRequest = async (repoInfo, ghRepo, body) => {
  try {
    const data = await ghRequest(
      ghRepo.createPullRequest({
        title: `Merge ${repoInfo.devBranch} into ${repoInfo.mainBranch}`,
        head: repoInfo.devBranch,
        base: repoInfo.mainBranch,
        body: body,
      })
    )
    if (data) {
      console.log('🚀 PR Created! Visit here: ' + data.html_url)
    }
  } catch (e) {
    console.log(e)
  }
}
