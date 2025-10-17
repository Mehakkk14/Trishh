// SEO and Meta Tags Management Service
export interface SEOData {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'product' | 'article';
  price?: number;
  currency?: string;
  availability?: 'in stock' | 'out of stock';
}

export class SEOService {
  private static instance: SEOService;
  private defaultTitle = 'TRISHH Desire Shop - Premium Fashion & Lifestyle';
  private defaultDescription = 'Discover premium fashion and lifestyle products at TRISHH Desire Shop. Quality clothing, accessories, and more with fast delivery across India.';
  private defaultImage = '/og-image.jpg';
  private siteName = 'TRISHH Desire Shop';

  static getInstance(): SEOService {
    if (!SEOService.instance) {
      SEOService.instance = new SEOService();
    }
    return SEOService.instance;
  }

  // Update page meta tags
  updateMetaTags(seoData: SEOData) {
    // Update document title
    document.title = seoData.title;

    // Update or create meta tags
    this.updateMetaTag('description', seoData.description);
    
    if (seoData.keywords) {
      this.updateMetaTag('keywords', seoData.keywords);
    }

    // Open Graph tags
    this.updateMetaProperty('og:title', seoData.title);
    this.updateMetaProperty('og:description', seoData.description);
    this.updateMetaProperty('og:image', seoData.image || this.defaultImage);
    this.updateMetaProperty('og:url', seoData.url || window.location.href);
    this.updateMetaProperty('og:type', seoData.type || 'website');
    this.updateMetaProperty('og:site_name', this.siteName);

    // Twitter Card tags
    this.updateMetaProperty('twitter:card', 'summary_large_image');
    this.updateMetaProperty('twitter:title', seoData.title);
    this.updateMetaProperty('twitter:description', seoData.description);
    this.updateMetaProperty('twitter:image', seoData.image || this.defaultImage);

    // Product-specific meta tags
    if (seoData.type === 'product' && seoData.price) {
      this.updateMetaProperty('product:price:amount', seoData.price.toString());
      this.updateMetaProperty('product:price:currency', seoData.currency || 'INR');
      this.updateMetaProperty('product:availability', seoData.availability || 'in stock');
    }

    // Canonical URL
    this.updateCanonicalUrl(seoData.url || window.location.href);
  }

  // Set homepage SEO
  setHomepageSEO() {
    this.updateMetaTags({
      title: this.defaultTitle,
      description: this.defaultDescription,
      keywords: 'fashion, clothing, lifestyle, premium, online shopping, India, TRISHH',
      type: 'website',
    });
  }

  // Set product page SEO
  setProductSEO(product: any) {
    this.updateMetaTags({
      title: `${product.name} - TRISHH Desire Shop`,
      description: `Buy ${product.name} at TRISHH Desire Shop. ${product.description || 'Premium quality product with fast delivery.'}`,
      keywords: `${product.name}, ${product.category}, fashion, clothing, buy online`,
      image: product.images?.[0] || this.defaultImage,
      type: 'product',
      price: product.price,
      currency: 'INR',
      availability: product.stock > 0 ? 'in stock' : 'out of stock',
    });
  }

  // Set category page SEO
  setCategorySEO(category: string, productCount: number) {
    this.updateMetaTags({
      title: `${category} Collection - TRISHH Desire Shop`,
      description: `Explore our ${category.toLowerCase()} collection with ${productCount} premium products. Quality guaranteed with fast delivery.`,
      keywords: `${category}, fashion, clothing, collection, online shopping`,
      type: 'website',
    });
  }

  // Set profile page SEO
  setProfileSEO() {
    this.updateMetaTags({
      title: 'My Profile - TRISHH Desire Shop',
      description: 'Manage your profile, orders, and preferences at TRISHH Desire Shop.',
      type: 'website',
    });
  }

  // Private helper methods
  private updateMetaTag(name: string, content: string) {
    let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = name;
      document.head.appendChild(meta);
    }
    meta.content = content;
  }

  private updateMetaProperty(property: string, content: string) {
    let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('property', property);
      document.head.appendChild(meta);
    }
    meta.content = content;
  }

  private updateCanonicalUrl(url: string) {
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;
  }

  // JSON-LD structured data
  addStructuredData(data: any) {
    // Remove existing structured data
    const existing = document.querySelector('script[type="application/ld+json"]');
    if (existing) {
      existing.remove();
    }

    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }

  // Add product structured data
  addProductStructuredData(product: any) {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name,
      "description": product.description,
      "image": product.images || [],
      "brand": {
        "@type": "Brand",
        "name": "TRISHH"
      },
      "offers": {
        "@type": "Offer",
        "price": product.price,
        "priceCurrency": "INR",
        "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        "seller": {
          "@type": "Organization",
          "name": "TRISHH Desire Shop"
        }
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": product.rating || 4.5,
        "reviewCount": product.reviewCount || 1
      }
    };

    this.addStructuredData(structuredData);
  }

  // Add organization structured data
  addOrganizationStructuredData() {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "TRISHH Desire Shop",
      "url": window.location.origin,
      "logo": `${window.location.origin}/logo.png`,
      "description": this.defaultDescription,
      "sameAs": [
        "https://facebook.com/trishh",
        "https://instagram.com/trishh",
        "https://twitter.com/trishh"
      ]
    };

    this.addStructuredData(structuredData);
  }
}

// Export singleton instance
export const seoService = SEOService.getInstance();
export default seoService;