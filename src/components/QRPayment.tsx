// QR Code Payment Component for TRISHH
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QrCode, Copy, CheckCircle, Upload, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QRPaymentProps {
  amount: number;
  orderId: string;
  onPaymentComplete: (transactionId: string) => void;
  onCancel: () => void;
}

export const QRPayment = ({ amount, orderId, onPaymentComplete, onCancel }: QRPaymentProps) => {
  const [transactionId, setTransactionId] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const { toast } = useToast();

  const qrCodeUrl = import.meta.env.VITE_RAZORPAY_QR_CODE_URL || "/payment/razorpay-qr.png";
  const upiId = import.meta.env.VITE_UPI_ID || "your-upi-id@paytm"; // Replace with your actual UPI ID

  const copyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    toast({
      title: "UPI ID Copied!",
      description: "You can now paste it in your payment app",
    });
  };

  const copyAmount = () => {
    navigator.clipboard.writeText(amount.toString());
    toast({
      title: "Amount Copied!",
      description: `₹${amount} copied to clipboard`,
    });
  };

  const handlePaymentProof = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPaymentProof(file);
      toast({
        title: "Screenshot Uploaded",
        description: "Payment proof uploaded successfully",
      });
    }
  };

  const verifyPayment = async () => {
    if (!transactionId.trim()) {
      toast({
        title: "Transaction ID Required",
        description: "Please enter the transaction ID from your payment app",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    
    // Simulate verification process (in production, verify with your backend)
    setTimeout(() => {
      onPaymentComplete(transactionId);
      setIsVerifying(false);
      toast({
        title: "Payment Verified! ✅",
        description: "Your order has been confirmed",
      });
    }, 2000);
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <QrCode className="w-6 h-6" />
            QR Code Payment
          </CardTitle>
          <CardDescription>
            Scan the QR code below or use UPI ID to pay
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Amount Display */}
          <div className="text-center p-4 bg-primary/10 rounded-lg">
            <div className="text-2xl font-bold text-primary">₹{amount}</div>
            <div className="text-sm text-muted-foreground">Order ID: {orderId}</div>
          </div>

          {/* QR Code Display */}
          <div className="text-center space-y-3">
            {qrCodeUrl ? (
              <div className="mx-auto w-48 h-48 bg-white p-4 rounded-lg border">
                <img 
                  src={qrCodeUrl} 
                  alt="Payment QR Code"
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="mx-auto w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                <QrCode className="w-16 h-16 text-gray-400" />
              </div>
            )}
          </div>

          {/* UPI ID Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium">UPI ID:</label>
            <div className="flex items-center gap-2">
              <code className="flex-1 p-2 bg-gray-100 rounded text-sm">{upiId}</code>
              <Button size="sm" variant="outline" onClick={copyUpiId}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Amount Copy */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount:</label>
            <div className="flex items-center gap-2">
              <code className="flex-1 p-2 bg-gray-100 rounded text-sm">₹{amount}</code>
              <Button size="sm" variant="outline" onClick={copyAmount}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Payment Instructions */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Payment Steps:</h4>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Open your UPI app (GPay, PhonePe, Paytm)</li>
              <li>2. Scan the QR code above</li>
              <li>3. Enter amount: ₹{amount}</li>
              <li>4. Complete the payment</li>
              <li>5. Enter transaction ID below</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* Payment Verification */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Verify Payment</CardTitle>
          <CardDescription>
            Enter transaction ID after completing payment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Transaction ID Input */}
          <div>
            <label className="block text-sm font-medium mb-2">Transaction ID *</label>
            <input
              type="text"
              placeholder="Enter 12-digit transaction ID"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="w-full p-2 border rounded-md"
              maxLength={12}
            />
          </div>

          {/* Payment Proof Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Payment Screenshot (Optional)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handlePaymentProof}
                className="hidden"
                id="payment-proof"
              />
              <label
                htmlFor="payment-proof"
                className="flex-1 p-2 border-2 border-dashed rounded-md text-center cursor-pointer hover:bg-gray-50"
              >
                {paymentProof ? (
                  <span className="text-green-600 flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Screenshot uploaded
                  </span>
                ) : (
                  <span className="text-gray-500 flex items-center justify-center gap-2">
                    <Upload className="w-4 h-4" />
                    Upload screenshot
                  </span>
                )}
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={verifyPayment}
              disabled={isVerifying || !transactionId.trim()}
              className="flex-1"
            >
              {isVerifying ? "Verifying..." : "Verify Payment"}
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QRPayment;