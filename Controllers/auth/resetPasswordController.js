const User = require("../../models/user")
const getResponse = require("../../dto/response");
const { PASSWORD_VALIDATION_REGEX } = require("../../lib/constants");
const bcrypt = require("bcrypt");
const { createHashPassword, getValidationErrors, createHashToken } = require("../../lib/utility");
const { getUserByResetPasswordToken } = require("../userController");

const resetPassword = async (req, res) => {
    const response = getResponse();
    try {
        const { token } = req.params;
        console.log("params:", req.params);
        console.log("token:", token);

        const { password, confirmPassword } = req.body;
        console.log("req body:", req.body);
        const errors = validateResetPassword(password, confirmPassword);
        if (errors && errors.length > 0) {
            response.message = errors;
            return res.status(400).json(response);
        }
        const hashedToken = createHashToken(token);
        console.log("hanshed tokens:", hashedToken);
        const user = await getUserByResetPasswordToken(hashedToken)
        console.log("user found:", user)
        if (!user) {
            response.message = ["Reset password token is invalid or expired"];
            return res.status(400).json(response);
        }
        const hashedPassword = await createHashPassword(password);
        //user.password = hashedPassword
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        response.message = ["Password reset successfully"];
        response.data = null;
        return res.status(200).json(response);
    } catch (error) {
        const errorObj = getValidationErrors(error);
        response.message = errorObj.errors;
        res.status(errorObj.code).send(response);
    }
};

const validateResetPassword = (password, confirmPassword) => {
    const errors = [];
    if (!password) {
        errors.push("Password is required");
    }
    if (password !== confirmPassword) {
        errors.push("Password do not matched");
    }
    if (password && !PASSWORD_VALIDATION_REGEX.test(password)) {
        errors.push(
            "Password must be minimum of 8 character and must have a small, a capital, a number and a symbol"
        );
    }
    return errors;
};

module.exports = resetPassword;
