export const config = {
  username: 'alliecaton',
  org: 'MyOrganization', // optional
  repos: [
    {
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
