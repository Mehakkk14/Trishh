// Email template generators for TRISHH store
export const EmailTemplates = {
  
  // Order Confirmation Email Template
  orderConfirmation: (orderData: {
    orderId: string;
    customerName: string;
    items: Array<{
      name: string;
      price: number;
      quantity: number;
      image?: string;
    }>;
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    shippingAddress: {
      name: string;
      street: string;
      city: string;
      state: string;
      zip: string;
    };
    estimatedDelivery: string;
  }) => {
    const itemsHTML = orderData.items.map(item => `
      <tr>
        <td style="padding: 15px; border-bottom: 1px solid #eee;">
          <div style="display: flex; align-items: center;">
            ${item.image ? `<img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; margin-right: 15px;">` : ''}
            <div>
              <h4 style="margin: 0; color: #333; font-size: 16px;">${item.name}</h4>
              <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">Quantity: ${item.quantity}</p>
            </div>
          </div>
        </td>
        <td style="padding: 15px; border-bottom: 1px solid #eee; text-align: right; color: #333; font-weight: 600;">
          $${(item.price * item.quantity).toFixed(2)}
        </td>
      </tr>
    `).join('');

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation - TRISHH</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
            <h1 style="margin: 0; color: white; font-size: 32px; font-weight: 700; letter-spacing: 2px;">TRISHH</h1>
            <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">Premium Fashion Store</p>
          </div>

          <!-- Main Content -->
          <div style="padding: 40px 30px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="width: 60px; height: 60px; background-color: #4CAF50; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                <span style="color: white; font-size: 24px;">✓</span>
              </div>
              <h2 style="margin: 0; color: #333; font-size: 28px; font-weight: 600;">Order Confirmed!</h2>
              <p style="margin: 15px 0 0 0; color: #666; font-size: 16px;">Thank you for your purchase, ${orderData.customerName}!</p>
            </div>

            <!-- Order Details -->
            <div style="background-color: #f8f9fa; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
              <h3 style="margin: 0 0 15px 0; color: #333; font-size: 18px; font-weight: 600;">Order Details</h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div>
                  <p style="margin: 0; color: #666; font-size: 14px;">Order Number</p>
                  <p style="margin: 5px 0 0 0; color: #333; font-weight: 600; font-family: monospace;">${orderData.orderId}</p>
                </div>
                <div>
                  <p style="margin: 0; color: #666; font-size: 14px;">Estimated Delivery</p>
                  <p style="margin: 5px 0 0 0; color: #333; font-weight: 600;">${orderData.estimatedDelivery}</p>
                </div>
              </div>
            </div>

            <!-- Order Items -->
            <div style="margin-bottom: 30px;">
              <h3 style="margin: 0 0 20px 0; color: #333; font-size: 18px; font-weight: 600;">Order Items</h3>
              <table style="width: 100%; border-collapse: collapse; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                ${itemsHTML}
              </table>
            </div>

            <!-- Order Summary -->
            <div style="background-color: #f8f9fa; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
              <h3 style="margin: 0 0 20px 0; color: #333; font-size: 18px; font-weight: 600;">Order Summary</h3>
              <div style="space-y: 10px;">
                <div style="display: flex; justify-content: space-between; padding: 8px 0;">
                  <span style="color: #666;">Subtotal</span>
                  <span style="color: #333;">$${orderData.subtotal.toFixed(2)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 8px 0;">
                  <span style="color: #666;">Shipping</span>
                  <span style="color: #333;">$${orderData.shipping.toFixed(2)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 8px 0;">
                  <span style="color: #666;">Tax</span>
                  <span style="color: #333;">$${orderData.tax.toFixed(2)}</span>
                </div>
                <div style="border-top: 2px solid #ddd; margin-top: 15px; padding-top: 15px;">
                  <div style="display: flex; justify-content: space-between;">
                    <span style="color: #333; font-weight: 700; font-size: 18px;">Total</span>
                    <span style="color: #333; font-weight: 700; font-size: 18px;">$${orderData.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Shipping Address -->
            <div style="background-color: #f8f9fa; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
              <h3 style="margin: 0 0 15px 0; color: #333; font-size: 18px; font-weight: 600;">Shipping Address</h3>
              <div style="color: #666; line-height: 1.6;">
                <p style="margin: 0; font-weight: 600; color: #333;">${orderData.shippingAddress.name}</p>
                <p style="margin: 5px 0 0 0;">${orderData.shippingAddress.street}</p>
                <p style="margin: 5px 0 0 0;">${orderData.shippingAddress.city}, ${orderData.shippingAddress.state} ${orderData.shippingAddress.zip}</p>
              </div>
            </div>

            <!-- Next Steps -->
            <div style="text-align: center; margin-bottom: 30px;">
              <h3 style="margin: 0 0 15px 0; color: #333; font-size: 18px; font-weight: 600;">What's Next?</h3>
              <p style="margin: 0 0 20px 0; color: #666; line-height: 1.6;">
                We'll send you a shipping confirmation email with tracking information once your order is on its way.
              </p>
              <a href="#" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 12px 30px; border-radius: 25px; font-weight: 600; margin: 10px;">
                Track Your Order
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #eee;">
            <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">
              Need help? Contact us at <a href="mailto:support@trishh.com" style="color: #667eea;">support@trishh.com</a>
            </p>
            <p style="margin: 0; color: #999; font-size: 12px;">
              © 2025 TRISHH. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  },

  // Shipping Update Email Template
  shippingUpdate: (orderData: {
    orderId: string;
    customerName: string;
    trackingNumber?: string;
    carrier?: string;
    estimatedDelivery: string;
    shippingAddress: {
      name: string;
      street: string;
      city: string;
      state: string;
      zip: string;
    };
  }) => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Order is on the Way - TRISHH</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
            <h1 style="margin: 0; color: white; font-size: 32px; font-weight: 700; letter-spacing: 2px;">TRISHH</h1>
            <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">Premium Fashion Store</p>
          </div>

          <!-- Main Content -->
          <div style="padding: 40px 30px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="width: 60px; height: 60px; background-color: #2196F3; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                <span style="color: white; font-size: 24px;">🚚</span>
              </div>
              <h2 style="margin: 0; color: #333; font-size: 28px; font-weight: 600;">Your Order is on the Way!</h2>
              <p style="margin: 15px 0 0 0; color: #666; font-size: 16px;">Hi ${orderData.customerName}, your order has been shipped!</p>
            </div>

            <!-- Tracking Information -->
            <div style="background-color: #f8f9fa; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
              <h3 style="margin: 0 0 20px 0; color: #333; font-size: 18px; font-weight: 600;">Tracking Information</h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div>
                  <p style="margin: 0; color: #666; font-size: 14px;">Order Number</p>
                  <p style="margin: 5px 0 0 0; color: #333; font-weight: 600; font-family: monospace;">${orderData.orderId}</p>
                </div>
                <div>
                  <p style="margin: 0; color: #666; font-size: 14px;">Estimated Delivery</p>
                  <p style="margin: 5px 0 0 0; color: #333; font-weight: 600;">${orderData.estimatedDelivery}</p>
                </div>
                ${orderData.trackingNumber ? `
                <div>
                  <p style="margin: 0; color: #666; font-size: 14px;">Tracking Number</p>
                  <p style="margin: 5px 0 0 0; color: #333; font-weight: 600; font-family: monospace;">${orderData.trackingNumber}</p>
                </div>
                ` : ''}
                ${orderData.carrier ? `
                <div>
                  <p style="margin: 0; color: #666; font-size: 14px;">Carrier</p>
                  <p style="margin: 5px 0 0 0; color: #333; font-weight: 600;">${orderData.carrier}</p>
                </div>
                ` : ''}
              </div>
            </div>

            <!-- Track Package Button -->
            ${orderData.trackingNumber ? `
            <div style="text-align: center; margin-bottom: 30px;">
              <a href="#" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 15px 40px; border-radius: 25px; font-weight: 600; font-size: 16px;">
                Track Your Package
              </a>
            </div>
            ` : ''}

            <!-- Shipping Address -->
            <div style="background-color: #f8f9fa; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
              <h3 style="margin: 0 0 15px 0; color: #333; font-size: 18px; font-weight: 600;">Shipping To</h3>
              <div style="color: #666; line-height: 1.6;">
                <p style="margin: 0; font-weight: 600; color: #333;">${orderData.shippingAddress.name}</p>
                <p style="margin: 5px 0 0 0;">${orderData.shippingAddress.street}</p>
                <p style="margin: 5px 0 0 0;">${orderData.shippingAddress.city}, ${orderData.shippingAddress.state} ${orderData.shippingAddress.zip}</p>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #eee;">
            <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">
              Need help? Contact us at <a href="mailto:support@trishh.com" style="color: #667eea;">support@trishh.com</a>
            </p>
            <p style="margin: 0; color: #999; font-size: 12px;">
              © 2025 TRISHH. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  },

  // Password Reset Email Template
  passwordReset: (resetData: {
    customerName: string;
    resetToken: string;
    resetUrl: string;
    expiryTime: string;
  }) => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password - TRISHH</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
            <h1 style="margin: 0; color: white; font-size: 32px; font-weight: 700; letter-spacing: 2px;">TRISHH</h1>
            <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">Premium Fashion Store</p>
          </div>

          <!-- Main Content -->
          <div style="padding: 40px 30px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="width: 60px; height: 60px; background-color: #FF9800; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                <span style="color: white; font-size: 24px;">🔐</span>
              </div>
              <h2 style="margin: 0; color: #333; font-size: 28px; font-weight: 600;">Reset Your Password</h2>
              <p style="margin: 15px 0 0 0; color: #666; font-size: 16px;">Hi ${resetData.customerName}, we received a request to reset your password.</p>
            </div>

            <!-- Reset Instructions -->
            <div style="background-color: #f8f9fa; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
              <p style="margin: 0 0 20px 0; color: #666; line-height: 1.6;">
                Click the button below to reset your password. This link will expire in ${resetData.expiryTime} for security reasons.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetData.resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 15px 40px; border-radius: 25px; font-weight: 600; font-size: 16px;">
                  Reset My Password
                </a>
              </div>

              <p style="margin: 20px 0 0 0; color: #666; font-size: 14px; line-height: 1.6;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${resetData.resetUrl}" style="color: #667eea; word-break: break-all;">${resetData.resetUrl}</a>
              </p>
            </div>

            <!-- Security Notice -->
            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
              <h4 style="margin: 0 0 10px 0; color: #856404; font-size: 16px;">Security Notice</h4>
              <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.5;">
                If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #eee;">
            <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">
              Need help? Contact us at <a href="mailto:support@trishh.com" style="color: #667eea;">support@trishh.com</a>
            </p>
            <p style="margin: 0; color: #999; font-size: 12px;">
              © 2025 TRISHH. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  },

  // Welcome Email Template
  welcome: (welcomeData: {
    customerName: string;
    email: string;
  }) => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to TRISHH! - TRISHH</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
            <h1 style="margin: 0; color: white; font-size: 32px; font-weight: 700; letter-spacing: 2px;">TRISHH</h1>
            <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">Premium Fashion Store</p>
          </div>

          <!-- Main Content -->
          <div style="padding: 40px 30px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="width: 60px; height: 60px; background-color: #4CAF50; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                <span style="color: white; font-size: 24px;">🎉</span>
              </div>
              <h2 style="margin: 0; color: #333; font-size: 28px; font-weight: 600;">Welcome to TRISHH!</h2>
              <p style="margin: 15px 0 0 0; color: #666; font-size: 16px;">Hi ${welcomeData.customerName}, thank you for joining our fashion community!</p>
            </div>

            <!-- Welcome Message -->
            <div style="background-color: #f8f9fa; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
              <p style="margin: 0 0 20px 0; color: #666; line-height: 1.6; font-size: 16px;">
                We're thrilled to have you as part of the TRISHH family! Get ready to discover premium fashion pieces that reflect your unique style.
              </p>
              
              <h3 style="margin: 20px 0 15px 0; color: #333; font-size: 18px; font-weight: 600;">What's Next?</h3>
              <ul style="margin: 0; padding-left: 20px; color: #666; line-height: 1.8;">
                <li>Explore our latest collections</li>
                <li>Get exclusive access to sales and new arrivals</li>
                <li>Enjoy free shipping on orders over $100</li>
                <li>Earn points with every purchase</li>
              </ul>
            </div>

            <!-- Call to Action -->
            <div style="text-align: center; margin-bottom: 30px;">
              <a href="#" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 15px 40px; border-radius: 25px; font-weight: 600; font-size: 16px; margin: 10px;">
                Start Shopping
              </a>
            </div>

            <!-- Featured Collections -->
            <div style="background-color: #f8f9fa; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
              <h3 style="margin: 0 0 20px 0; color: #333; font-size: 18px; font-weight: 600; text-align: center;">Featured Collections</h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; text-align: center;">
                <div>
                  <div style="background-color: #667eea; height: 100px; border-radius: 8px; margin-bottom: 10px; display: flex; align-items: center; justify-content: center;">
                    <span style="color: white; font-size: 24px;">👔</span>
                  </div>
                  <p style="margin: 0; color: #333; font-weight: 600;">Premium Shirts</p>
                </div>
                <div>
                  <div style="background-color: #764ba2; height: 100px; border-radius: 8px; margin-bottom: 10px; display: flex; align-items: center; justify-content: center;">
                    <span style="color: white; font-size: 24px;">👗</span>
                  </div>
                  <p style="margin: 0; color: #333; font-weight: 600;">Designer Dresses</p>
                </div>
              </div>
            </div>

            <!-- Social Media -->
            <div style="text-align: center; margin-bottom: 30px;">
              <h3 style="margin: 0 0 20px 0; color: #333; font-size: 18px; font-weight: 600;">Follow Us</h3>
              <p style="margin: 0 0 20px 0; color: #666;">Stay updated with our latest trends and exclusive offers!</p>
              <div style="display: inline-flex; gap: 15px;">
                <a href="#" style="display: inline-block; width: 40px; height: 40px; background-color: #667eea; border-radius: 50%; color: white; text-decoration: none; line-height: 40px; text-align: center;">f</a>
                <a href="#" style="display: inline-block; width: 40px; height: 40px; background-color: #667eea; border-radius: 50%; color: white; text-decoration: none; line-height: 40px; text-align: center;">📷</a>
                <a href="#" style="display: inline-block; width: 40px; height: 40px; background-color: #667eea; border-radius: 50%; color: white; text-decoration: none; line-height: 40px; text-align: center;">🐦</a>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #eee;">
            <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">
              Need help? Contact us at <a href="mailto:support@trishh.com" style="color: #667eea;">support@trishh.com</a>
            </p>
            <p style="margin: 0; color: #999; font-size: 12px;">
              © 2025 TRISHH. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  },

  // Newsletter Email Template
  newsletter: (newsletterData: {
    title: string;
    content: string;
    featuredProducts?: Array<{
      name: string;
      price: number;
      image: string;
      url: string;
    }>;
    ctaText?: string;
    ctaUrl?: string;
  }) => {
    const productsHTML = newsletterData.featuredProducts ? newsletterData.featuredProducts.map(product => `
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="${product.image}" alt="${product.name}" style="width: 100%; max-width: 200px; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 10px;">
        <h4 style="margin: 0; color: #333; font-size: 16px; font-weight: 600;">${product.name}</h4>
        <p style="margin: 5px 0 10px 0; color: #667eea; font-size: 18px; font-weight: 600;">$${product.price}</p>
        <a href="${product.url}" style="display: inline-block; background-color: #667eea; color: white; text-decoration: none; padding: 8px 20px; border-radius: 20px; font-size: 14px;">Shop Now</a>
      </div>
    `).join('') : '';

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${newsletterData.title} - TRISHH</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
            <h1 style="margin: 0; color: white; font-size: 32px; font-weight: 700; letter-spacing: 2px;">TRISHH</h1>
            <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">Premium Fashion Store</p>
          </div>

          <!-- Main Content -->
          <div style="padding: 40px 30px;">
            <h2 style="margin: 0 0 20px 0; color: #333; font-size: 28px; font-weight: 600; text-align: center;">${newsletterData.title}</h2>
            
            <div style="color: #666; line-height: 1.6; font-size: 16px; margin-bottom: 30px;">
              ${newsletterData.content}
            </div>

            ${newsletterData.featuredProducts ? `
            <!-- Featured Products -->
            <div style="margin-bottom: 30px;">
              <h3 style="margin: 0 0 30px 0; color: #333; font-size: 22px; font-weight: 600; text-align: center;">Featured Products</h3>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 30px;">
                ${productsHTML}
              </div>
            </div>
            ` : ''}

            ${newsletterData.ctaText && newsletterData.ctaUrl ? `
            <!-- Call to Action -->
            <div style="text-align: center; margin-bottom: 30px;">
              <a href="${newsletterData.ctaUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 15px 40px; border-radius: 25px; font-weight: 600; font-size: 16px;">
                ${newsletterData.ctaText}
              </a>
            </div>
            ` : ''}
          </div>

          <!-- Footer -->
          <div style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #eee;">
            <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">
              You're receiving this email because you subscribed to TRISHH newsletter.
            </p>
            <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">
              <a href="#" style="color: #667eea;">Unsubscribe</a> | <a href="#" style="color: #667eea;">Update Preferences</a>
            </p>
            <p style="margin: 0; color: #999; font-size: 12px;">
              © 2025 TRISHH. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
};

export default EmailTemplates;