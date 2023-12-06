const { PrismaClient } = require("@prisma/client");

const User = (new PrismaClient()).user
async function serializeDeserializeUser(passport) {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findUnique({ where: { id } });
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
}

module.exports = serializeDeserializeUser;