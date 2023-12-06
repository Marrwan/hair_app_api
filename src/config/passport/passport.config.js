const passportGoogleConfig = require("./google.passport")
const passportLocalConfig = require("./local.passport")
const  serializeDeserializeUser  = require("./serializeDeserialize")

const passportConfig = (passport) => {
    serializeDeserializeUser(passport)
    passportLocalConfig(passport)
    passportGoogleConfig(passport)
}

module.exports= passportConfig;