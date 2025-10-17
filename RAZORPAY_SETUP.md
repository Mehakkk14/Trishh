# 🔧 Razorpay Production Setup Instructions

## 📝 Steps to Configure Your Razorpay Account

### 1. Update Environment Variables (.env.local)

Replace the following in your `.env.local` file:

```bash
# Razorpay Configuration (Production Mode)
# Replace with your actual Razorpay credentials
VITE_RAZORPAY_KEY_ID=your_actual_key_id_here
VITE_RAZORPAY_KEY_SECRET=your_actual_secret_key_here

# QR Code Configuration
VITE_RAZORPAY_QR_CODE_URL=path_to_your_qr_code_image
```

### 2. Where to Find Your Razorpay Credentials

1. **Login to Razorpay Dashboard**: https://dashboard.razorpay.com/
2. **Go to Settings** → **API Keys**
3. **Generate Live Keys** (for production) or use **Test Keys** (for testing)
4. **Copy Key ID and Key Secret**

### 3. QR Code Setup

You mentioned you have a Razorpay QR code. Here are options:

#### Option A: Upload QR Image to Public Folder
1. Save your QR code image as `public/razorpay-qr.png`
2. Update `.env.local`:
   ```bash
   VITE_RAZORPAY_QR_CODE_URL=/razorpay-qr.png
   ```

#### Option B: Use Online QR Code URL
1. Upload your QR code to any image hosting service
2. Update `.env.local` with the URL:
   ```bash
   VITE_RAZORPAY_QR_CODE_URL=https://your-image-url.com/qr-code.png
   ```

### 4. Update UPI ID in QR Component

Edit `src/components/QRPayment.tsx` and replace:
```tsx
const upiId = "your-upi-id@paytm"; // Replace with your actual UPI ID
```

### 5. Test vs Production Mode

The system automatically detects mode based on your Key ID:
- **Test Mode**: Key starts with `rzp_test_`
- **Production Mode**: Key starts with `rzp_live_`

### 6. Payment Methods Available

Your customers can now pay using:
- ✅ **QR Code Payment** (Recommended) - Scan with any UPI app
- ✅ **UPI** - Direct UPI payments
- ✅ **Credit/Debit Cards** - All major cards
- ✅ **Digital Wallets** - Paytm, PhonePe, etc.

### 7. Security Notes

⚠️ **Important Security**:
- Never commit `.env.local` to Git
- Keep your secret keys secure
- Use test keys during development
- Switch to live keys only for production

### 8. Testing Your Setup

1. **Start the dev server**: `npm run dev`
2. **Add items to cart**
3. **Go to checkout**
4. **Select "QR Code Payment"**
5. **Test the payment flow**

### 9. Production Checklist

Before going live:
- [ ] Replace test keys with live Razorpay keys
- [ ] Upload your actual QR code image
- [ ] Update UPI ID in QRPayment component
- [ ] Test all payment methods
- [ ] Configure webhook URLs in Razorpay dashboard
- [ ] Set up proper order storage in database

## 🎯 Current Status

✅ **Completed**:
- Razorpay integration with both regular and QR payments
- Production-ready environment setup
- Automatic test/live mode detection
- QR code payment interface
- Order processing workflow

🔄 **Next Steps**:
- Add your actual Razorpay credentials
- Upload your QR code image
- Test the payment flow
- Deploy to production

## 💡 Need Help?

If you need assistance with:
- Finding your Razorpay credentials
- Setting up the QR code
- Testing payments
- Production deployment

Just let me know! 🚀