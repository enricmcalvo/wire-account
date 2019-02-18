const pkg = require('./package.json');
const {execSync} = require('child_process');
const path = require('path');

const source = path.join(pkg.name, 'content');
const currentBranch = execSync(`git rev-parse --abbrev-ref HEAD`)
  .toString()
  .trim();
const configurationEntry = `wire-web-config-default-${currentBranch === 'master' ? 'master' : 'staging'}`;
const repositoryUrl = pkg.dependencies[configurationEntry];

module.exports = {
  files: {
    [`${source}/image/**`]: './dist/templates/image/',
    [path.join(pkg.name, '.env.defaults')]: path.join(__dirname, '.env.defaults'),
  },
  repositoryUrl,
};
