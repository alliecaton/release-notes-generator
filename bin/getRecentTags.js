const ghRequest = require('./ghRequest')

const listTags = async (ghRepo) => {
  try {
    const data = await ghRequest(ghRepo.listTags())

    return data.splice(0, 3)
  } catch (e) {
    console.log(e)
  }
}

module.exports = listTags
