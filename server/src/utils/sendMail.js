import nodemailer from "nodemailer";
import dns from "dns";
import envConfig from "../config/envConfig.js";

const isNetworkAvailable = async () => {
  return new Promise((resolve) => {
    dns.lookup("smtp.gmail.com", (err) => {
      if (err && err.code === "ENOTFOUND") {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};

const transporter = nodemailer.createTransport({
  host: `smtp.gmail.com`,
  service: "gmail",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SEND_MAIL_NAME,
    pass: process.env.SEND_MAIL_PASSWORD,
  },
});

const sendVarificationCodeOnMail = async ({ email, code }) => {
  try {
    console.log("Sending verification code to:", email);
    if (!(await isNetworkAvailable())) {
      throw new Error("Network is not available");
    }

    const mailOptions = {
      from: "masalamirch059@gmail.com",
      to: email,
      subject: "Welcome to MIRCH MASALA, Confirm Your Signup with OTP",
      html: `
          <div style="background-color: #080B0E; padding: 20px; border-radius: 15px; font-family: 'Poppins', sans-serif; height: '250px';">
                <div style="text-align: center;">
                    <img src='https://res.cloudinary.com/dcaxmywjw/image/upload/e_improve:outdoor/lkpfnjd9omnukuuuyrsn.jpg' alt="Logo" style="width: 125px; border-radius: 50%; margin: 0 auto;" />
                </div>
                <h1 style="color: #fff; font-size: 28px; text-align: center; margin-top: 10px; margin-bottom: 5px; letter-spacing: 1px;">Mirch Masala</h1>
                <h2 style="color: #ec9d65; font-weight: normal; text-align: center; margin-bottom: 15px; letter-spacing: 1px;">Verification Code </h2>
                <p style="color: #fff; text-align: center; padding: 10px;">To complete your signup and ensure the security of your account, please verify your email by entering the OTP (One-Time Password) below:</p>
                <div style="text-align: center;">
                    <h1 style="color: #fff;">CODE</h1>
                    <h1 style="color: #fff; padding: 10px;">${code}</h1>
                </div>
                <p style="color: #fff; text-align: center; padding: 10px;">Welcome to Mirch Masala, where delightful culinary experiences await you! We're thrilled to have you as a part of our community.</p>
          </div>
            `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully to:", email);
    return true;
  } catch (error) {
    console.error(
      `Error sending verification code to: ${email} - ${error.message}`
    );
    return false;
  }
};

export { sendVarificationCodeOnMail };
