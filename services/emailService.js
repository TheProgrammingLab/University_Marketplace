import nodemailer from "nodemailer";
import { Resend } from "resend";

const {
  NODEMAILER_SMTP_PASS,
  NODEMAILER_SMTP_USER,
  NODEMAILER_SMTP_HOST,
  NODEMAILER_SMTP_PORT,
  NODE_ENV,
  RESEND_API_KEY,
  USE_RESEND,
  USE_GMAIL,
  GMAIL_USER,
  GMAIL_PASS,
  BREVO_SMTP_HOST,
  BREVO_SMTP_PORT,
  BREVO_SMTP_USER,
  BREVO_SMTP_PASS,
} = process.env;

const resend = new Resend(RESEND_API_KEY);
const RESEND_DEFAULT_FROM = "UniMart <onboarding@resend.dev>"; // Until we have domain

export default class EmailService {
  constructor(user) {
    this.user = user;

    this.isProduction = NODE_ENV === "production";

    // if (!this.isProduction) {
    //   this.transporter = nodemailer.createTransport({
    //     host: NODEMAILER_SMTP_HOST,
    //     port: Number(NODEMAILER_SMTP_PORT),
    //     auth: {
    //       user: NODEMAILER_SMTP_USER,
    //       pass: NODEMAILER_SMTP_PASS,
    //     },
    //   });
    // }

    //Will change later from gmail to other email provider
    if (this.isProduction && USE_GMAIL === "true") {
      this.transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: GMAIL_USER,
          pass: GMAIL_PASS,
        },
      });
    } else {
      this.transporter = nodemailer.createTransport({
        host: this.isProduction ? BREVO_SMTP_HOST : NODEMAILER_SMTP_HOST,
        port: this.isProduction ? Number(BREVO_SMTP_PORT) : Number(NODEMAILER_SMTP_PORT),
        auth: {
          user: this.isProduction ? BREVO_SMTP_USER : NODEMAILER_SMTP_USER,
          pass: this.isProduction ? BREVO_SMTP_PASS : NODEMAILER_SMTP_PASS,
        },
      });
    }
  }

  async sendMail({ to, subject, text, html }) {
    try {
      // resend can only be sent to my mail if domain is not specified.. so till the domain is ready
      // if (this.isProduction && USE_RESEND === "true") {
      //   const result = await resend.emails.send({
      //     from: DEFAULT_FROM,
      //     to,
      //     subject,
      //     text,
      //     html,
      //   });

      //   console.log("Resend result: ", result);
      //   return result;
      // }

      const result = await this.transporter.sendMail({
        from: "UniMart <no-reply@ynodomain.com>",
        to,
        subject,
        text,
        html,
      });

      console.log("Gmail result: ", result);
      return result;
    } catch (err) {
      console.error("Failed to send verification email:", err?.response || err);
      throw err;
    }
  }

  async sendOtpMail(otp) {
    const name = this.user.first_name || this.user.username || "";
    return await this.sendMail({
      to: this.user.email,
      subject: "UniMart Verification Code – Expires in 10 Minutes",
      text: `Hello ${name},

Your UniMart verification code is: ${otp}

This code will expire in 10 minutes.

If you did not request this code, please ignore this email.

Thank you,
The UniMart Team`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
          <h2 style="color: #2c3e50;">Hello ${
            this.user.first_name || this.user.username || ""
          },</h2>
          <p>Your <strong>UniMart verification code</strong> is:</p>
          <p style="font-size: 1.5rem; font-weight: bold; color: #2980b9;">${otp}</p>
          <p>This code will expire in <strong>10 minutes</strong>.</p>
          <p>If you did not request this code, please ignore this email.</p>
          <br/>
          <p>Thank you,<br/>The UniMart Team</p>
        </div>
      `,
    });
  }

  async sendPasswordResetMail(verificationLink) {
    const name = this.user.first_name || this.user.username || "";

    return await this.sendMail({
      to: this.user.email,
      subject: "Reset your UniMart password (link expires in 30 minutes)",

      text: `Hello ${name},

We received a request to reset your UniMart account password.

Use the link below to create a new password:
${verificationLink}

This link will expire in 30 minutes and can only be used once.

If you did not request a password reset, please ignore this email. Your account is still secure.

Thanks,
The UniMart Team`,

      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #2c3e50;">Hello ${name},</h2>

          <p>
            We received a request to reset your <strong>UniMart</strong> account password.
          </p>

          <p>
            Click the button below to create a new password:
          </p>

          <p style="margin: 24px 0;">
            <a
              href="${verificationLink}"
              style="
                background-color: #2980b9;
                color: #ffffff;
                padding: 12px 20px;
                text-decoration: none;
                border-radius: 4px;
                display: inline-block;
                font-weight: bold;
              "
            >
              Reset Password
            </a>
          </p>

          <p>
            This link will expire in <strong>30 minutes</strong> and can only be used once.
          </p>

          <p>
            If you did not request a password reset, you can safely ignore this email.
            Your account remains secure.
          </p>

          <br />

          <p>
            Thanks,<br />
            <strong>The UniMart Team</strong>
          </p>
        </div>
      `,
    });
  }
}
