import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Filter, Grid, List, Loader2, Heart } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { ImageUtils } from "@/utils/imageUtils";

const Shop = () => {
  const { addItem } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  const { products: dbProducts, loading, error } = useProducts();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  // Convert database products to component format
  const products = useMemo(() => {
    return dbProducts.map(product => ({
      id: product.id,
      name: product.name,
      price: product.discount_price || product.price,
      originalPrice: product.discount_price ? product.price : undefined,
      image: ImageUtils.getProductImage(product.images[0]),
      colors: product.colors,
      sizes: product.sizes,
      badge: product.badge,
      rating: product.rating,
      stock: product.stock_quantity
    }));
  }, [dbProducts]);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      // Price filter
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }

      // Size filter
      if (selectedSizes.length > 0) {
        const hasMatchingSize = selectedSizes.some(size => 
          product.sizes.includes(size)
        );
        if (!hasMatchingSize) return false;
      }

      // Color filter
      if (selectedColors.length > 0) {
        const hasMatchingColor = selectedColors.some(color => 
          product.colors.some(productColor => 
            productColor.toLowerCase().includes(color.toLowerCase())
          )
        );
        if (!hasMatchingColor) return false;
      }

      return true;
    });

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        // For now, we'll sort by ID (newest products have higher IDs)
        filtered.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'featured':
      default:
        // Keep original order for featured
        break;
    }

    return filtered;
  }, [products, priceRange, selectedSizes, selectedColors, sortBy]);

  const sizes = ["S", "M", "L", "XL", "XXL"];
  const colors = ["Navy", "Black", "Gray", "White"];

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors(prev => 
      prev.includes(color) 
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      size: "M", // Default size
      image: product.image
    });
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleBuyNow = (product: any) => {
    // Add to cart first
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      size: "M", // Default size
      image: product.image
    });
    // Then navigate to checkout
    navigate('/checkout');
  };

  const clearAllFilters = () => {
    setPriceRange([0, 10000]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setSortBy('featured');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Shop Collection
          </h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Discover our premium hoodies designed for the modern urban lifestyle.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-64 space-y-6">
            <div className="bg-card p-6 rounded-lg shadow-card">
              <h3 className="font-semibold text-lg mb-4 flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filters
              </h3>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Price Range</h4>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={10000}
                  min={0}
                  step={500}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>₹{priceRange[0].toLocaleString()}</span>
                  <span>₹{priceRange[1].toLocaleString()}</span>
                </div>
              </div>

              {/* Sizes */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Size</h4>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSizes.includes(size) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleSize(size)}
                      className="h-8 w-12"
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Color</h4>
                <div className="space-y-2">
                  {colors.map((color) => (
                    <label key={color} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedColors.includes(color)}
                        onChange={() => toggleColor(color)}
                        className="rounded border-gray-300 text-accent focus:ring-accent"
                      />
                      <span className="text-sm">{color}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <Button 
                variant="outline" 
                className="w-full"
                onClick={clearAllFilters}
              >
                Clear All Filters
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <p className="text-muted-foreground">
                Showing {filteredAndSortedProducts.length} products
              </p>
              
              <div className="flex items-center gap-4">
                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Mode */}
                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading products...</span>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <p className="text-red-500 mb-4">Error loading products: {error}</p>
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            )}

            {/* Products Grid */}
            {!loading && !error && (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
              {filteredAndSortedProducts.map((product) => (
                <Card key={product.id} className="group overflow-hidden border-0 shadow-card hover-lift">
                  <div className="relative overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className={`w-full object-cover transition-transform duration-700 group-hover:scale-110 ${
                        viewMode === 'grid' ? 'h-64' : 'h-48'
                      }`}
                    />
                    <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
                      {product.badge}
                    </Badge>
                    <Button
                      size="icon"
                      variant="secondary"
                      className={`absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-8 w-8 ${
                        isInWishlist(product.id) ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-white/90 hover:bg-white'
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        if (isInWishlist(product.id)) {
                          removeFromWishlist(product.id);
                        } else {
                          addToWishlist({
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            images: [product.image],
                            category: "Clothing", // Default category
                            addedAt: new Date().toISOString()
                          });
                        }
                      }}
                    >
                      <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-white' : ''}`} />
                    </Button>
                  </div>
                  <CardContent className="p-6">
                    <div className={viewMode === 'list' ? 'flex justify-between items-start' : ''}>
                      <div className={viewMode === 'list' ? 'flex-1' : ''}>
                        <h3 className="font-semibold text-xl mb-2 text-foreground">{product.name}</h3>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`text-sm ${i < Math.floor(product.rating) ? 'text-accent' : 'text-gray-300'}`}>
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">({product.rating})</span>
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-2xl font-bold text-foreground">₹{product.price.toLocaleString()}</span>
                          {product.originalPrice && (
                            <span className="text-lg text-muted-foreground line-through">₹{product.originalPrice.toLocaleString()}</span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1 mb-4">
                          {product.colors.map((color) => (
                            <Badge key={color} variant="outline" className="text-xs">
                              {color}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className={`flex gap-2 ${viewMode === 'list' ? 'flex-col ml-4' : 'flex-row'}`}>
                        <Link to={`/product/${product.id}`}>
                          <Button variant="outline" size="sm" className="hover:bg-accent hover:text-accent-foreground">
                            View Details
                          </Button>
                        </Link>
                        <Button size="sm" className="hover-lift" onClick={() => handleAddToCart(product)}>
                          Add to Cart
                        </Button>
                        <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={() => handleBuyNow(product)}>
                          Buy Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;