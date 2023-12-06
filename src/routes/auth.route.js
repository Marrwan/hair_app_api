const router = require("express").Router();
const passport = require("passport");
const {
  register,
  handleGoogleAuth,
  login,
  verifyAccount,
  resendToken,
  forgotPassword,
  newPassword
} = require("../controllers/auth.controller");

router.post(`/register`, register);
router.get(
  `/google`,
  passport.authenticate("google", { scope: ["email", "profile"] })
);
router.get(
  "/google/redirect",
  passport.authenticate("google", { session: false }),
  handleGoogleAuth
);
router.get('/test', (req,res)=> res.json({hmm: req.user}))
// router.get(`/facebook`, passport.authenticate("facebook"));
// router.get(
//   "/facebook/redirect",
//   passport.authenticate("facebook", { session: false }),
//   handleFacebookAuth
// );
router.post(`/resendToken`, resendToken);
router.get(`/verify/:token`, verifyAccount);
router.post(`/login`, login);
router.post(`/forgotPassword`, forgotPassword);
router.patch(`/newPassword`, newPassword);
// router.post(`/recoverynumber`, requireAuth, recoveryNumber);
// router.put(`/recovery_number`, requireAuth, changeRecoveryNumber);

module.exports = router;
