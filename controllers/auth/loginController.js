const getResponse = require("../../dto/response");
const { EMAIL_VALIDATION_REGEX, PASSWORD_VALIDATION_REGEX } = require("../../lib/constants");
const { createToken } = require("../../lib/jwt");
const { getUserByEmail } = require("../userController");
const bcrypt = require("bcrypt");

const login = async (req, res) => {
    const response = getResponse();
    try {
        const { email, password } = req.body;
        const errors = validateCreditional(email, password);
        if (errors && errors.length > 0) {
            response.message = errors;
            return res.status(400).json(response);
        }
        const user = await getUserByEmail(email);
        if (!user) {
            response.message = ["Either email or password is incorrect"];
            return res.status(401).json(response);
        }
        if (!user.isEmailVerified) {
            response.message = ["Your email is not verified yet!"];
            return res.status(400).json(response);
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            response.message = ["Either email or password is incorrect"];
            return res.status(401).json(response);
        }
        const token = createToken(email);
        response.message = "Login successfully";
        response.data = token;
        return res.status(200).json(response);
    } catch (error) {
        console.log("loginController: login: error occoured =>", error.message, error)
        response.message = [error.message];
        return res.status(500).json(response);
    }
}
const validateCreditional = (email, password) => {
    const errors = [];
    if (!email) {
        errors.push("Email is required");
    }
    if (!EMAIL_VALIDATION_REGEX.test(email)) {
        errors.push("Please provide a valid email address");
    }
    if (!password) {
        errors.push("Password is required");
    }
    if (!PASSWORD_VALIDATION_REGEX.test(password)) {
        errors.push("Password must be minimum of 8 charcter and must have a small, a capital, a number and a symbol");
    }
    return errors;
}
module.exports = login;