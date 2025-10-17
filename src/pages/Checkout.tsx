import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, CreditCard, Smartphone, Wallet, Shield } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../hooks/useAuth";
import { useRazorpay } from "../hooks/useRazorpay";
import { toast } from "@/hooks/use-toast";
import { emailService } from "@/services/emailService";
import { 
  sanitizeInput, 
  isValidEmail, 
  isValidPhone, 
  isValidName, 
  isValidAddress, 
  isValidPostalCode 
} from "@/lib/validation";

const Checkout = () => {
  const { state, clearCart } = useCart();
  const { user, loading } = useAuth();
  const { processPayment, createOrder, isProcessing } = useRazorpay();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    saveAddress: false,
  });

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to complete your order.",
        variant: "destructive",
      });
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    // Sanitize input
    const sanitizedValue = type === 'checkbox' ? checked : sanitizeInput(value);
    
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const { [name]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Name validation
    if (!isValidName(formData.firstName)) {
      errors.firstName = "First name must be 2-50 characters and contain only letters";
    }
    if (!isValidName(formData.lastName)) {
      errors.lastName = "Last name must be 2-50 characters and contain only letters";
    }

    // Email validation
    if (!isValidEmail(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Phone validation
    if (!isValidPhone(formData.phone)) {
      errors.phone = "Please enter a valid phone number";
    }

    // Address validation
    if (!isValidAddress(formData.address)) {
      errors.address = "Address must be 5-100 characters long";
    }

    // City validation
    if (!isValidName(formData.city)) {
      errors.city = "Please enter a valid city name";
    }

    // State validation
    if (!isValidName(formData.state)) {
      errors.state = "Please enter a valid state name";
    }

    // Pincode validation
    if (!isValidPostalCode(formData.pincode)) {
      errors.pincode = "Please enter a valid pincode";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to complete your order.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Handle Cash on Delivery separately
      if (paymentMethod === "cod") {
        // Generate unique order ID for COD
        const orderId = `COD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Create order in database for COD
        const orderData = {
          orderId: orderId,
          paymentId: 'cod_payment',
          userId: user.uid,
          items: state.items,
          total: totalWithTax,
          shippingAddress: formData,
          paymentMethod: 'cod',
          status: 'pending',
          createdAt: new Date().toISOString()
        };

        console.log('📦 COD Order created:', orderData);
        
        // Clear cart and redirect
        clearCart();
        toast({
          title: "Order Placed Successfully! 🎉",
          description: "You'll pay on delivery.",
        });
        navigate('/orders');
        return;
      }

      // For all online payment methods (UPI, Card, Wallet, Net Banking)
      // Step 1: Create Razorpay order
      const amountInPaise = Math.round(totalWithTax * 100);
      const orderId = await createOrder(amountInPaise);
      
      if (!orderId) {
        throw new Error("Failed to create payment order");
      }

      // Step 2: Process payment with Razorpay (handles all payment methods)
      const paymentResponse = await processPayment({
        amount: totalWithTax,
        currency: 'INR',
        customerInfo: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
        },
        orderId: orderId,
        preferredMethod: paymentMethod as 'upi' | 'card' | 'wallet' | 'netbanking',
      });

      if (!paymentResponse) {
        throw new Error("Payment processing failed");
      }

      // Step 3: Create order in database after successful payment
      console.log('💳 Payment successful, creating order in database...');
      
      // TODO: Save order to Firebase/Supabase
      const orderData = {
        orderId: orderId,
        paymentId: paymentResponse.razorpay_payment_id,
        userId: user.uid,
        items: state.items,
        total: totalWithTax,
        shippingAddress: formData,
        paymentMethod: paymentMethod,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      };

      console.log('📦 Order created:', orderData);

      // Send order confirmation email
      try {
        await emailService.sendOrderConfirmation({
          customerEmail: formData.email,
          customerName: `${formData.firstName} ${formData.lastName}`,
          orderId: orderId,
          items: state.items,
          total: totalWithTax,
          deliveryAddress: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`
        });
        console.log('📧 Order confirmation email sent');
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Don't fail the order if email fails
      }

      toast({
        title: "Order Placed Successfully! 🎉",
        description: `Payment ID: ${paymentResponse.razorpay_payment_id.slice(-8)}`,
      });
      
      clearCart();
      navigate("/orders");

    } catch (error: any) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout Failed",
        description: error.message || "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalWithTax = Math.round(state.total * 1.12);

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <h1 className="font-display text-3xl font-bold text-foreground mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-muted-foreground mb-8">
              Add some items to your cart to proceed with checkout.
            </p>
            <Link to="/shop">
              <Button size="lg" className="hover-lift">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link to="/cart">
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Button>
          </Link>
          <h1 className="font-display text-3xl font-bold text-foreground ml-4">
            Checkout
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="Enter first name"
                        className={validationErrors.firstName ? "border-destructive" : ""}
                        required
                      />
                      {validationErrors.firstName && (
                        <p className="text-xs text-destructive mt-1">{validationErrors.firstName}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Enter last name"
                        className={validationErrors.lastName ? "border-destructive" : ""}
                        required
                      />
                      {validationErrors.lastName && (
                        <p className="text-xs text-destructive mt-1">{validationErrors.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter email address"
                        className={validationErrors.email ? "border-destructive" : ""}
                        required
                      />
                      {validationErrors.email && (
                        <p className="text-xs text-destructive mt-1">{validationErrors.email}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter phone number"
                        className={validationErrors.phone ? "border-destructive" : ""}
                        required
                      />
                      {validationErrors.phone && (
                        <p className="text-xs text-destructive mt-1">{validationErrors.phone}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter full address"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Enter city"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="Enter state"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input
                        id="pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        placeholder="Enter pincode"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="saveAddress"
                      checked={formData.saveAddress}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, saveAddress: !!checked }))
                      }
                    />
                    <Label htmlFor="saveAddress" className="text-sm">
                      Save this address for future orders
                    </Label>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg bg-gradient-to-r from-green-50 to-blue-50">
                      <RadioGroupItem value="upi" id="upi" />
                      <Label htmlFor="upi" className="flex items-center gap-3 cursor-pointer flex-1">
                        <Smartphone className="h-5 w-5 text-green-600" />
                        <div>
                          <div className="font-medium text-green-700">UPI</div>
                          <div className="text-sm text-green-600">Pay using UPI app or scan QR code</div>
                        </div>
                        <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          Recommended
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center gap-3 cursor-pointer flex-1">
                        <CreditCard className="h-5 w-5 text-accent" />
                        <div>
                          <div className="font-medium">Credit/Debit Card</div>
                          <div className="text-sm text-muted-foreground">Visa, Mastercard, Rupay</div>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="wallet" id="wallet" />
                      <Label htmlFor="wallet" className="flex items-center gap-3 cursor-pointer flex-1">
                        <Wallet className="h-5 w-5 text-accent" />
                        <div>
                          <div className="font-medium">Digital Wallets</div>
                          <div className="text-sm text-muted-foreground">Paytm, PhonePe, Google Pay, etc.</div>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="netbanking" id="netbanking" />
                      <Label htmlFor="netbanking" className="flex items-center gap-3 cursor-pointer flex-1">
                        <div className="h-5 w-5 bg-blue-600 rounded flex items-center justify-center">
                          <span className="text-xs text-white font-bold">₹</span>
                        </div>
                        <div>
                          <div className="font-medium">Net Banking</div>
                          <div className="text-sm text-muted-foreground">All major banks supported</div>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex items-center gap-3 cursor-pointer flex-1">
                        <div className="h-5 w-5 bg-accent rounded-full flex items-center justify-center">
                          <span className="text-xs text-accent-foreground font-bold">₹</span>
                        </div>
                        <div>
                          <div className="font-medium">Cash on Delivery</div>
                          <div className="text-sm text-muted-foreground">Pay when you receive</div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3">
                    {state.items.map((item) => (
                      <div key={`${item.id}-${item.size}`} className="flex gap-3">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.size} • Qty: {item.quantity}
                          </p>
                        </div>
                        <div className="text-sm font-medium">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Pricing */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>₹{state.total.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span className="text-accent">Free</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>Tax (GST 12%)</span>
                      <span>₹{Math.round(state.total * 0.12).toLocaleString()}</span>
                    </div>

                    <Separator />

                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>₹{totalWithTax.toLocaleString()}</span>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full hover-lift" 
                    disabled={isSubmitting}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    {isSubmitting ? "Processing..." : "Secure Checkout"}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    By placing this order, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;