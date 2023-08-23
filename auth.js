var GitHub = require('github-api');

// you can authenticate with username and password
var gh = new GitHub({
  username: process.env.USERNAME,
  password: process.env.PASSWORD
});