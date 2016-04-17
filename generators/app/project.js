'use strict';

/**
 * Copy project initial files.
 */
module.exports = function () {

  this.devDependencies = this.devDependencies
    .map(dependency => `    "${dependency.name}": "${dependency.version}"`)
    .sort()
    .join(',\n');

  if (this.devDependencies) {
    this.devDependencies = `\n${this.devDependencies}\n  `;
  }

  this.template('_package.json', 'package.json');
  this.template('_bower.json', 'bower.json');
  this.copy('README.md');
  this.copy('LICENSE');
};
