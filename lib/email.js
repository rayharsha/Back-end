const nodemailer = require("nodemailer");
const getResponse = require("../dto/response");
const { emailVerificationBody } = require("./templetes");
const sendEmail = async (body) => {
    const response = getResponse();
    try {
        // Create a transporter object with your SMTP configuration
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,   // SMTP server address (ex: smtp.gmail.com)
            port: process.env.EMAIL_PORT,   // SMTP port (ex: 587)
            secure: false,                 // True for 465, false for other ports (587, 25)
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        // Send the email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,   // Sender address
            to: body.to,       // Receiver email
            subject: body.subject, // Subject line
            html: body.html,   // HTML body
        });
    } catch (error) {
        response.message = error.message;
    }
    return response;
};
const sendVerificationLink = async (name, email, verificationToken) => {
    const option = {
        name: name,
        verificationLink: `${process.env.FRONTEND_BASE_URL}/auth/verify-email/${verificationToken}`
    }
    const html = emailVerificationBody(option);
    const body = {
        to: email,
        subject: "Email verification link",
        html
    }
    return sendEmail(body);
}

const sendResetPasswordLink = async (name, email, resetPassword) => {
    const resetLink = `${process.env.FRONTEND_BASE_URL}/reset-password/${resetPassword}`;

    const html = `
    <h2>hello${name}</h2>
     <p>You requested to reset your password. </p>
   <p>click the button to reset your password</p>
  <a href="${resetLink}">reset password</a>
  <p>if u didnt request this,plz ignore tgis email</p>`;
    const body = {
        to: email,
        subject: "reset your password",
        html
    }
    return sendEmail(body)
}
module.exports = {
    sendEmail,
    sendVerificationLink,
    sendResetPasswordLink
};