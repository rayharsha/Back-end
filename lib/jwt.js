const jwt = require("jsonwebtoken");

const createToken = (email) => {
    return jwt.sign(
        {
            email: email
        },
        process.env.JWT_SECRET,
        { expiresIn: String(process.env.JWT_EXPIRY) || "1d" }
    );
}
const validateToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET)
}

module.exports = { createToken, validateToken }