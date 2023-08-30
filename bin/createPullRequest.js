const createPullRequest = async (repoInfo, ghRepo) => {
  console.log("about to create...")
  try {
    const res = await ghRepo.createPullRequest({
      title: `Merge ${repoInfo.devBranch} into ${repoInfo.mainBranch}`,
      head: repoInfo.devBranch,
      base: repoInfo.mainBranch,
      // body:
    })

    if (res) {
      console.log(res.data.html_url)
    }
  } catch (e) {
    console.log(e)
  }
}

module.exports = createPullRequest
