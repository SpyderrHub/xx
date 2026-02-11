
# Soochi AI - Voice Generation Platform

This is a NextJS-based AI Voice generation platform powered by Genkit and Firebase.

## Setup Instructions

### 1. Environment Variables
Create a `.env.local` file in the root directory and add the following variables:

```env
# Firebase Admin SDK (For Backend Verification)
# Generate at: Firebase Console -> Project Settings -> Service Accounts -> Generate new private key
FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Razorpay API Keys
# Find at: Razorpay Dashboard -> Account & Settings -> API Keys
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
```

### 2. Firebase Setup
- Enable **Authentication** (Email/Password, Google).
- Enable **Firestore Database**.
- Enable **Firebase Storage**.
- Set up your security rules using the provided `firestore.rules` and `storage.rules`.

## Features
- **AI Voice Library**: Browse and sample premium AI voices.
- **Text to Speech**: Convert text to high-quality audio.
- **Author Studio**: Upload and manage custom voice profiles.
- **Subscription Management**: Securely upgrade plans via Razorpay.
