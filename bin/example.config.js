export const config = {
  username: 'alliecaton',
  org: 'MyOrganization', // optional
  repos: [
    {
      displayTitle: 'Ecommerce App', //optional - only passed to deploy script
      org: 'MyOrganization', // optional
      name: 'ecommerce-app',
      mainBranch: 'main',
      devBranch: 'dev',
    },
    {
      name: 'ecommerce-api',
      mainBranch: 'master',
      devBranch: 'dev',
    },
  ],
}
