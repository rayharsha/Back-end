const User = require("../../models/user");
const getResponse = require("../../dto/response");
const crypto = require("crypto");
const { getUserByVerifyEmail } = require("../userController");
const { createHashToken } = require("../../lib/utility");
const verifyEmail = async (req, res) => {
    const response = getResponse();
    try {
        const { token } = req.params;
        const errors = validateVerifyEmail(token);
        if (errors && errors.length > 0) {
            response.message = errors;
            return res.status(400).json(response);
        }
        const hashedToken = createHashToken(token)
        const user = await getUserByVerifyEmail(hashedToken)
        if (!user) {
            response.message = ["Verification token is invalid or expired"];
            return res.status(400).json(response);
        }
        if (user.isEmailVerified) {
            response.message = ["Email already verified"];
            return res.status(400).json(response);
        }
        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpire = undefined;
        await user.save();
        response.message = "Email verified successfully";
        response.data = null;
        return res.status(200).json(response);
    } catch (error) {
        const errorObj = getValidationErrors(error);
        response.message = errorObj.errors;
        res.status(errorObj.code).send(response);
    }
};
const validateVerifyEmail = (token) => {
    const errors = [];
    if (!token) {
        errors.push("Verification token is required");
    }
    return errors;
};
module.exports = verifyEmail;