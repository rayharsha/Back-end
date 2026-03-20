const jwt = require("jsonwebtoken");
const { validateToken } = require("../lib/jwt");
const { getUserByEmail } = require("../controllers/userController");
const getResponse = require("../dto/response");
const { getValidationErrors } = require("../lib/utility");

const authMiddleware = async (req, res, next) => {
    const response = getResponse();
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json(response);
    }
    const token = authHeader.split(" ")[1];
    try {
        const obj = validateToken(token);
        const user = await getUserByEmail(obj.email);
        if (!user) {
            return res.status(401).json(response);
        }
        req.user = user;
        next();
    } catch (error) {
        const errorObj = getValidationErrors(error);
        response.message = errorObj.errors;
        res.status(errorObj.code).send(response);
    }
}
module.exports = authMiddleware;