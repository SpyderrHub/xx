
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

# Cashfree API Keys
# Find at: Cashfree Dashboard -> Payment Gateway -> Developers -> API Keys
CASHFREE_APP_ID=your-app-id
CASHFREE_SECRET_KEY=your-secret-key
NEXT_PUBLIC_CASHFREE_ENVIRONMENT=SANDBOX # Use 'PRODUCTION' for live
```

### 2. Firebase Setup
- Enable **Authentication** (Email/Password).
- Enable **Firestore Database**.
- Enable **Firebase Storage**.

## Features
- **AI Voice Library**: Browse and sample premium AI voices.
- **Text to Speech**: Convert text to high-quality audio.
- **Author Studio**: Upload and manage custom voice profiles.
- **Subscription Management**: Securely upgrade plans via Cashfree.
