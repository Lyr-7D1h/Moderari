var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');

// const uuidv4 = require('uuid/v4');
// const session = require('express-session')
const cookieSession = require('cookie-session');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const hbs = require('hbs');

const database = require('./database');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dataRouter = require('./routes/data');

// USE THIS TO CHANGE MODE:
//export NODE_ENV=production

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
/**
 * HANDLEBARS
 */
hbs.registerHelper('compare', function(lvalue, rvalue, options) {
  if (arguments.length < 3)
      throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
  var operator = options.hash.operator || "==";
  var operators = {
      '==':       function(l,r) { return l == r; },
      '===':      function(l,r) { return l === r; },
      '!=':       function(l,r) { return l != r; },
      '<':        function(l,r) { return l < r; },
      '>':        function(l,r) { return l > r; },
      '<=':       function(l,r) { return l <= r; },
      '>=':       function(l,r) { return l >= r; },
      'typeof':   function(l,r) { return typeof l == r; }
  }
  if (!operators[operator])
      throw new Error("Handlerbars Helper 'compare' doesn't know the operator "+operator);
  var result = operators[operator](lvalue,rvalue);
  if( result ) {
      return options.fn(this);
  } else {
      return options.inverse(this);
  }
});

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
  callbackURL: req.app.get('env') === 'development' ? 'http://localhost:3000/auth/discord/callback' : 'http://moderari.ivelthoven.nl/auth/discord/callback',
  scope: ['email']
},
function(accessToken, refreshToken, discord_profile, cb) {

  database.user_login(discord_profile, (err, profile) => {
    if (err) {
      console.log('[SQL LOGIN ERROR] '+err);
    }
    if (profile || err) {
      // console.log(profile);
      return cb(err, profile);
    }
  })
  
}));




app.use(function(req, res, next){
  res.locals.session = req.session;
  if (res.locals.session) {
    console.log(res.locals.session);
  }
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
