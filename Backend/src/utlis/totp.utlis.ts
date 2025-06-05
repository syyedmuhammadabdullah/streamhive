import { authenticator } from "otplib";
import QRCode from "qrcode";

const generateSecret = (email: string) => {
  const secret = authenticator.generateSecret();
  const otpauthUrl = authenticator.keyuri(
    email,
    "streamhive",
    secret
  );
  return {secret, otpauthUrl};

};
const generateQRCode = async (otpauthUrl: string) => {
  try {
    const qrCode = await QRCode.toDataURL(otpauthUrl);
    return qrCode;
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw new Error("Failed to generate QR code");
  }
};

const generateTOTP = (secret: string) => {
  return authenticator.generate(secret);
};
const verifyTOTP = (otp: string, secret: string) => {
  return authenticator.verify({ token:otp, secret });
};
export {generateSecret, generateQRCode, generateTOTP, verifyTOTP};