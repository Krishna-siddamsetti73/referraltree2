import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

export async function generateUPIQR() {
  const upiString = 'upi://pay?pa=sample@paytm&pn=ReferralSystem&am=1&cu=INR';
  const outputPath = path.join(process.cwd(), 'public', 'upi.png');

  try {
    await QRCode.toFile(outputPath, upiString, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });
    console.log('UPI QR Code generated at:', outputPath);
    return true;
  } catch (error) {
    console.error('Error generating QR code:', error);
    return false;
  }
}
