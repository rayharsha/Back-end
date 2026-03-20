const User = require("../models/user")
const bcrypt = require("bcrypt");
const { getValidationErrors } = require("../lib/utility");
const crypto = require("crypto");
const jwt = require("jsonwebtoken")

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        //validate input
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All field are required" })
        }
        //check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User alreday exists" })
        }
        //password
        const hashedPassword = await bcrypt.hash(password, 10)

        //create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });
        const VerificationToken = crypto.randomBytes(32).toString("hex");

        //hash token
        const hashedToken = crypto.createHash("sha256").update(VerificationToken).digest("hex")

        user.emailVerificationToken = hashedToken;
        user.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000;

        await user.save()
        const VerificationLink = `http://localhost:3000/api/auth/verify-email/${VerificationToken}`;
        console.log("Verify email link", VerificationLink)


        //send response
        res.status(201).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
            },
            message: "User registered successfully.Please verify your email",
        })

    } catch (error) {
        res.status(500).json({
            message: error.message,
        })
    }
};

//Login 

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and Password are required"
            })
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }
        if (!user.isEmailVerified) {
            return res.status(403).json({
                message: "Please verify your email first"
            })
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: " Invalid password"
            });
        }

        //create jwt toekn

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        res.status(200).json({
            message: "Login successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
            }
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};
//verifyemail

const verifyemail = async (req, res) => {
    try {
        const token = req.params.token;

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({
            emailVerificationToken: hashedToken,
            emailVerificationExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                message: "Token invaild or expired"
            })
        }
        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpire = undefined;

        await user.save()

        res.status(200).json({
            message: "Email verified successfully"
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


//Forget Password

const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User not found."
            })
        }
        //generate token
        const resetToken = crypto.randomBytes(32).toString("hex");
        //hashed token
        user.resetPasswordToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
        await user.save();

        return res.status(200).json({
            message: "Forget password sent successfully",
            token: resetToken
        })
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message
        })
    }
};


const resetPassword = async (req, res) => {
    try {
        const { password, confirmPassword } = req.body;
        const token = req.params.token;

        //check pasword
        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Password do not match"
            })
        }
        //hash token
        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        //find user bt toekn &expiry
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: {
                $gt: Date.now()
            }
        })

        if (!user) {
            return res.status(400).json({
                message: "Token is invaild or expired"
            })
        }
        //hash new password
        user.password = await bcrypt.hash(password, 10)

        //remove reset toekn
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();
        res.status(200).json({
            message: "Password reset successfully"
        })
    } catch (error) {
        console.error("RESET PASSWORD ERROR:", error);
        res.status(500).json({
            message: error.message
        })
    }
}

module.exports = {
    registerUser,
    loginUser,
    forgetPassword,
    resetPassword,
    verifyemail
}