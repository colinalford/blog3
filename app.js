var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var passport = require('passport');
var mongoose = require('mongoose');
var session = require('express-session');
var attachAuthenticationStatus = require('./routes/middlewares/attachAuthenticationStatus');

var passportConfig = require('./config/passport');


var routes = require('./routes/index');
var users = require('./routes/users');
var blogs = require('./routes/blogs');
var comments = require('./routes/comments');

var app = express();

// Connect to mongoose
var db_name = 'blog';
var connectionString = process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost/myblog5';

mongoose.connect(connectionString, function(err) {
    if (err) {
        console.log(err);
    }
});

mongoose.connect(connectionString, function(err) {
  if (err) {
    console.log(err);
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: '80ColiNs*zUper@awEsome+node/$^bLog4', saveUninitialized: false, resave: false }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(attachAuthenticationStatus);
app.use(express.static(path.join(__dirname, 'public')));

passportConfig();

app.use('/', routes);
app.use('/api/users', users);
app.use('/api/blog', blogs);
app.use('/api/comments', comments);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
