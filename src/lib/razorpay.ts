import Razorpay from 'razorpay';

let razorpay: Razorpay | null = null;

if (process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  try {
    razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  } catch (error) {
    console.error('Failed to initialize Razorpay:', error);
  }
} else {
    console.warn('Razorpay keys are not defined in environment variables. Razorpay functionality will be disabled.');
}

export { razorpay };
