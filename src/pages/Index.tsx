import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Truck, Star, Crown, Zap } from "lucide-react";
import { NewsletterPopup } from "@/components/Newsletter";
import { useProducts } from "@/hooks/useProducts";
import heroImage from "@/assets/hero-hoodie.jpg";

const Index = () => {
  const [showNewsletter, setShowNewsletter] = useState(false);
  const { products } = useProducts();

  useEffect(() => {
    // Check if user has already seen the newsletter popup
    const hasSeenNewsletter = localStorage.getItem('hasSeenNewsletter');
    if (!hasSeenNewsletter) {
      const timer = setTimeout(() => {
        setShowNewsletter(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleNewsletterClose = () => {
    setShowNewsletter(false);
    localStorage.setItem('hasSeenNewsletter', 'true');
  };

  // Get first 3 products for featured section
  const featuredProducts = products.slice(0, 3);

  const features = [
    {
      icon: Crown,
      title: "Premium Fabric",
      description: "Ultra-soft cotton blend with superior durability and comfort.",
    },
    {
      icon: Star,
      title: "Streetwear Comfort",
      description: "Perfect fit designed for urban lifestyle and all-day wear.",
    },
    {
      icon: Zap,
      title: "Limited Edition",
      description: "Exclusive drops with unique designs for the discerning individual.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-primary/40" />
        
        <div className="relative z-10 text-center text-primary-foreground px-4 max-w-4xl mx-auto">
          <div className="animate-fade-in">
            <h1 className="font-display text-6xl md:text-8xl font-bold mb-6 tracking-tight">
              T'RISHH
            </h1>
            <p className="text-xl md:text-2xl mb-4 font-light tracking-wide">
              Defined by Desire
            </p>
            <p className="text-lg md:text-xl mb-8 text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed">
              Premium streetwear hoodies that blend luxury comfort with urban sophistication. 
              Limited edition drops for those who demand excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/shop">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6 hover-lift">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="ghost" className="text-lg px-8 py-6 text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/10">
                  Our Story
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary-foreground/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-primary-foreground/50 rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Featured Collection
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover our signature hoodies crafted with premium materials and attention to detail.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product, index) => (
                <Card key={product.id} className="group overflow-hidden border-0 shadow-card hover-lift animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="relative overflow-hidden">
                    <img 
                      src={product.images?.[0] || '/placeholder.svg'} 
                      alt={product.name}
                      className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {product.badge && (
                      <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
                        {product.badge}
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-xl mb-2 text-foreground">{product.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-foreground">₹{product.price.toLocaleString()}</span>
                      <Link to={`/product/${product.id}`}>
                        <Button variant="outline" size="sm" className="hover:bg-accent hover:text-accent-foreground">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-muted-foreground text-lg">No products available yet.</p>
                <p className="text-muted-foreground">Add products through the admin panel to get started!</p>
              </div>
            )}
          </div>

          <div className="text-center">
            <Link to="/shop">
              <Button size="lg" className="px-8 hover-lift">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why T'RISHH Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Why T'RISHH?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We don't just make hoodies. We craft experiences that define your unique style and elevate your wardrobe.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={feature.title} className="text-center group animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-6 group-hover:bg-accent/20 transition-colors">
                  <feature.icon className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-semibold text-xl mb-4 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-12 border-t border-border">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">5000+</div>
              <div className="text-muted-foreground">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">4.9</div>
              <div className="text-muted-foreground">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">24h</div>
              <div className="text-muted-foreground">Fast Shipping</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">100%</div>
              <div className="text-muted-foreground">Quality Promise</div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <Truck className="h-12 w-12 text-accent mx-auto mb-6" />
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Stay in the Loop
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-8">
              Be the first to know about new drops, exclusive offers, and style updates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <Button variant="secondary" size="lg" className="px-8">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>

      <NewsletterPopup isOpen={showNewsletter} onClose={handleNewsletterClose} />
    </div>
  );
};

export default Index;