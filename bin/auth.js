var GitHub = require("github-api")
require("dotenv").config()

// Authenticate with a basic token.
// Instructions on how to generate a new personal access token: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token
var auth = new GitHub({
  token: process.env.TOKEN,
})

module.exports = auth
