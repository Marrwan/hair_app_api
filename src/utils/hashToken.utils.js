const bcrypt = require("bcryptjs");

const hashToken = async (token) => {
  let salt = await bcrypt.genSalt(10);
  let hashedToken = await bcrypt.hash(token, salt);

  return hashedToken;
};

const compareToken = async (string, hashed) => {
  let match = await bcrypt.compare(string, hashed);
  return match;
};
module.exports = {hashToken, compareToken};
