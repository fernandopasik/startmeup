'use strict';

const
  path = require('path'),
  escapeStringRegexp = require('escape-string-regexp'),
  genDir = path.join(__dirname, '../generators/app'),
  tmpDir = path.join(__dirname, '../.tmp'),
  pkg = require(path.join(__dirname, '../package.json')),
  helpers = require('yeoman-test'),
  assert = require('yeoman-assert'),
  expectedFiles = [
    '.jscsrc',
    '.jshintignore',
    '.jshintrc',
    '.eslintrc'
  ],
  jshint = new RegExp(`jshint.*${escapeStringRegexp(pkg.devDependencies.jshint)}`),
  jscs = new RegExp(`jscs.*${escapeStringRegexp(pkg.devDependencies.jscs)}`),
  eslint = new RegExp(`eslint.*${escapeStringRegexp(pkg.devDependencies.eslint)}`),

  // jscs:disable maximumLineLength
  // eslint-disable-next-line max-len
  eslintConfig = new RegExp(`eslint-config-fernandopasik.*${escapeStringRegexp(pkg.devDependencies['eslint-config-fernandopasik'])}`);

describe('Linting install', () => {

  let gen;

  beforeEach(() => {
    gen = helpers
      .run(genDir)
      .inDir(tmpDir)
      .withOptions({ 'skip-install': true });
  });

  it('creates dotfiles', done => {

    gen
      .withPrompts({ modules: [ 'jshint', 'jscs', 'eslint' ] })
      .on('end', () => {
        assert.file(expectedFiles);
        done();
      });
  });

  it('checks for dependencies', done => {

    gen
      .withPrompts({ modules: [ 'jshint', 'jscs', 'eslint' ] })
      .on('end', () => {
        assert.fileContent('package.json', jshint);
        assert.fileContent('package.json', jscs);
        assert.fileContent('package.json', eslint);
        assert.fileContent('package.json', eslintConfig);
        done();
      });
  });

  it('can be disabled', done => {
    gen
      .withPrompts({ modules: [] })
      .on('end', () => {
        assert.noFile(expectedFiles);
        assert.noFileContent('package.json', jshint);
        assert.noFileContent('package.json', jscs);
        assert.noFileContent('package.json', eslint);
        done();
      });
  });

});
