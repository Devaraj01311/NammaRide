const nodemailer = require('nodemailer');

async function sendEmail({ to, subject, html }) {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    const info = await transporter.sendMail({
        from: process.env.FROM_EMAIL,
        to,
        subject,
        html,
    });

    console.log('Message sent: %s', info.messageId);
    return info;
}

module.exports = sendEmail;