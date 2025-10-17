import { useState } from 'react';
import { emailService } from '@/services/emailService';
import { useToast } from '@/hooks/use-toast';

export interface OrderData {
  customerEmail: string;
  customerName: string;
  orderId: string;
  items: any[];
  total: number;
  deliveryAddress: string;
}

export const useEmailNotifications = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendOrderConfirmation = async (orderData: OrderData): Promise<boolean> => {
    setIsLoading(true);
    try {
      const success = await emailService.sendOrderConfirmation(orderData);
      if (success) {
        console.log('Order confirmation email sent to:', orderData.customerEmail);
        toast({
          title: "Order Confirmation Sent",
          description: `Confirmation email sent to ${orderData.customerEmail}`,
        });
      } else {
        console.warn('Order confirmation email failed for:', orderData.customerEmail);
        toast({
          title: "Email Failed",
          description: "Failed to send order confirmation email",
          variant: "destructive",
        });
      }
      return success;
    } catch (error) {
      console.error('Order confirmation email error:', error);
      toast({
        title: "Email Error",
        description: "An error occurred while sending the email",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const sendCustomEmail = async (customerEmail: string, subject: string, message: string) => {
    setIsLoading(true);
    try {
      const success = await emailService.sendEmail({
        to: customerEmail,
        subject,
        html: message,
      });

      if (success) {
        toast({
          title: "Email Sent",
          description: `Email sent successfully to ${customerEmail}`,
        });
      } else {
        toast({
          title: "Email Failed",
          description: "Failed to send email",
          variant: "destructive",
        });
      }
      return success;
    } catch (error) {
      console.error('Error sending custom email:', error);
      toast({
        title: "Email Error",
        description: "An error occurred while sending the email",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    sendOrderConfirmation,
    sendCustomEmail,
  };
};
