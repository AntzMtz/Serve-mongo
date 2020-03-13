const bcry = require('bcryptjs');

const helpers = {};
helpers.encypass = async (password) => {
    const passCry = await bcry.genSalt(10);
    const hash = await bcry.hash(password, passCry);
    return hash;
};

helpers.matchPassword = async (password, savePassword) => {
    try {
        return await bcry.compare(password, savePassword);
    } catch (e) {
        console.log(e);
    }
};

module.exports = helpers;