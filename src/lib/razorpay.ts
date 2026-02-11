import Razorpay from 'razorpay';

let razorpayInstance: Razorpay | null = null;

try {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (keyId && keySecret) {
    razorpayInstance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
    console.log('Razorpay initialized successfully.');
  } else {
    console.warn('Razorpay initialization skipped: RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is missing.');
  }
} catch (error) {
  console.error('Failed to initialize Razorpay:', error);
}

export const razorpay = razorpayInstance;
