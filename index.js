var GitHub = require('github-api');
var auth = require('./auth.js')

// you can authenticate with username and password
var gh = new GitHub({
  username: process.env.USERNAME,
  password: process.env.PASSWORD
});

var atlas = gh.getOrganization('TheAtlasMarketplaceCo');
atlas.getRepos(function(err, repos) {
    console.log('inside orgs', repos)
});