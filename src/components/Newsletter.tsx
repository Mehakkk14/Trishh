import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Mail, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface NewsletterPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewsletterPopup = ({ isOpen, onClose }: NewsletterPopupProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
  // You can now add Firebase logic or use this as a UI component only.
      toast({
        title: "Subscribed! (Demo)",
        description: "This is a demo. Backend logic is not implemented.",
      });
      setEmail("");
      onClose();
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative bg-background rounded-lg shadow-premium max-w-md w-full mx-4 p-8 animate-scale-in">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>

        <div className="text-center mb-6">
          <Mail className="h-12 w-12 text-accent mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            Join T'RISHH Family
          </h2>
          <p className="text-muted-foreground">
            Get exclusive access to new drops, style tips, and special offers.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" className="w-full hover-lift" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Subscribing...
              </>
            ) : (
              'Subscribe Now'
            )}
          </Button>
        </form>

        <p className="text-xs text-muted-foreground text-center mt-4">
          No spam, unsubscribe anytime. By subscribing, you agree to our Privacy Policy.
        </p>
      </div>
    </div>
  );
};