const { PrismaClient } = require("@prisma/client");
const {
  USER_EXISTS_ERROR,
  VALIDATION_ERROR,
  USER_404_ERROR,
} = require("../middlewares/errors/ApiError");
const { hashToken } = require("../utils/hashToken.utils");
const {
  generateRandomNumber,
  generateRandomString,
} = require("../utils/genRandom.utils");
const { addNewSubscriber, sendMail } = require("../utils/novu.utils");

const prisma = new PrismaClient();

const Customer = prisma.customer;
const Stylist = prisma.stylist;
const User = prisma.user;

class AuthService {
  registerCustomer = async (data, activationURL) => {
    let customer = await Customer.findFirst({
      where: {
        email: data.email,
      },
    });
    if (customer) {
      throw new USER_EXISTS_ERROR();
    }
    let password = await hashToken(data.password);
    const activationToken = await generateRandomString(32);
    activationURL += activationToken;
    const { email, repeat_password, ...userdata } = data;
    let newCustomer = await Customer.create({
      data: {
        email,
        user: {
          create: {
            ...userdata,
            password,
            activationToken,
            notification_settings: {
              create: {},
            },
            wallet: {
              create: {
                balance: 0.0,
              },
            },
          },
        },
      },
    });

    await addNewSubscriber(newCustomer.userId, data);
    sendMail("account-activation", newCustomer.userId, activationURL);

    return {
      status: "success",
      message: "Activate your account",
      data: { newCustomer },
    };
  };
  registerStylist = async (data, activationURL) => {
    let stylist = await Stylist.findFirst({
      where: {
        email: data.email,
      },
    });
    if (stylist) {
      throw new USER_EXISTS_ERROR();
    }
    let password = await hashToken(data.password);
    const activationToken = await generateRandomString(32);
    activationURL += activationToken;
    const {
      email,
      repeat_password,
      brandName,
      aboutMe,
      services,
      ...userdata
    } = data;

    let newStylist = await Stylist.create({
      data: {
        email,
        brandName,
        aboutMe,
        services,
        user: {
          create: {
            ...userdata,
            password,
            activationToken,
            notification_settings: {
              create: {},
            },
            wallet: {
              create: {
                balance: 0.0,
              },
            },
          },
        },
      },
    });

    await addNewSubscriber(newStylist.userId, data);
    sendMail("account-activation", newStylist.userId, activationURL);

    return {
      status: "success",
      message: "Activate your account",
      data: { newStylist },
    };
  };
  registerGoogleUser = async (userType, profile) => {
    if ((userType = "customer")) {
      let customer = await Customer.findFirst({
        where: { email: profile.emails[0].value },
      });
      if (customer) {
        throw new USER_EXISTS_ERROR();
      }
      let newCustomer = Customer.create({
        data: {
          email: profile.emails[0].value,
          user: {
            create: {
              activated: true,
              firstName: profile.name.givenName,
              lastName: profile.name.familyName,
              avatar: profile.photos[0].value,
              notification_settings: {
                create: {},
              },
              wallet: {
                create: {
                  balance: 0.0,
                },
              },
            },
          },
        },
      });
    }
    return newCustomer;
  };
  verifyAccount = async (token) => {
    const user = await User.findUnique({
      where: {
        activationToken: token,
      },
    });
    if (!user) {
      throw new VALIDATION_ERROR(
        "activation failed",
        400,
        "Activation token expired or invalid"
      );
    }
    await User.update({
      where: {
        activationToken: token,
      },
      data: {
        activated: true,
        activationToken: null,
      },
    });
    return "Account activated successfully";
  };
  resendToken = async (email, userType, activationURL) => {
    let query = userType == "customer" ? Customer : Stylist;
    let user = await query.findFirst({
      where: { email },
      include: {
        user: true,
      },
    });
    // console.log({user});
    if (!user) {
      throw new USER_404_ERROR();
    }

    if (user?.user?.activated) {
      throw new VALIDATION_ERROR(
        "already activated",
        400,
        "Account already activated"
      );
    }
    // return(user)
    let activationToken;
    if (user?.user?.activationToken) {
      console.log("already there");
      activationToken = user.user.activationToken;
    } else {
      console.log("not there");
      activationToken = await generateRandomString(32);
      await query.update({
        where: { email },
        data: {
          user: {
            activationToken,
          },
        },
      });
    }
    activationURL += activationToken;
    let { firstName, lastName, phone } = user?.user;
    await addNewSubscriber(user.userId, {
      email: user.email,
      firstName,
      lastName,
      phone,
    });
    sendMail("account-activation", user.userId, activationURL);
    return {
      status: "success",
      message: "Activation token has been resent",
    };
  };
  forgetPassword = async (email, userType) => {
    let query = userType == "customer" ? Customer : Stylist;
    let user;
    user = await query.findUnique({
      where: { email },
      select: {
        user: true,
      },
    });

    // if user is not found, throw an error
    if (!user) {
      throw new USER_404_ERROR();
    }
    // create a new five characters long token using crypto
    let forgotPasswordToken = await generateRandomNumber(5);

    // user.update
    await query.update({
      where: { email },
      data: {
        user: {
          update: {
            forgotPasswordToken,
          },
        },
      },
    });

    // send the token to user's email address using Novu
    sendMail("forgot-password", user.user.id, forgotPasswordToken);
    // await novu.trigger("forgot-password", {
    //   to: {
    //     subscriberId: user.id,
    //   },
    //   payload: {
    //     companyName: process.env.APP_NAME,
    //     token,
    //     username: user.user.firstName,
    //   },
    // });
    user.user.password = null;
    return { message: "Check your email address for your token", data: user };
  };
  newPassword = async ( password,  forgotPasswordToken) => {

    let user = await User.findFirst({
      where: {
        forgotPasswordToken,
      },
    });
    // return(user)
    if (!user) {
      // console.log("werey");
      throw new USER_404_ERROR("token error", 400, "Token Invalid");
    }
    const hashedPassword = await hashToken(password);
    // return(password)
    // return(hashedPassword)
    await User.update({
      where: { forgotPasswordToken },

      data: {
        password: hashedPassword,
      },
    });
    return "Your password has been updated, write it somewhere so you can remember";
  };
}

module.exports = AuthService;
