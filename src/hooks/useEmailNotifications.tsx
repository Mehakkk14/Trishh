import { useState } from "react";
import { emailService } from "../services/emailService";
import { toast } from "sonner";

interface EmailData {
  to: string;
  subject: string;
  html: string;
}

interface NewsletterData {
  subject: string;
  title: string;
  content: string;
  ctaText?: string;
  ctaUrl?: string;
  featuredProducts?: any[];
}

interface BulkEmailData {
  emails: string[];
  newsletter: NewsletterData;
}

export const useEmailNotifications = () => {
  const [isLoading, setIsLoading] = useState(false);

  const sendOrderConfirmation = async (customerEmail: string, orderData: any) => {
    try {
      setIsLoading(true);
      // Transform the data to match the expected OrderData interface
      const emailOrderData = {
        customerEmail: customerEmail,
        customerName: orderData.customerName || 'Valued Customer',
        orderId: orderData.orderId || orderData.id || 'Unknown',
        items: orderData.items || [],
        total: orderData.total || 0,
        deliveryAddress: orderData.deliveryAddress || 'Address not provided'
      };
      await emailService.sendOrderConfirmation(emailOrderData);
      toast.success("Order confirmation email sent successfully");
      return true;
    } catch (error) {
      console.error("Failed to send order confirmation:", error);
      toast.error("Failed to send order confirmation email");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const sendShippingUpdate = async (customerEmail: string, orderData: any, trackingNumber?: string) => {
    try {
      setIsLoading(true);
      await emailService.sendShippingUpdate(customerEmail, orderData, trackingNumber);
      toast.success("Shipping update email sent successfully");
      return true;
    } catch (error) {
      console.error("Failed to send shipping update:", error);
      toast.error("Failed to send shipping update email");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const sendPasswordReset = async (email: string, resetToken: string) => {
    try {
      setIsLoading(true);
      await emailService.sendPasswordReset(email, resetToken);
      toast.success("Password reset email sent successfully");
      return true;
    } catch (error) {
      console.error("Failed to send password reset:", error);
      toast.error("Failed to send password reset email");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const sendWelcomeEmail = async (email: string, userName: string) => {
    try {
      setIsLoading(true);
      await emailService.sendWelcomeEmail(email, userName);
      toast.success("Welcome email sent successfully");
      return true;
    } catch (error) {
      console.error("Failed to send welcome email:", error);
      toast.error("Failed to send welcome email");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const sendBulkNewsletterEmails = async (data: BulkEmailData) => {
    try {
      setIsLoading(true);
      const results = await Promise.allSettled(
        data.emails.map(email => 
          emailService.sendNewsletterEmail(email, data.newsletter)
        )
      );

      const successful = results.filter(result => result.status === 'fulfilled').length;
      const failed = results.filter(result => result.status === 'rejected').length;

      if (successful > 0) {
        toast.success(`Newsletter sent to ${successful} subscribers successfully`);
      }
      
      if (failed > 0) {
        toast.error(`Failed to send to ${failed} subscribers`);
      }

      return { successful, failed };
    } catch (error) {
      console.error("Failed to send bulk newsletter:", error);
      toast.error("Failed to send newsletter");
      return { successful: 0, failed: data.emails.length };
    } finally {
      setIsLoading(false);
    }
  };

  const testEmailConnection = async (smtpSettings: any) => {
    try {
      setIsLoading(true);
      // Test email with current settings
      await emailService.testConnection(smtpSettings);
      toast.success("Email connection test successful");
      return true;
    } catch (error) {
      console.error("Email connection test failed:", error);
      toast.error("Email connection test failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const sendTestEmail = async (toEmail: string, testType: string = "connection") => {
    try {
      setIsLoading(true);
      
      const testData = {
        subject: "TRISHH - Email Test",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Email Test Successful</h2>
            <p>This is a test email from TRISHH Desire Shop.</p>
            <p>Test Type: ${testType}</p>
            <p>If you received this email, your email configuration is working correctly.</p>
            <hr style="margin: 20px 0;">
            <p style="font-size: 12px; color: #666;">
              This is an automated test email from TRISHH Desire Shop.
            </p>
          </div>
        `
      };

      await emailService.sendCustomEmail(toEmail, testData.subject, testData.html);
      toast.success("Test email sent successfully");
      return true;
    } catch (error) {
      console.error("Failed to send test email:", error);
      toast.error("Failed to send test email");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    sendOrderConfirmation,
    sendShippingUpdate,
    sendPasswordReset,
    sendWelcomeEmail,
    sendBulkNewsletterEmails,
    testEmailConnection,
    sendTestEmail
  };
};