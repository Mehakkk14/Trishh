// Performance monitoring and analytics service

// Global gtag function declaration
declare global {
  function gtag(...args: any[]): void;
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = import.meta.env.PROD;
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Track page views
  trackPageView(pageName: string) {
    if (!this.isEnabled) return;
    
    try {
      // Google Analytics 4 tracking
      if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', {
          page_title: pageName,
          page_location: window.location.href,
        });
      }
      
      console.log(`📊 Page view tracked: ${pageName}`);
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }

  // Track user actions
  trackEvent(action: string, category: string, label?: string, value?: number) {
    if (!this.isEnabled) return;

    try {
      if (typeof gtag !== 'undefined') {
        gtag('event', action, {
          event_category: category,
          event_label: label,
          value: value,
        });
      }
      
      console.log(`📊 Event tracked: ${action} - ${category}`);
    } catch (error) {
      console.error('Event tracking error:', error);
    }
  }

  // Track e-commerce events
  trackPurchase(transactionId: string, value: number, items: any[]) {
    if (!this.isEnabled) return;

    try {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'purchase', {
          transaction_id: transactionId,
          value: value,
          currency: 'INR',
          items: items.map(item => ({
            item_id: item.id,
            item_name: item.name,
            category: item.category || 'Clothing',
            quantity: item.quantity,
            price: item.price,
          })),
        });
      }
      
      console.log(`💰 Purchase tracked: ${transactionId} - ₹${value}`);
    } catch (error) {
      console.error('Purchase tracking error:', error);
    }
  }

  // Track add to cart events
  trackAddToCart(item: any) {
    this.trackEvent('add_to_cart', 'ecommerce', item.name, item.price);
  }

  // Track wishlist events
  trackAddToWishlist(item: any) {
    this.trackEvent('add_to_wishlist', 'engagement', item.name);
  }

  // Performance metrics
  trackPerformance() {
    if (!this.isEnabled) return;

    try {
      // Simple performance tracking
      if ('performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
          this.trackEvent('page_load_time', 'performance', window.location.pathname, Math.round(loadTime));
        }
      }
    } catch (error) {
      console.error('Performance tracking error:', error);
    }
  }

  // Error tracking
  trackError(error: Error, context?: string) {
    if (!this.isEnabled) return;

    try {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'exception', {
          description: error.message,
          fatal: false,
          custom_map: { context: context },
        });
      }
      
      console.error(`🚨 Error tracked: ${error.message}`, { context });
    } catch (trackingError) {
      console.error('Error tracking failed:', trackingError);
    }
  }
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();

// Global error handler
window.addEventListener('error', (event) => {
  performanceMonitor.trackError(event.error, 'Global Error Handler');
});

window.addEventListener('unhandledrejection', (event) => {
  performanceMonitor.trackError(new Error(event.reason), 'Unhandled Promise Rejection');
});

export default performanceMonitor;