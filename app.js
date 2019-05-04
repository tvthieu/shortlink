const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userAgent = require('express-useragent');
const where = require('node-where');

const router = require('./routes');

const app = express();

mongoose.connect('mongodb://admin:admin1@ds149706.mlab.com:49706/shortlink');

mongoose.connection.on('open', () => {
  console.log(`MongoDB connected: ${mongoose.connection.db.databaseName}`);
});

mongoose.connection.on('error', (err) => {
  console.error(`MongoDB error: ${err}`);
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(userAgent.express());
app.use((req, res, next) => {
    where.is(req.ip, (err, result) => {
        req.geoip = result;
        next();
    });
});

app.use('/', router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ message: 'An Error Occurred', error: err });
});

module.exports = app;
