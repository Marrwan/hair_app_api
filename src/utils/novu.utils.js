const { novu } = require("../config/novu");

const addNewSubscriber = async (id, data) => {
    const { email,  firstName, lastName, phone } = data;
    await novu.subscribers.identify(id, {
      email,
      firstName,
      lastName,
      phone,
    });

};

const sendMail = async (identifier, subscriberId, activationURL="") => {
  await novu.trigger(identifier, {
    to: {
      subscriberId,
    },
    payload: {
      companyName: process.env.APP_NAME,
      confirmationLink: activationURL,
      token: activationURL
    },
  });
};

const subscriberExists = async(identifier)=>{
  try {
    
 
 let subscriber = await novu.subscribers.get(identifier);
//  console.log({yin:subscriber.status});
//  return Boolean(subscriber);
return subscriber.data ? true : false 
} catch (error) {
    
  }
}

module.exports = { addNewSubscriber, sendMail };

// let d = async()=>{
// let t= await subscriberExists('7')
 
//   console.log(t);
// }
// d()