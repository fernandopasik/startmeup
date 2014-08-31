// jshint es3:false
'use strict';

var path = require('path');

module.exports = function () {

  var done = this.async();

  this.prompt([
    {
      name: 'appName',
      message: 'What is your app\'s name ?',
      default: path.basename(process.cwd())
    }
  ], function (props) {
    this.appname = props.appName;
    this.appname = this._.camelize(this._.slugify(this._.humanize(this.appname)));

    done();
  }.bind(this));

};