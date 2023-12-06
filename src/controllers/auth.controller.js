const passport = require("passport");
const validateRequest = require("../middlewares/validations/request.validation");
const AuthService = require("../services/auth.service");
const { user, newPasswordSchema } = require("../validations/validation");
const { VALIDATION_ERROR } = require("../middlewares/errors/ApiError");

let authService = new AuthService();
const register = async (request, response, next) => {
  try {
    validateRequest(request, user, "body");
    const { userType, ...data } = request.body;
    let activationURL = `${request.protocol}://${request.get(
      "host"
    )}/api/auth/verify/`;
    let result =
      userType == "customer"
        ? await authService.registerCustomer(data, activationURL)
        : await authService.registerStylist(data, activationURL);

    response.status(201).send(result);
  } catch (error) {
    next(error);
  }
};
const handleGoogleAuth = async (request, response) => {
  try {
    let { user } = request;
    let message = await AuthService.handleGoogleAuth(user);

    return response.json({ status: "success", message });
  } catch (error) {
    return response
      .status(error.status || 400)
      .json({ status: "error", message: error.message });
  }
};
const login = async (request, response, next) => {
  try {
    // passport.authenticate("local", {session: true})

   passport.authenticate("local", (err, user, info) => {
      try {
        if (err) {
          next(err);
        }
        if (!user) {
          throw new VALIDATION_ERROR(
            "validation error",
            info?.status,
            info?.message,
            true
          );
        }
        // request.user = user.data;
        return response.json(user);
      } catch (error) {
        next(error);
      }
    })(request, response, next);
    console.log({USER2: request.user});
  } catch (error) {
    next(error);
  }
};
const verifyAccount = async (request, response, next) => {
  try {
    const { token } = request.params;
    let message = await authService.verifyAccount(token);
    return response.json(message);
  } catch (error) {
    next(error);
  }
};
const resendToken = async (request, response, next) => {
  try {
    let { email, userType } = request.body;
    let activationURL = `${request.protocol}://${request.get(
      "host"
    )}/api/auth/verify/`;
    let result = await authService.resendToken(email, userType, activationURL);
    response.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
const forgotPassword = async(request, response, next) => {
  try {
    const {email} = request.body;
    let result = await authService.forgetPassword(email);
    response.json(result);
  } catch (error) {
    next(error)
  }
}
const newPassword = async(request, response, next) => {
  try {
    // validateRequest(request, newPasswordSchema, 'body' )
    const { token, password} = request.body;
    let result = await authService.newPassword( password,  Number(token));
    response.json(result);
  } catch (error) {
    next(error)
  }
}
module.exports = {
  register,
  login,
  handleGoogleAuth,
  verifyAccount,
  resendToken,
  forgotPassword,
  newPassword
};
