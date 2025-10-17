import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Layout } from "./components/Layout";
import { AdminRoute } from "./components/AdminRoute";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { performanceMonitor } from "./services/performanceMonitor";
import { seoService } from "./services/seoService";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import Wishlist from "./pages/Wishlist";

const queryClient = new QueryClient();

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Track page view and update SEO
    const pageName = pathname === '/' ? 'Home' : pathname.slice(1).replace(/\//g, ' - ');
    performanceMonitor.trackPageView(pageName);
    
    // Update basic SEO for each page
    const pageConfig = {
      '/': {
        title: 'TRISHH Desire Shop - Your Fashion Destination',
        description: 'Discover the latest fashion trends at TRISHH Desire Shop. Quality clothing, accessories, and more at unbeatable prices.',
        keywords: 'fashion, clothing, online shopping, trendy clothes, TRISHH'
      },
      '/shop': {
        title: 'Shop Latest Fashion - TRISHH Desire Shop',
        description: 'Browse our extensive collection of fashionable clothing and accessories. Find your perfect style today.',
        keywords: 'shop, buy clothes, fashion store, online shopping'
      },
      '/about': {
        title: 'About Us - TRISHH Desire Shop',
        description: 'Learn about TRISHH Desire Shop, our mission to bring you the best in fashion and our commitment to quality.',
        keywords: 'about us, fashion store, company info'
      },
      '/contact': {
        title: 'Contact Us - TRISHH Desire Shop',
        description: 'Get in touch with TRISHH Desire Shop. We\'re here to help with your fashion needs and questions.',
        keywords: 'contact, customer service, help, support'
      }
    };

    const config = pageConfig[pathname] || {
      title: `${pageName} - TRISHH Desire Shop`,
      description: 'TRISHH Desire Shop - Your one-stop destination for fashion and style.',
      keywords: 'fashion, shopping, TRISHH'
    };

    seoService.updateMetaTags(config);
  }, [pathname]);

  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <CartProvider>
        <WishlistProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Index />} />
              <Route path="shop" element={<Shop />} />
              <Route path="product/:id" element={<ProductDetail />} />
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="faq" element={<FAQ />} />
              <Route path="profile" element={<Profile />} />
              <Route path="orders" element={<Orders />} />
              <Route path="wishlist" element={<Wishlist />} />
            </Route>
            <Route path="auth" element={<Auth />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route path="admin" element={<AdminRoute><Admin /></AdminRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </WishlistProvider>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
