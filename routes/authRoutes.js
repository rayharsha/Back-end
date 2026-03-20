const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const login = require("../controllers/auth/loginController");
const register = require("../controllers/auth/registrationController");
const forgetPassword = require("../controllers/auth/forgetPasswordController");
const resetPassword = require("../controllers/auth/resetPasswordController");
const verifyEmail = require("../controllers/auth/verifyEmailController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login)
router.get("/verify-email/:token", verifyEmail)
router.post("/forget-password", forgetPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/profile", authMiddleware, (req, res) => {
    express.json({
        message: "profile accessed",
        user: req.user
    })
})
module.exports = router;
