import GitHub from 'github-api'

import 'dotenv/config'

// Authenticate with a basic token.
// Instructions on how to generate a new personal access token: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token
export const auth = new GitHub({
  token: process.env.TOKEN,
})
