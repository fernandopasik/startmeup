'use strict';

var
  path = require('path'),
  genDir = path.join(__dirname, '../generators/app'),
  tmpDir = path.join(__dirname, '../.tmp'),
  helpers = require('yeoman-test'),
  expect = require('chai').expect;

describe('Ask For Modules', function () {

  var gen, tempGen;

  beforeEach( function (done) {
    gen = helpers
      .run(genDir)
      .inDir(tmpDir)
      .withOptions({ 'skip-install': true })
      .on('ready', function (generator) {
        tempGen = generator;
        done();
      });
  });

  it('App name', function (done) {
    gen
      .withPrompts({ appName: 'testapp' })
      .on('end', function () {
        expect(tempGen.appname).to.equal('testapp');
        done();
      });
  });

  it('App name by default is current directory', function (done) {
    gen
      .on('end', function () {
        expect(tempGen.appname)
          .to.equal(path.basename(process.cwd()).replace(/^\./, ''));
        done();
      });
  });

  it('App description', function (done) {
    gen
      .withPrompts({ description: 'This is a test App.' })
      .on('end', function () {
        expect(tempGen.description).to.equal('This is a test App.');
        done();
      });
  });

});