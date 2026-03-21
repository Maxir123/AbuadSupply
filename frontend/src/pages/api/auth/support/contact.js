import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { subject, message } = req.body;

  if (!subject || !message) {
    return res.status(400).json({ message: 'Subject and message are required' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or another email service
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Marketplace Support" <${process.env.SMTP_EMAIL}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `[Support Request] ${subject}`,
      text: message,
    });

    return res.status(200).json({ message: 'Request sent successfully!' });
  } catch (err) {
    console.error('Email error:', err);
    return res.status(500).json({ message: 'Failed to send message' });
  }
}
