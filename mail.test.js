const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'deus728@gmail.com',
    },
    tls: { rejectUnauthorized: false }, // временно для теста
});

async function main() {
    try {
        const info = await transporter.sendMail({
            from: '"Twitch clone" <deus7@yandex.ru>',
            to: 'deus7@yandex.ru',
            subject: 'SMTP Test',
            text: 'Если это пришло — SMTP работает!',
        });

        console.log('Email sent:', info.messageId);
    } catch (err) {
        console.error('SMTP error:', err);
    }
}

main();
