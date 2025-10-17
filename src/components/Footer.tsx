import { Link } from "react-router-dom";
import { Instagram, Twitter, Facebook, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-4">
              <img 
                src="/lovable-uploads/039d7f1e-851f-473a-896d-04b417fb99ed.png" 
                alt="T'RISHH Logo" 
                className="h-10 w-10 object-contain brightness-0 invert"
              />
              <span className="font-display text-3xl font-bold text-primary-foreground">
                T'RISHH
              </span>
            </Link>
            <p className="text-primary-foreground/80 text-sm leading-relaxed mb-6 max-w-md">
              Defined by Desire. T'RISHH brings you premium streetwear hoodies that combine luxury comfort with urban style. Limited edition drops for the discerning individual.
            </p>
            
            {/* Newsletter Signup */}
            <div className="space-y-3">
              <h4 className="font-semibold text-primary-foreground">Stay Updated</h4>
              <div className="flex space-x-2 max-w-sm">
                <Input 
                  placeholder="Enter your email"
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
                />
                <Button variant="secondary" size="sm">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-primary-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { name: "Shop", path: "/shop" },
                { name: "About Us", path: "/about" },
                { name: "Contact", path: "/contact" },
                { name: "FAQ", path: "/faq" },
                { name: "Size Guide", path: "/size-guide" },
                { name: "Shipping Info", path: "/shipping" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-primary-foreground/80 hover:text-accent transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="font-semibold text-primary-foreground mb-4">Connect</h4>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-accent" />
                <a 
                  href="mailto:trishhna.studio@gmail.com"
                  className="text-primary-foreground/80 hover:text-accent transition-colors text-sm"
                >
                  trishhna.studio@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-accent" />
                <span className="text-primary-foreground/80 text-sm">+91 XXXXX XXXXX</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-accent" />
                <span className="text-primary-foreground/80 text-sm">India</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="space-y-3">
              <h5 className="font-medium text-primary-foreground text-sm">Follow Us</h5>
              <div className="flex space-x-3">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-foreground/80 hover:text-accent hover:bg-primary-foreground/10">
                  <Instagram className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-foreground/80 hover:text-accent hover:bg-primary-foreground/10">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-foreground/80 hover:text-accent hover:bg-primary-foreground/10">
                  <Facebook className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-primary-foreground/60 text-sm">
            © 2024 T'RISHH. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="/privacy" className="text-primary-foreground/60 hover:text-accent transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-primary-foreground/60 hover:text-accent transition-colors text-sm">
              Terms of Service
            </Link>
            <Link to="/returns" className="text-primary-foreground/60 hover:text-accent transition-colors text-sm">
              Returns
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};