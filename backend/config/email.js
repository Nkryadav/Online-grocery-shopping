const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: process.env.EMAIL_PORT || 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
};

// Send email function
const sendEmail = async (options) => {
    const transporter = createTransporter();

    const mailOptions = {
        from: `${process.env.EMAIL_FROM_NAME || 'FreshMart'} <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.html,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Email could not be sent');
    }
};

// Password reset email template
const getPasswordResetEmail = (resetUrl, userName) => {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🔐 Password Reset Request</h1>
                </div>
                <div class="content">
                    <p>Hello ${userName || 'User'},</p>
                    <p>You have requested to reset your password for your FreshMart account.</p>
                    <p>Click the button below to reset your password:</p>
                    <div style="text-align: center;">
                        <a href="${resetUrl}" class="button">Reset Password</a>
                    </div>
                    <p><strong>This link will expire in 10 minutes.</strong></p>
                    <p>If you didn't request this, please ignore this email and your password will remain unchanged.</p>
                    <p>For security reasons, this link can only be used once.</p>
                    <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
                    <p style="font-size: 12px; color: #666;">If the button doesn't work, copy and paste this link into your browser:</p>
                    <p style="font-size: 12px; word-break: break-all; color: #667eea;">${resetUrl}</p>
                </div>
                <div class="footer">
                    <p>&copy; 2024 FreshMart. All rights reserved.</p>
                    <p>This is an automated email, please do not reply.</p>
                </div>
            </div>
        </body>
        </html>
    `;
};

module.exports = {
    sendEmail,
    getPasswordResetEmail,
};
