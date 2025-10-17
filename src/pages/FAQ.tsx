import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { HelpCircle, Package, CreditCard, RefreshCw, Truck, Shield, MessageCircle } from "lucide-react";

const FAQ = () => {
  const faqCategories = [
    {
      icon: Package,
      title: "Orders & Products",
      faqs: [
        {
          question: "What materials are your hoodies made from?",
          answer: "Our hoodies are crafted from premium 320GSM cotton blend fabric that's pre-shrunk and color-fast. This ensures superior comfort, durability, and maintains the perfect fit wash after wash."
        },
        {
          question: "How do I choose the right size?",
          answer: "We provide detailed size charts on each product page. Our sizes run true to fit with a relaxed, comfortable cut. If you're between sizes, we recommend sizing up for a more relaxed fit or staying with your usual size for a fitted look."
        },
        {
          question: "Are your hoodies unisex?",
          answer: "Yes! All T'RISHH hoodies are designed with a unisex fit that looks great on everyone. Our size range covers S to XXL to accommodate different body types and style preferences."
        },
        {
          question: "Do you restock sold-out items?",
          answer: "Due to our limited edition approach, some items may not be restocked. However, we regularly introduce new designs and colorways. Follow us on social media to stay updated on restocks and new drops."
        }
      ]
    },
    {
      icon: Truck,
      title: "Shipping & Delivery",
      faqs: [
        {
          question: "How long does shipping take?",
          answer: "Standard shipping takes 3-5 business days within India. We ship from our warehouse within 24-48 hours of order confirmation (excluding weekends and holidays)."
        },
        {
          question: "Do you offer free shipping?",
          answer: "Yes! We offer free shipping on all orders above ₹2,999. For orders below this amount, a nominal shipping fee of ₹99 applies."
        },
        {
          question: "Can I track my order?",
          answer: "Absolutely! Once your order ships, you'll receive a tracking number via email and SMS. You can track your package in real-time using our order tracking system."
        },
        {
          question: "Do you ship internationally?",
          answer: "Currently, we only ship within India. International shipping is in our roadmap for 2024. Sign up for our newsletter to be notified when international shipping becomes available."
        }
      ]
    },
    {
      icon: CreditCard,
      title: "Payment & Pricing",
      faqs: [
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major payment methods including UPI, Credit/Debit Cards (Visa, Mastercard, Rupay), Digital Wallets (Paytm, PhonePe), and Cash on Delivery (COD)."
        },
        {
          question: "Is it safe to pay online on your website?",
          answer: "Yes, absolutely! We use industry-standard SSL encryption and partner with secure payment gateways like Razorpay to ensure your payment information is always protected."
        },
        {
          question: "Can I pay cash on delivery?",
          answer: "Yes, we offer Cash on Delivery (COD) for all orders. However, we encourage online payments for faster processing and to avail of exclusive online discounts."
        },
        {
          question: "Do you offer any discounts or promotions?",
          answer: "We regularly offer exclusive discounts to our newsletter subscribers and social media followers. We also have seasonal sales and special promotions for returning customers."
        }
      ]
    },
    {
      icon: RefreshCw,
      title: "Returns & Exchanges",
      faqs: [
        {
          question: "What is your return policy?",
          answer: "We offer a 30-day return policy for unworn items in original condition with tags attached. The item must be returned in its original packaging."
        },
        {
          question: "How do I initiate a return?",
          answer: "Contact our customer support team at trishhna.studio@gmail.com with your order number and reason for return. We'll provide you with a return shipping label and instructions."
        },
        {
          question: "Do you offer exchanges?",
          answer: "Yes! If you need a different size or color, we offer free exchanges within 30 days of purchase. The exchange item must be in stock and the original item must be in returnable condition."
        },
        {
          question: "When will I receive my refund?",
          answer: "Once we receive and inspect your returned item, refunds are processed within 5-7 business days. The refund will be credited to your original payment method."
        }
      ]
    },
    {
      icon: Shield,
      title: "Quality & Care",
      faqs: [
        {
          question: "How should I care for my T'RISHH hoodie?",
          answer: "Machine wash cold (30°C) with similar colors. Use mild detergent and avoid bleach. Tumble dry low or hang dry. Iron inside out if needed. Following these instructions will help maintain the quality and color."
        },
        {
          question: "Will the hoodie shrink after washing?",
          answer: "Our hoodies are pre-shrunk during manufacturing, so minimal shrinkage should occur if you follow our care instructions. We recommend washing in cold water and air drying for best results."
        },
        {
          question: "What if I receive a defective product?",
          answer: "We have strict quality control, but if you receive a defective item, contact us immediately. We'll arrange a free replacement or full refund, including return shipping costs."
        },
        {
          question: "Do you have a quality guarantee?",
          answer: "Yes! We stand behind our products with a quality guarantee. If you're not satisfied with the quality within 30 days of purchase, we'll make it right with a replacement or refund."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-accent text-accent-foreground">Help Center</Badge>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Find answers to common questions about T'RISHH products, orders, shipping, and more.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {faqCategories.map((category, categoryIndex) => (
              <Card key={categoryIndex} className="mb-8 shadow-card">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                      <category.icon className="h-5 w-5 text-accent" />
                    </div>
                    <h2 className="font-display text-2xl font-bold text-foreground">
                      {category.title}
                    </h2>
                  </div>

                  <Accordion type="single" collapsible className="space-y-2">
                    {category.faqs.map((faq, faqIndex) => (
                      <AccordionItem 
                        key={faqIndex} 
                        value={`${categoryIndex}-${faqIndex}`}
                        className="border border-border rounded-lg px-4"
                      >
                        <AccordionTrigger className="text-left hover:text-accent font-medium">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed pt-2">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Still Need Help */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <HelpCircle className="h-16 w-16 text-accent mx-auto mb-6" />
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
              Still Need Help?
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Can't find the answer you're looking for? Our customer support team is here to help you. 
              Reach out to us and we'll get back to you within 24 hours.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <Card className="p-6 text-center hover-lift">
                <MessageCircle className="h-8 w-8 text-accent mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Email Support</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get detailed help via email
                </p>
                <Button variant="outline" size="sm">
                  Send Email
                </Button>
              </Card>
              
              <Card className="p-6 text-center hover-lift">
                <Badge className="h-8 w-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center mx-auto mb-3">
                  FAQ
                </Badge>
                <h3 className="font-semibold mb-2">Browse More FAQs</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Explore our complete help center
                </p>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Card>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="hover-lift">
                Contact Support
              </Button>
              <Button variant="outline" size="lg">
                Live Chat
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Resources */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
              Popular Resources
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Quick access to commonly needed information and guides.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center p-6 hover-lift">
              <Package className="h-12 w-12 text-accent mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Size Guide</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Find your perfect fit with our detailed size charts.
              </p>
              <Button variant="outline" size="sm">
                View Guide
              </Button>
            </Card>

            <Card className="text-center p-6 hover-lift">
              <Truck className="h-12 w-12 text-accent mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Shipping Info</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Learn about our shipping options and delivery times.
              </p>
              <Button variant="outline" size="sm">
                Learn More
              </Button>
            </Card>

            <Card className="text-center p-6 hover-lift">
              <RefreshCw className="h-12 w-12 text-accent mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Return Policy</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Easy returns and exchanges within 30 days.
              </p>
              <Button variant="outline" size="sm">
                Read Policy
              </Button>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;