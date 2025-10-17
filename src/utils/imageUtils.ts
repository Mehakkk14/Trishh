// Image Management Utilities for TRISHH E-commerce
import { useState, useEffect } from 'react';

export const ImageUtils = {
  // Product image paths
  PRODUCT_BASE_PATH: '/products',
  PLACEHOLDER_IMAGE: '/placeholder.svg',
  
  // Get optimized image URL with fallback
  getProductImage: (imagePath: string, fallback?: string): string => {
    if (!imagePath) {
      return fallback || ImageUtils.PLACEHOLDER_IMAGE;
    }
    
    // If path already starts with /, it's relative to public
    if (imagePath.startsWith('/')) {
      return imagePath;
    }
    
    // If it's a full URL, return as is
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Otherwise, construct the path
    return `${ImageUtils.PRODUCT_BASE_PATH}/${imagePath}`;
  },

  // Get multiple product images with fallbacks
  getProductImages: (images: string[] = []): string[] => {
    if (!images.length) {
      return [ImageUtils.PLACEHOLDER_IMAGE];
    }
    
    return images.map(img => ImageUtils.getProductImage(img));
  },

  // Generate image alt text
  getImageAlt: (productName: string, imageType: string = 'product'): string => {
    return `${productName} ${imageType} image`;
  },

  // Check if image exists (for development)
  checkImageExists: async (imagePath: string): Promise<boolean> => {
    try {
      const response = await fetch(imagePath, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  },

  // Product category image mapping
  CATEGORY_IMAGES: {
    hoodies: [
      'signature-navy-front.svg',
      'signature-navy-back.svg',
      'midnight-elite-front.jpg',
      'urban-street-grey.jpg',
      'classic-comfort-white.jpg',
      'tech-fleece-pro.jpg',
      'vintage-washed-rust.jpg',
      'minimalist-black.jpg',
      'heavyweight-champion.jpg'
    ],
    tees: [
      'essential-black.jpg',
      'essential-white.jpg',
      'graphic-statement.jpg'
    ],
    accessories: [
      'snapback-black.jpg',
      'tote-bag-natural.jpg'
    ]
  },

  // Sample product images for demo
  getSampleImages: (category: string, count: number = 3): string[] => {
    const categoryImages = ImageUtils.CATEGORY_IMAGES[category] || [];
    const selectedImages = categoryImages.slice(0, count);
    
    return selectedImages.map(img => 
      `${ImageUtils.PRODUCT_BASE_PATH}/${category}/${img}`
    );
  }
};

// React hook for image loading with fallback
export const useImageWithFallback = (src: string, fallback?: string) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const img = new Image();
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
      setHasError(false);
    };
    
    img.onerror = () => {
      setImageSrc(fallback || ImageUtils.PLACEHOLDER_IMAGE);
      setIsLoading(false);
      setHasError(true);
    };
    
    img.src = src;
  }, [src, fallback]);

  return { imageSrc, isLoading, hasError };
};

export default ImageUtils;