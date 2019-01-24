var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');

const uuidv4 = require('uuid/v4');
// const session = require('express-session')
const cookieSession = require('cookie-session');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dataRouter = require('./routes/data');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Express Sessions
 */
app.use(cookieSession({
  name: 'session',
  maxAge: 24 * 60 * 60 * 1000,
  keys: ['!+En}Dk*[(5>6qZ\`syR^F\`-N', '!+En}Dk*[(5>6qZ\`syR^F\`-N']
}))
/**
 * PASSPORT
 */
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});
passport.use(new DiscordStrategy({
  clientID: '536672463929737229',
  clientSecret: 'bm4LYpVJIctzmqLXhbsOW0MMEbn5z2gM',
  callbackURL: 'http://localhost:3000/auth/discord/callback',
  scope: ['email']
},
function(accessToken, refreshToken, profile, cb) {
  console.log('SAVING ' + profile);
  let err;
  return cb(err,profile)
  // User.findOrCreate({ discordId: profile.id }, function(err, user) {
  //     return cb(err, user);
  // });
}));

app.use(function(req, res, next){
  res.locals.session = req.session;
  console.log(res.locals.session);
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/data', dataRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
