// pages/api/send-email.js
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { image } = req.body;

        // Create a transporter object using your Gmail account
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER, // Your Gmail address
                pass: process.env.GMAIL_PASS, // Your Gmail password (or App Password)
            },
        });

        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: process.env.RECEIVER_EMAIL, // Email address to send the image to
            subject: 'Captured Image',
            text: 'Here is the captured image',
            attachments: [
                {
                    filename: 'captured_image.png',
                    content: image.split(';base64,')[1], // Remove metadata from base64
                    encoding: 'base64',
                },
            ],
        };

        try {
            await transporter.sendMail(mailOptions);
            res.status(200).json({ message: 'Email sent successfully!' });
        } catch (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ message: 'Error sending email' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
