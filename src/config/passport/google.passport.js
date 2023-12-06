const AuthService = require("../../services/auth.service");

const GoogleStrategy = require("passport-google-oauth20").Strategy;

const authService = new AuthService();
const passportGoogleConfig = async (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_REDIRECT_URL,
        passReqToCallback: true,
      },
      async (request, accessToken, refreshToken, profile, cb) => {
        try {
            console.log({HERE : request.body})
            console.log({THERE: request.query});
            // return({app: request.body})
            const {userType} = request.body;
           let user = authService.handleGoogleAuth(userType, profile);

          request.user = user;
          cb(false, user);
        } catch (err) {
          cb(err);
        }
      }
    ) 
  ); 
};
module.exports = passportGoogleConfig;
 