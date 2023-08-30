const options = { state: "closed", sort: "updated", direction: "desc" }

const listPrs = async (repo) => {
  let data = null
  let error = null
  try {
    const res = await repo.listPullRequests(options)

    if (res.data.success) {
      const comparePr = res.data.find((pr) => pr.base.ref === "main")
      const splitIndex = res.data.findIndex((pr) => pr.base.ref === "main")

      let unreleased

      // If splitIndex does not exist, this means that it is the first PR to be merged into main,
      // so we should collect all closed PRs.
      if (!comparePr) {
        unreleased = res.data
      } else {
        unreleased = res.data.slice(0, splitIndex)
      }

      // If there are no unreleased PRs, log a message
      if (!unreleased.length) {
        console.log("📭 There are no unreleased PRs")
        return
      }

      // Format relevant info for easier reading
      const unreleasedPrs = unreleased?.map((pr) => {
        return {
          title: pr.title,
          body: pr.body,
        }
      })

      data = unreleasedPrs
    } else {
      error = res.data
    }
  } catch (e) {
    console.log(e)
    error = res.data
  } finally {
    if (data) return data
    if (error) return error
  }
}

module.exports = listPrs
