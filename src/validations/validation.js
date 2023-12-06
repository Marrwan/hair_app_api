const Joi = require("joi");
const user = Joi.object({
  username: Joi.string().trim().min(3).max(30).required().messages({
    "string.base": `Username should be a type text`,
    "string.empty": `Username cannot be an empty field`,
    "any.required": `Username is a required field`,
    "string.min": `Usernameat should be least 3 characters long`,
    "string.max": `Username should be maximum of 30 characters long`,
  }),
  email: Joi.string()
    .email({ minDomainSegments: 2 })
    .trim()
    .required()
    .messages({
      "string.email": `Email should be a valid mail format`,
      "string.empty": `Email cannot be an empty field`,
      "any.required": `Email is a required field`,
    }),
  password: Joi.string()
    .trim()
    .min(6)
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .optional()
    .messages({
      "string.base": `Password should be a valid format`,
      "string.empty": `Password cannot be an empty field`,
      "string.min": `Password should be at least 6 characters long`,
    }),

  repeat_password: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords do not match", // Custom error message
  }),
  userType: Joi.string().valid("customer","stylist").required().messages({
    "any.only": `User type can either be customer or stylist`
  }),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  phone: Joi.string().optional(),
  longitude: Joi.string().optional(),
  latitude: Joi.string().optional(), 
  gender: Joi.string().trim().required().valid("Male", "Female").messages({
    "string.base" : `Gender must be a string`,
    "string.empty": `Gender can not be an empty field`,
    "any.only" : `Gender can either be Male or Female`,
    "any.required": `Gender field is required`,
  }),
  brandName: Joi.string().optional(),
  aboutMe: Joi.string().optional(),
  services: Joi.string().optional(),
});
const newPasswordSchema = Joi.object({
  email: Joi.string()
  .email({ minDomainSegments: 2 })
  .trim()
  .required()
  .messages({
    "string.email": `Email should be a valid mail format`,
    "string.empty": `Email cannot be an empty field`,
    "any.required": `Email is a required field`,
  }),
  password: Joi.string()
  .trim()
  .min(6)
  .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
  .optional()
  .messages({
    "string.base": `Password should be a valid format`,
    "string.empty": `Password cannot be an empty field`,
    "string.min": `Password should be at least 6 characters long`,
  }),
  userType: Joi.string().valid("customer","stylist").required().messages({
    "any.only": `User type can either be customer or stylist`
  }),
  token: Joi.number().required()
})
const wallet = Joi.object({});

module.exports = { user, wallet, newPasswordSchema };
