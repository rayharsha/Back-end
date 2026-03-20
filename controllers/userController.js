const User = require("../models/user");

const createUser = async (userData) => {
    return await User.create(userData);
}
const getUserByEmail = async (email) => {
    if (!email) return null;
    return await User.findOne({ email });
}
const getUserByVerifyEmail = async (hashedToken) => {
    return await User.findOne({
        emailVerificationToken: hashedToken,
        emailVerificationExpire: { $gt: Date.now() },
    });
}
const getUserByResetPasswordToken = async (hashedToken) => {
    return await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() },
    });
}
module.exports = {
    getUserByEmail,
    createUser,
    getUserByVerifyEmail,
    getUserByResetPasswordToken
}