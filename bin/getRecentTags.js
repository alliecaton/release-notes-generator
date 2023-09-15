import { ghRequest } from './ghRequest.js'

export const listTags = async (ghRepo) => {
  try {
    const data = await ghRequest(ghRepo.listTags())

    return data.splice(0, 3)
  } catch (e) {
    console.log(e)
  }
}
