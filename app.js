/*
 * Module dependencies
 */
var express = require('express')
  , stylus = require('stylus')
  , nib = require('nib')

var app = express()

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
}
app.locals.pretty = true;
app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use(express.logger('dev'))
app.use(stylus.middleware(
  { src: __dirname + '/public/stylus'
    , compile: compile
    , dest: __dirname + '/public/styles'
  }
));
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  var model = [{
    name: 'Bedroom'
  }];

  res.render('index', {
    model: model
  });
});

app.listen(3000);