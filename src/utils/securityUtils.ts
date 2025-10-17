// Security utilities for input validation and sanitization

export class SecurityUtils {
  // Input sanitization
  static sanitizeHTML(html: string): string {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
  }

  static sanitizeText(text: string): string {
    if (!text) return '';
    return text
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '')
      .trim();
  }

  // Validation functions
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  static validatePassword(password: string): { 
    isValid: boolean; 
    errors: string[]; 
    strength: 'weak' | 'medium' | 'strong' 
  } {
    const errors: string[] = [];
    let score = 0;

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    } else {
      score += 1;
    }

    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    } else {
      score += 1;
    }

    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    } else {
      score += 1;
    }

    if (!/(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one number');
    } else {
      score += 1;
    }

    if (!/(?=.*[@$!%*?&])/.test(password)) {
      errors.push('Password must contain at least one special character');
    } else {
      score += 1;
    }

    const strength = score <= 2 ? 'weak' : score <= 4 ? 'medium' : 'strong';

    return {
      isValid: errors.length === 0,
      errors,
      strength
    };
  }

  static validatePhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  }

  static validateName(name: string): boolean {
    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    return nameRegex.test(name.trim());
  }

  static validateAmount(amount: string | number): boolean {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return !isNaN(num) && num > 0 && num <= 1000000; // Max 10 lakh
  }

  // File validation
  static validateImageFile(file: File): { isValid: boolean; error?: string } {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' };
    }

    if (file.size > maxSize) {
      return { isValid: false, error: 'File size too large. Maximum 5MB allowed.' };
    }

    return { isValid: true };
  }

  // Rate limiting
  private static rateLimitStore = new Map<string, { count: number; resetTime: number }>();

  static checkRateLimit(key: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
    const now = Date.now();
    const record = this.rateLimitStore.get(key);

    if (!record || now > record.resetTime) {
      this.rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (record.count >= maxRequests) {
      return false;
    }

    record.count++;
    return true;
  }

  // CSRF Protection
  static generateCSRFToken(): string {
    return crypto.randomUUID();
  }

  static validateCSRFToken(token: string, storedToken: string): boolean {
    return token === storedToken && token.length > 0;
  }

  // XSS Protection
  static escapeHTML(text: string): string {
    const map: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;'
    };
    
    return text.replace(/[&<>"'/]/g, (char) => map[char]);
  }

  // SQL Injection Prevention (for any direct queries)
  static sanitizeForQuery(input: string): string {
    return input
      .replace(/['";\\]/g, '')
      .replace(/(-{2}|\/\*|\*\/)/g, '')
      .trim();
  }

  // Content Security Policy helpers
  static generateNonce(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array));
  }

  // Log security events
  static logSecurityEvent(event: string, details: any = {}): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      details,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // In development, log to console
    if (import.meta.env.MODE === 'development') {
      console.warn('[SECURITY EVENT]', logEntry);
    }

    // In production, send to monitoring service
    // You could send this to Firebase, Sentry, or another monitoring service
  }

  // Detect potential attacks
  static detectSuspiciousPatterns(input: string): { suspicious: boolean; patterns: string[] } {
    const suspiciousPatterns = [
      { pattern: /<script/i, name: 'Script tag' },
      { pattern: /javascript:/i, name: 'JavaScript protocol' },
      { pattern: /on\w+\s*=/i, name: 'Event handler' },
      { pattern: /union\s+select/i, name: 'SQL injection' },
      { pattern: /\bdrop\s+table\b/i, name: 'SQL drop table' },
      { pattern: /\bdelete\s+from\b/i, name: 'SQL delete' },
      { pattern: /\binsert\s+into\b/i, name: 'SQL insert' },
      { pattern: /\bupdate\s+\w+\s+set\b/i, name: 'SQL update' },
      { pattern: /<iframe/i, name: 'Iframe tag' },
      { pattern: /<object/i, name: 'Object tag' },
      { pattern: /<embed/i, name: 'Embed tag' }
    ];

    const detectedPatterns: string[] = [];

    for (const { pattern, name } of suspiciousPatterns) {
      if (pattern.test(input)) {
        detectedPatterns.push(name);
      }
    }

    return {
      suspicious: detectedPatterns.length > 0,
      patterns: detectedPatterns
    };
  }

  // Secure random string generation
  static generateSecureToken(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const randomArray = new Uint8Array(length);
    crypto.getRandomValues(randomArray);
    
    for (let i = 0; i < length; i++) {
      result += chars[randomArray[i] % chars.length];
    }
    
    return result;
  }

  // Environment validation
  static validateEnvironment(): { secure: boolean; warnings: string[] } {
    const warnings: string[] = [];
    
    // Check if running on HTTPS in production
    if (import.meta.env.PROD && location.protocol !== 'https:') {
      warnings.push('Application should use HTTPS in production');
    }

    // Check for development keys in production
    if (import.meta.env.PROD) {
      const envVars = [
        'VITE_FIREBASE_API_KEY',
        'VITE_RAZORPAY_KEY_ID',
        'VITE_EMAILJS_SERVICE_ID'
      ];

      envVars.forEach(varName => {
        const value = import.meta.env[varName];
        if (!value || value.includes('test') || value.includes('dev')) {
          warnings.push(`${varName} appears to be a development key`);
        }
      });
    }

    return {
      secure: warnings.length === 0,
      warnings
    };
  }
}

export default SecurityUtils;