// Quick Setup Test for TRISHH Razorpay Integration
// Run this in browser console to test your setup

console.log("🔍 TRISHH Razorpay Setup Check");
console.log("================================");

// Check environment variables
const config = {
  razorpayKeyId: import.meta?.env?.VITE_RAZORPAY_KEY_ID,
  qrCodeUrl: import.meta?.env?.VITE_RAZORPAY_QR_CODE_URL,
  upiId: import.meta?.env?.VITE_UPI_ID,
};

console.log("📋 Configuration Status:");
console.log("Razorpay Key ID:", config.razorpayKeyId ? "✅ Set" : "❌ Missing");
console.log("QR Code URL:", config.qrCodeUrl ? "✅ Set" : "❌ Missing");  
console.log("UPI ID:", config.upiId ? "✅ Set" : "❌ Missing");

// Check if Razorpay key is production or test
if (config.razorpayKeyId) {
  const isProduction = config.razorpayKeyId.startsWith('rzp_live_');
  console.log("🏪 Mode:", isProduction ? "🔴 PRODUCTION" : "🟡 TEST");
}

// Test QR code image
if (config.qrCodeUrl) {
  const img = new Image();
  img.onload = () => console.log("🖼️ QR Code Image: ✅ Loaded successfully");
  img.onerror = () => console.log("🖼️ QR Code Image: ❌ Failed to load");
  img.src = config.qrCodeUrl;
}

console.log("\n💡 Next Steps:");
console.log("1. Update .env.local with your actual Razorpay credentials");
console.log("2. Add your QR code image to public/payment/razorpay-qr.png");
console.log("3. Update your UPI ID in .env.local");
console.log("4. Test checkout flow");

export default config;