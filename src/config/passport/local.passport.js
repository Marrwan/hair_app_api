const { PrismaClient } = require("@prisma/client");
const { compareToken } = require("../../utils/hashToken.utils");
const { VALIDATION_ERROR } = require("../../middlewares/errors/ApiError");

const LocalStrategy = require("passport-local").Strategy;

let prisma = new PrismaClient();
const passportLocalConfig = async (passport) => {
  // Local Strategy
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
          try {
            let user;
           user = await prisma.customer.findUnique({
            where: {
              email,
            },
            include: {
              user: true,
            },
          });

          if (!user) {
            user = await prisma.stylist.findUnique({
                where: {
                  email,
                },
                include: {
                  user: true,
                },
              });
            }
            if(!user){

                return done(null, false, {status:404, message: "Email is not registered." });
            }

          const passwordMatch = await compareToken(
            password,
            user.user.password
          );

          if (!passwordMatch) {
            // console.log("YELLO");
            
            return done(null, false, {status: 401, message: "Incorrect password." });
          }
          if (!user.user.activated) {
            return done(null, false, {status: 403, message: "Activate your account" });
          }
          // Create a JWT token with user information
        //   const token = jwt.sign({ user: user }, process.env.JWT_SECRET, {
        //     expiresIn: "1d",
        //   });
          user.user.password = null
          return done(null, {
            status: "Success",
            message: "Login successful",
            data: {  ...user },
          });
        } catch (error) {
          return done(null, false, error);
        }
      }
    )
  );
};

module.exports = passportLocalConfig;
