export const ghRequest = async (request) => {
  let data = null
  try {
    const res = await request

    if (res.data) {
      data = res.data
    }
  } catch (error) {
    if (error.response) {
      console.error(
        `Error! Status: ${error.response.status}. Message: ${error.response.data.message}`
      )
    }
    console.error(error)
  } finally {
    return data
  }
}
