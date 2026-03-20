const getResponse = require("../../dto/response");
const { EMAIL_VALIDATION_REGEX, PASSWORD_VALIDATION_REGEX } = require("../../lib/constants");
const { getUserByEmail, createUser } = require("../userController");
const { createHashPassword, createVerificationToken, getValidationErrors, createHashToken } = require("../../lib/utility");
const { sendVerificationLink } = require("../../lib/email");
const User = require("../../models/user");

const register = async (req, res) => {
    const response = getResponse();
    try {
        const { name, email, password } = req.body;
        const errors = validateRegistration(name, email, password);
        if (errors && errors.length > 0) {
            response.message = errors;
            return res.status(400).json(response);
        }
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            response.message = ["User already exists with this email"];
            return res.status(400).json(response);
        }
        const hashedPassword = await createHashPassword(password);
        const verificationToken = createVerificationToken(); //plain
        const hashedToken = createHashToken(verificationToken);
        const user = await createUser({
            name,
            email,
            password: hashedPassword,
            isEmailVerified: false,
            emailVerificationToken: hashedToken,
            emailVerificationExpire: Date.now() + 24 * 60 * 60 * 1000
        });
        console.log("user:", user);
        await sendVerificationLink(name, email, verificationToken);
        console.log("verifycationtoken:", verificationToken)
        response.message = "User registered successfully, please check your email to verify";
        return res.status(201).json(response);
    } catch (error) {
        const errorObj = getValidationErrors(error);
        response.message = errorObj.errors;
        res.status(errorObj.code).send(response);
    }
};
const validateRegistration = (name, email, password) => {
    const errors = [];
    if (!name) {
        errors.push("Name is required");
    }
    if (!email) {
        errors.push("Email is required");
    }
    if (email && !EMAIL_VALIDATION_REGEX.test(email)) {
        errors.push("Please provide a valid email address");
    }
    if (!password) {
        errors.push("Password is required");
    }
    if (password && !PASSWORD_VALIDATION_REGEX.test(password)) {
        errors.push(
            "Password must be minimum of 8 character and must have a small, a capital, a number and a symbol"
        );
    }
    return errors;
};
module.exports = register;