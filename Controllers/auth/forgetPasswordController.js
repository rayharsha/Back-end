const getResponse = require("../../dto/response");
const { EMAIL_VALIDATION_REGEX } = require("../../lib/constants");
const { sendResetPasswordLink } = require("../../lib/email");
const { createHashToken } = require("../../lib/utility");
const { getUserByEmail } = require("../userController");
const crypto = require("crypto");

const forgotPassword = async (req, res) => {
    const response = getResponse();
    try {
        const { email } = req.body;
        const errors = validateEmail(email);
        if (errors && errors.length > 0) {
            response.message = errors;
            return res.status(400).json(response);
        }
        const user = await getUserByEmail(email);
        if (!user) {
            response.message = ["User not found with this email"];
            return res.status(404).json(response);
        }
        const resetToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = createHashToken(resetToken);
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
        await user.save();
        await sendResetPasswordLink(user.name, user.email, resetToken)
        response.message = "Password reset link sent to your email";
        return res.status(200).json(response);
    } catch (error) {
        const errorObj = getValidationErrors(error);
        response.message = errorObj.errors;
        res.status(errorObj.code).send(response);
    }
};
const validateEmail = (email) => {
    const errors = [];
    if (!email) {
        errors.push("Email is required");
    }
    if (email && !EMAIL_VALIDATION_REGEX.test(email)) {
        errors.push("Please provide a valid email address");
    }
    return errors;
};

module.exports = forgotPassword;
