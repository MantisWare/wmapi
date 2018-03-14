const fs = require('fs');
const path = require('path');
const shell = require('shelljs');

try {
  const packages = fs.readdirSync(path.resolve(process.cwd(),'packages'), 'utf8');

  shell.cd('packages/mwapi-cli');

  packages.filter(pkg => pkg.indexOf('mwapi') !== -1).forEach(pkg => {
    shell.cd('../' + pkg);
    if(process.argv[2]){
      shell.echo(pkg + ': npm publish --tag ' + process.argv[2]);
      shell.exec('npm publish --tag ' + process.argv[2]);
    } else {
      shell.echo(pkg + ': npm publish');
      shell.exec('npm publish');
    }
  });
} catch (error) {
  console.error(error);
}
