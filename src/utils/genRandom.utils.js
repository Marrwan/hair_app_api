const crypto = require("crypto");

const generateRandomString = async (length) => {
  let buffer =  crypto.randomBytes(length);
  let token =  buffer.toString("hex").slice(0, length);
  return token;
};

const generateRandomNumber = async (length) => {
      // Ensure the length is a positive integer
  if (!Number.isInteger(length) || length <= 0) {
    throw new Error('Length must be a positive integer');
  }

   // Calculate the range of possible values based on the length
   const min = Math.pow(10, length - 1);
   const max = Math.pow(10, length) - 1;
 
   // Generate a random number within the specified range
   const randomValue = await crypto.randomInt(min, max);
 
   return randomValue;
};

module.exports ={
  generateRandomNumber, generateRandomString
}