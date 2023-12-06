
const express = require('express');
const db  = require('./config/db');
const Authrouter = require('./routes/auth.route');
const message = require('./constants/messages.constant');
const { ROUTE_404_ERROR } = require('./middlewares/errors/ApiError');
const passportConfig = require('./config/passport/passport.config');
const passport = require('passport');
const session = require('express-session');
const connectPgSimple = require('connect-pg-simple')(session);

const sessionStore = new connectPgSimple({
  conString: process.env.DATABASE_URL,
  createTableIfMissing: true, // If session is not there, error.error: relation "session" does not exist at...
})

const app = express();

// DATABASE CONNECTION
db()
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  store : sessionStore
}))
// app.use(passport.session())
// app.use(passport.authenticate(session))
app.use(passport.initialize())
app.use(passport.session())


passportConfig(passport);
app.use((req,res,next)=>{
  console.log({USER: req.user});
  next()
})
// ROUTES
app.use('/api/auth', Authrouter)
app.all('*', ()=> {throw new ROUTE_404_ERROR()})
// ERROR HANDLER
// app.use(function (err, _req, res, next) {
//   if (!err.statusCode || err.statusCode >= 500) {
//     process.NODE_ENV !== 'production' ? console.log({ err}) : new SERVER_ERROR()
//     // throw new SERVER_ERROR()
//    return res.json({err})
//   }
//   next(err)
// });

app.use(function (err, _req, res, _next) {
  res.setHeader("Content-Type", "application/json");
 if(!err.statusCode){
   console.log({err});
  err.message = message.ERROR_500.message
 }
 
  return res.status(err.statusCode || 500).json({ error: err.message });
});

module.exports = app;
 