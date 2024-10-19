var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

require('dotenv').config();
var pool = require('./models/bd');
var session = require('express-session');

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/admin/login');
var adminRouter = require('./routes/admin/novedades');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/admin', express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: '12d24jflqe3dlrd98eq7',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 * 30 },
  })
);

const secured = async (req, res, next) => {
  try {
    console.log('ID de usuario en sesión:', req.session.id_usuario);
    if (req.session.id_usuario) {
      next();
    } else {
      res.redirect('/admin/login');
    }
  } catch (error) {
    console.error('Error en el middleware secured:', error);
    res.redirect('/admin/login');
  }
};

app.use('/', indexRouter);
app.use('/admin/login', loginRouter);
app.use('/admin/novedades', secured, adminRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
