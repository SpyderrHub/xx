
# Soochi AI - Voice Generation Platform

This is a NextJS-based AI Voice generation platform powered by Genkit and Firebase.

## Setup Instructions

### 1. Environment Variables
Create a `.env.local` file in the root directory and add the following variables:

```env
# Firebase Admin SDK (For Backend Verification)
FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Razorpay Keys
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

# Razorpay Plan IDs (Get these from Razorpay Dashboard > Subscriptions > Plans)
RAZORPAY_PLAN_CREATOR_MONTHLY=plan_xxxxxx
RAZORPAY_PLAN_CREATOR_YEARLY=plan_yyyyyy
RAZORPAY_PLAN_PRO_MONTHLY=plan_zzzzzz
RAZORPAY_PLAN_PRO_YEARLY=plan_wwwwww
```

### 2. Firebase Setup
- Enable **Authentication** (Email/Password).
- Enable **Firestore Database**.
- Enable **Firebase Storage**.

## Features
- **AI Voice Library**: Browse and sample premium AI voices.
- **Text to Speech**: Convert text to high-quality audio.
- **Author Studio**: Upload and manage custom voice profiles.
- **Subscription Management**: Secure recurring billing via Razorpay Subscriptions API.
