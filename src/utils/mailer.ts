import nodemailer from 'nodemailer';

const FROM_NAME = process.env.FROM_NAME || 'UB App Notifications';
const FROM_EMAIL = process.env.FROM_EMAIL || 'notifications@aban.com.bz';
const APP_URL = process.env.APP_URL || 'http://localhost:3000';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export async function sendWelcomeEmail(to: string, tempPassword: string) {
  const message = {
    from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
    to,
    subject: 'Welcome to the Asset Management System',
    html: `
      <p>Welcome,</p>
      <p>Your account has been created. Use the following credentials to log in:</p>
      <p><strong>Email:</strong> ${to}<br>
         <strong>Temporary Password:</strong> ${tempPassword}</p>
      <p>Please log in at <a href="${APP_URL}/login">${APP_URL}/login</a> and change your password on first access.</p>
      <p>Regards,<br>${FROM_NAME}</p>
    `
  };

  await transporter.sendMail(message);
}

export async function sendRequestSubmissionEmail(to: string, name: string, requestType: string, description: string) {
  const message = {
    from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
    to,
    subject: 'Asset Request Submitted',
    html: `
      <p>Hi ${name},</p>
      <p>Your request has been submitted successfully and is now pending review.</p>
      <p><strong>Request Type:</strong><br>${requestType}</p>
      <p><strong>Description:</strong><br>${description}</p>
      <p>Regards,<br>${FROM_NAME}</p>
    `
  };

  await transporter.sendMail(message);
}

export async function sendRequestStatusUpdateEmail(to: string, name: string, status: string, requestType: string, description: string) {
  const message = {
    from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
    to,
    subject: `Your request has been ${status.toLowerCase()}`,
    html: `
      <p>Hi ${name},</p>
      <p>Your request has been <strong>${status.toLowerCase()}</strong>.</p>
      <p><strong>Request Type:</strong><br>${requestType}</p>
      <p><strong>Description:</strong><br>${description}</p>
      <p>Regards,<br>${FROM_NAME}</p>
    `
  };

  await transporter.sendMail(message);
}

