const mongoose = require("mongoose");
const { SOMETHING_WENT_WRONG } = require("./constants")
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const getValidationErrors = (error) => {
    if (error instanceof mongoose.Error.ValidationError) {
        return {
            code: 400,
            errors: Object.values(error.errors || {}).map(err => ({
                field: err.path,
                message: err.message
            }))
        }
    } else {
        return {
            code: 500,
            errors: [error.message || SOMETHING_WENT_WRONG]
        }
    }
}
const createHashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
}
const createHashToken = (token) => {
    return crypto.createHash("sha256").update(token).digest("hex");
}
const createVerificationToken = () => {
    return crypto.randomBytes(32).toString("hex"); //plain
}
module.exports = {
    getValidationErrors,
    createHashPassword,
    createVerificationToken,
    createHashToken
};