require("babel-register");
require('babel-polyfill');

exports.handler = require('./app/main')['default'];