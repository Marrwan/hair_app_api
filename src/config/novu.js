const { Novu } = require("@novu/node");


const novu = new Novu(process.env.NOVU_API_KEY);
const novu2 = new Novu(process.env.NOVU_API_KEY_2);

module.exports = {novu, novu2}