import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Truck, Shield, ArrowLeft, Heart, Share2, Loader2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { toast } from "@/hooks/use-toast";
import { db } from "@/integrations/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

interface Product {
  id: string;
  name: string;
  price: number;
  discount_price?: number;
  description: string;
  images: string[];
  colors?: string[];
  sizes?: string[];
  badge?: string;
  rating?: number;
  review_count?: number;
}

const ProductDetail = () => {
  const { id } = useParams();
  const { addItem } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const productRef = doc(db, 'products', id!);
      const productSnap = await getDoc(productRef);

      if (productSnap.exists()) {
        const data = { id: productSnap.id, ...productSnap.data() } as Product;
        setProduct(data);
        // Set default selections
        if (data.colors && data.colors.length > 0) {
          setSelectedColor(data.colors[0]);
        }
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }
      } else {
        setProduct(null);
      }
    } catch (error: any) {
      console.error('Error fetching product:', error);
      toast({
        title: "Error",
        description: "Failed to load product details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-4">The product you're looking for doesn't exist or is no longer available.</p>
        <Link to="/shop">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Button>
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      toast({
        title: "Please select a size",
        description: "Choose your preferred size before adding to cart.",
        variant: "destructive",
      });
      return;
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      color: selectedColor,
      image: product.images?.[0] || '/placeholder.svg',
    });

    toast({
      title: "Added to cart!",
      description: `${product.name} ${selectedSize ? `(${selectedSize}` : ''}${selectedColor ? `, ${selectedColor})` : ''} added to your cart.`,
    });
  };

  const handleWishlistToggle = () => {
    const isCurrentlyInWishlist = isInWishlist(product.id);
    
    if (isCurrentlyInWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        images: product.images || ['/placeholder.svg'],
        category: "Clothing",
        addedAt: new Date().toISOString()
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-accent">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-accent">Shop</Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        {/* Back Button */}
        <Link to="/shop">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Shop
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-lg">
              <img 
                src={product.images?.[0] || '/placeholder.svg'} 
                alt={product.name}
                className="w-full h-96 lg:h-[600px] object-cover"
              />
              {product.badge && (
                <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
                  {product.badge}
                </Badge>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-4">
                {product.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < Math.floor(product.rating || 0) ? 'text-accent fill-accent' : 'text-gray-300'}`} />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating || 0} ({product.review_count || 0} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-foreground">₹{product.price.toLocaleString()}</span>
                {product.discount_price && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">₹{product.discount_price.toLocaleString()}</span>
                    <Badge variant="destructive">
                      {Math.round((1 - product.discount_price / product.price) * 100)}% OFF
                    </Badge>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            <Separator />

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Color: {selectedColor}</h3>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <Button
                      key={color}
                      variant={selectedColor === color ? "default" : "outline"}
                      onClick={() => setSelectedColor(color)}
                      className="min-w-[80px]"
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Size</h3>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      onClick={() => setSelectedSize(size)}
                      className="w-12 h-12"
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="font-semibold mb-3">Quantity</h3>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <Button 
                  size="lg" 
                  className="flex-1 hover-lift"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
                <Button 
                  size="lg" 
                  variant={isInWishlist(product.id) ? "default" : "outline"}
                  onClick={handleWishlistToggle}
                  className={isInWishlist(product.id) ? "bg-rose-600 hover:bg-rose-700" : ""}
                >
                  <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-white' : ''}`} />
                </Button>
                <Button size="lg" variant="outline">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
              
              <Button size="lg" variant="secondary" className="w-full">
                Buy Now
              </Button>
            </div>

            {/* Features */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div className="flex flex-col items-center">
                    <Truck className="h-8 w-8 text-accent mb-2" />
                    <span className="font-semibold">Free Shipping</span>
                    <span className="text-sm text-muted-foreground">On orders over ₹2,999</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Shield className="h-8 w-8 text-accent mb-2" />
                    <span className="font-semibold">Quality Promise</span>
                    <span className="text-sm text-muted-foreground">30-day return policy</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Star className="h-8 w-8 text-accent mb-2" />
                    <span className="font-semibold">Premium Quality</span>
                    <span className="text-sm text-muted-foreground">Crafted with care</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-16">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Product Details</TabsTrigger>
              <TabsTrigger value="size-guide">Size Guide</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="mt-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-xl mb-4">Product Description</h3>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-muted-foreground leading-relaxed">
                      {product.description || 'No description available.'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="size-guide" className="mt-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-xl mb-4">Size Guide</h3>
                  <div className="text-muted-foreground">
                    <p>Please refer to our general size guide or contact us for specific measurements.</p>
                    <div className="mt-4 space-y-2">
                      <p><strong>XS:</strong> Extra Small</p>
                      <p><strong>S:</strong> Small</p>
                      <p><strong>M:</strong> Medium</p>
                      <p><strong>L:</strong> Large</p>
                      <p><strong>XL:</strong> Extra Large</p>
                      <p><strong>XXL:</strong> Double Extra Large</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-xl mb-4">Customer Reviews</h3>
                  <p className="text-muted-foreground">Reviews coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;