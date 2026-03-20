const emailVerificationBody = (option) => {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Email Verification</title>
</head>
<body style="font-family: Arial, sans-serif; background:#f4f4f4; padding:20px;">

  <div style="max-width:500px; margin:auto; background:#ffffff; padding:20px; border-radius:5px;">

    <h2>Hello ${option.name},</h2>

    <p>
      Thank you for registering with <strong>Medical & Surgical Solutions</strong>.
    </p>

    <p>
      Please click the button below to verify your email address.
      This link will expire in <strong>15 minutes</strong>.
    </p>

    <div style="text-align:center; margin:30px 0;">
      <a href="${option.verificationLink}" 
         style="background:#22c55e; color:white; padding:10px 20px; 
         text-decoration:none; border-radius:4px;">
         Verify Account
      </a>
    </div>

    <p>
      If you did not create this account, please ignore this email.
    </p>

    <p>Regards,<br/>
    <strong>Medical & Surgical Solutions Team</strong></p>

  </div>

</body>
</html>
`;
}

module.exports={emailVerificationBody}