'use strict';

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');

const session = require('express-session');
const RedisStore = require('connect-redis')(session);

/* routes */
const routes = require('./routes/index');
const api = require('./routes/api');

/* app 생성 */
const app = express();

app.use(cors());

app.locals.config = require('./config.json')['production'];

app.enable('trust proxy');

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.engine('ejs', require('ejs').renderFile);
app.engine('html', require('ejs').renderFile);

app.use(favicon(path.join(__dirname, './public/favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

app.use(session({secret: 'lotte', resave:true, saveUninitialized:false, store:new RedisStore({host: app.locals.config.redis_host, port: app.locals.config.redis_port, prefix: app.locals.config.redis_prefix, ttl: app.locals.config.redis_ttl, pass: app.locals.config.redis_pass})}));

app.use(express.static(path.join(__dirname, './public')));

app.use('/', routes);
app.use('/api', api);

// catch 404 and forward to error handler
app.use((req, res, next) => {

  const err = new Error('Not Found');
  err.status = 404;
  console.log(err);

  next(err);

});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {

  app.use((err, req, res, next) => {

    res.status(err.status || 500);

    res.render('error.html', {
      message: err.message,
      error: err
    });

  });

}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {

  res.status(err.status || 500);
  
  res.render('error.html', {
    message: err.message,
    error: {}
  });

});

module.exports = app;
