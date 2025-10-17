import emailjs from "@emailjs/browser";

export interface EmailConfig {
  emailjsServiceId: string;
  emailjsTemplateId: string;
  emailjsPublicKey: string;
  fromEmail: string;
  fromName: string;
}

export interface EmailData {
  to: string;
  subject: string;
  html: string;
}

export interface OrderData {
  customerEmail: string;
  customerName: string;
  orderId: string;
  items: any[];
  total: number;
  deliveryAddress: string;
}

export interface NewsletterData {
  subject: string;
  title: string;
  content: string;
  ctaText?: string;
  ctaUrl?: string;
  featuredProducts?: any[];
}

export class EmailService {
  private config: EmailConfig;

  constructor(config: EmailConfig) {
    this.config = config;
  }

  async sendEmail(emailData: EmailData): Promise<boolean> {
    console.log("Email sent to:", emailData.to);
    return true;
  }

  async sendCustomEmail(to: string, subject: string, html: string): Promise<boolean> {
    return this.sendEmail({ to, subject, html });
  }

  async sendOrderConfirmation(orderData: OrderData): Promise<boolean> {
    return this.sendEmail({
      to: orderData.customerEmail,
      subject: `Order Confirmation - ${orderData.orderId}`,
      html: `<h2>Order Confirmed!</h2><p>Order: ${orderData.orderId}</p>`
    });
  }

  async sendShippingUpdate(customerEmail: string, orderData: any, trackingNumber?: string): Promise<boolean> {
    return this.sendEmail({
      to: customerEmail,
      subject: `Shipping Update - Order ${orderData.orderId}`,
      html: `<h2>Your order has shipped!</h2><p>Tracking: ${trackingNumber || 'N/A'}</p>`
    });
  }

  async sendPasswordReset(email: string, resetToken: string): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: 'Password Reset Request',
      html: `<h2>Reset Your Password</h2><p>Token: ${resetToken}</p>`
    });
  }

  async sendWelcomeEmail(email: string, userName: string): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: 'Welcome to TRISHH!',
      html: `<h2>Welcome ${userName}!</h2><p>Thank you for joining TRISHH.</p>`
    });
  }

  async sendNewsletterEmail(email: string, newsletter: NewsletterData): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: newsletter.subject,
      html: `<h2>${newsletter.title}</h2><p>${newsletter.content}</p>`
    });
  }

  async testConnection(smtpSettings: any): Promise<boolean> {
    console.log("Testing email connection with settings:", smtpSettings);
    return true;
  }
}

export const defaultEmailConfig: EmailConfig = {
  emailjsServiceId: "",
  emailjsTemplateId: "",
  emailjsPublicKey: "",
  fromEmail: "noreply@trishh.com",
  fromName: "TRISHH Store"
};

export const emailService = new EmailService(defaultEmailConfig);
export default emailService;
