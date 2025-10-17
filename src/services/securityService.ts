// Security service for authentication and authorization
import { auth, db } from '@/integrations/firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';

export interface UserRole {
  uid: string;
  email: string;
  role: 'admin' | 'customer';
  verified: boolean;
  createdAt: Date;
  lastLogin: Date;
}

export class SecurityService {
  private static instance: SecurityService;
  private currentUser: User | null = null;
  private userRole: UserRole | null = null;

  private constructor() {
    // Listen to auth state changes
    auth.onAuthStateChanged((user) => {
      this.currentUser = user;
      if (user) {
        this.loadUserRole(user.uid);
      } else {
        this.userRole = null;
      }
    });
  }

  static getInstance(): SecurityService {
    if (!SecurityService.instance) {
      SecurityService.instance = new SecurityService();
    }
    return SecurityService.instance;
  }

  // Load user role from Firestore
  private async loadUserRole(uid: string): Promise<void> {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        this.userRole = userDoc.data() as UserRole;
      }
    } catch (error) {
      console.error('Error loading user role:', error);
      this.userRole = null;
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  // Check if user is admin
  isAdmin(): boolean {
    return this.isAuthenticated() && 
           this.userRole?.role === 'admin' &&
           this.userRole?.verified === true;
  }

  // Check if user is verified
  isVerified(): boolean {
    return this.isAuthenticated() && 
           this.currentUser?.emailVerified === true &&
           this.userRole?.verified === true;
  }

  // Check if user owns a resource
  isOwner(resourceUserId: string): boolean {
    return this.isAuthenticated() && 
           this.currentUser?.uid === resourceUserId;
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Get user role
  getUserRole(): UserRole | null {
    return this.userRole;
  }

  // Validate user permissions for specific actions
  canCreateProduct(): boolean {
    return this.isAdmin();
  }

  canEditProduct(): boolean {
    return this.isAdmin();
  }

  canDeleteProduct(): boolean {
    return this.isAdmin();
  }

  canViewAdminPanel(): boolean {
    return this.isAdmin();
  }

  canManageOrders(): boolean {
    return this.isAdmin();
  }

  canViewOrder(orderUserId: string): boolean {
    return this.isAdmin() || this.isOwner(orderUserId);
  }

  canCreateOrder(): boolean {
    return this.isVerified();
  }

  canManageUsers(): boolean {
    return this.isAdmin();
  }

  canSendEmails(): boolean {
    return this.isAdmin();
  }

  canViewAnalytics(): boolean {
    return this.isAdmin();
  }

  // Input validation and sanitization
  sanitizeInput(input: string): string {
    if (!input) return '';
    
    // Remove potentially dangerous characters
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]*>/g, '')
      .trim();
  }

  // Validate email format
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate password strength
  isValidPassword(password: string): { valid: boolean; message: string } {
    if (password.length < 8) {
      return { valid: false, message: 'Password must be at least 8 characters long' };
    }
    
    if (!/(?=.*[a-z])/.test(password)) {
      return { valid: false, message: 'Password must contain at least one lowercase letter' };
    }
    
    if (!/(?=.*[A-Z])/.test(password)) {
      return { valid: false, message: 'Password must contain at least one uppercase letter' };
    }
    
    if (!/(?=.*\d)/.test(password)) {
      return { valid: false, message: 'Password must contain at least one number' };
    }
    
    return { valid: true, message: 'Password is valid' };
  }

  // Rate limiting for API calls
  private rateLimitMap = new Map<string, { count: number; timestamp: number }>();
  
  checkRateLimit(key: string, maxAttempts: number = 5, windowMs: number = 60000): boolean {
    const now = Date.now();
    const current = this.rateLimitMap.get(key);
    
    if (!current || now - current.timestamp > windowMs) {
      this.rateLimitMap.set(key, { count: 1, timestamp: now });
      return true;
    }
    
    if (current.count >= maxAttempts) {
      return false;
    }
    
    current.count++;
    return true;
  }

  // Log security events
  logSecurityEvent(event: string, details?: any): void {
    console.log(`[SECURITY] ${event}`, {
      timestamp: new Date().toISOString(),
      user: this.currentUser?.uid || 'anonymous',
      details
    });
    
    // In production, you might want to send this to a logging service
  }

  // Check for suspicious activity
  detectSuspiciousActivity(action: string, metadata: any): boolean {
    // Example: Detect rapid successive requests
    const key = `${this.currentUser?.uid || 'anonymous'}_${action}`;
    
    if (!this.checkRateLimit(key, 10, 60000)) {
      this.logSecurityEvent('SUSPICIOUS_ACTIVITY', {
        action,
        metadata,
        reason: 'Rate limit exceeded'
      });
      return true;
    }
    
    return false;
  }
}

// Export singleton instance
export const securityService = SecurityService.getInstance();

// Admin route guard hook
export const useAdminGuard = () => {
  const isAdmin = securityService.isAdmin();
  const isAuthenticated = securityService.isAuthenticated();
  
  return {
    isAdmin,
    isAuthenticated,
    canAccess: isAdmin,
    redirectPath: isAuthenticated ? '/unauthorized' : '/auth'
  };
};

// User route guard hook
export const useAuthGuard = () => {
  const isAuthenticated = securityService.isAuthenticated();
  const isVerified = securityService.isVerified();
  
  return {
    isAuthenticated,
    isVerified,
    canAccess: isAuthenticated && isVerified,
    redirectPath: '/auth'
  };
};

export default securityService;