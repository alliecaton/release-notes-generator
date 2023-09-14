const ghRequest = require('./ghRequest')

const createRelease = async (repoInfo, ghRepo, releaseName, tag, body) => {
  try {
    const data = await ghRequest(
      ghRepo.createRelease({
        name: releaseName,
        draft: true,
        tag_name: tag,
        body: body,
      })
    )
    if (data) {
      console.log('🚀 Release draft created! Visit here: ' + data.html_url)
    }
  } catch (e) {
    console.log(e)
  }
}

module.exports = createRelease
