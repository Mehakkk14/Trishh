# 🎯 Razorpay Setup Guide - Step by Step

## 📋 Step 1: Razorpay Account Setup

### 1.1 Create Razorpay Account
1. Go to https://razorpay.com/
2. Click "Sign Up" 
3. Fill business details:
   - Business Name: "TRISHH Desire Shop"
   - Business Type: "Fashion & Lifestyle"
   - Category: "Clothing & Apparel"
4. Verify email and phone number
5. Complete KYC verification (PAN, Aadhaar, Bank Account)

### 1.2 Get API Keys
1. Login to Razorpay Dashboard
2. Go to Settings → API Keys
3. Generate Test Keys (for development):
   - **Test Key ID**: rzp_test_xxxxxxxxxx
   - **Test Key Secret**: xxxxxxxxxxxxx
4. For Production (after testing):
   - **Live Key ID**: rzp_live_xxxxxxxxxx  
   - **Live Key Secret**: xxxxxxxxxxxxx

## 📋 Step 2: Environment Variables Setup

### 2.1 Create .env.local file in project root
```bash
# Razorpay Configuration
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id_here
VITE_RAZORPAY_KEY_SECRET=your_secret_key_here

# For Production (later)
# VITE_RAZORPAY_KEY_ID=rzp_live_your_live_key_id
```

### 2.2 Vercel Environment Variables (for deployment)
1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add:
   - **VITE_RAZORPAY_KEY_ID**: your_razorpay_key_id

## 📋 Step 3: Enable Payment Methods

### 3.1 In Razorpay Dashboard
1. Go to Settings → Payment Methods
2. Enable all payment methods:
   - ✅ UPI (includes QR code, UPI ID, UPI apps)
   - ✅ Cards (Visa, Mastercard, RuPay)
   - ✅ Net Banking (all major banks)
   - ✅ Wallets (Paytm, PhonePe, Google Pay, etc.)
   - ✅ UPI
   - ✅ Wallets (Paytm, PhonePe, Google Pay)
   - ✅ EMI
3. Set minimum amount: ₹1
4. Set maximum amount: ₹1,00,000

## 📋 Step 4: Testing

### 4.1 Test Card Details (Use these for testing)
```
Card Number: 4111 1111 1111 1111
Expiry: Any future date (e.g., 12/25)
CVV: Any 3 digits (e.g., 123)
Name: Any name
```

### 4.2 Test UPI ID
```
UPI ID: success@razorpay (for successful payments)
UPI ID: failure@razorpay (for failed payments)
```

## 🔧 Current Project Integration Status
- ✅ Razorpay service created
- ✅ Payment interface ready
- ✅ Error handling implemented
- ⏳ Need to add your API keys

---
**Next Step**: Add your Razorpay keys to .env.local file and test payments!