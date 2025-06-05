import nodemailer from 'nodemailer';

const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  from: string
): Promise<void> => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
   port: 587,
secure: false, 
requireTLS: true,
    host: "smtp.gmail.com",
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from,
    to,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions); // awaits directly
};

export default sendEmail;
