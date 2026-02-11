
import Razorpay from 'razorpay';

let razorpayInstance: Razorpay | null = null;

try {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  } else {
    console.warn('Razorpay environment variables are missing. Payment features will be disabled.');
  }
} catch (error) {
  console.error('Failed to initialize Razorpay:', error);
}

export const razorpay = razorpayInstance;
