
import { Cashfree } from 'cashfree-pg';

// Initialize Cashfree SDK for the backend
if (process.env.CASHFREE_APP_ID && process.env.CASHFREE_SECRET_KEY) {
  Cashfree.XClientId = process.env.CASHFREE_APP_ID;
  Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY;
  Cashfree.XEnvironment = process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT === 'PRODUCTION' 
    ? Cashfree.Environment.PRODUCTION 
    : Cashfree.Environment.SANDBOX;
} else {
  console.warn('Cashfree credentials missing in environment variables.');
}

export { Cashfree };
