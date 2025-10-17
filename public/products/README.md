# 📸 TRISHH Product Images Guide

## Image Structure

```
public/products/
├── hoodies/
│   ├── signature-navy-front.jpg
│   ├── signature-navy-back.jpg
│   ├── signature-navy-detail.jpg
│   ├── midnight-elite-front.jpg
│   ├── midnight-elite-back.jpg
│   ├── midnight-elite-hood.jpg
│   ├── urban-street-grey.jpg
│   ├── urban-street-detail.jpg
│   ├── classic-comfort-white.jpg
│   ├── classic-comfort-grey.jpg
│   ├── tech-fleece-pro.jpg
│   ├── tech-fleece-detail.jpg
│   ├── vintage-washed-rust.jpg
│   ├── vintage-washed-detail.jpg
│   ├── minimalist-black.jpg
│   ├── minimalist-grey.jpg
│   └── heavyweight-champion.jpg
├── tees/
│   ├── essential-black.jpg
│   ├── essential-white.jpg
│   └── graphic-statement.jpg
└── accessories/
    ├── snapback-black.jpg
    └── tote-bag-natural.jpg
```

## Image Specifications

### Required Dimensions:
- **Primary Images**: 800x800px (square, high quality)
- **Detail Images**: 800x800px (close-up shots)
- **Lifestyle Images**: 1200x800px (16:10 ratio)

### File Format:
- **Format**: JPG (optimized for web)
- **Quality**: 85% compression
- **Max File Size**: 200KB per image

### Image Types Needed:

1. **Front View** - Product laid flat or on model (front)
2. **Back View** - Product back showing any back designs
3. **Detail Shots** - Close-up of fabric, logo, stitching
4. **Color Variants** - Same product in different colors
5. **Lifestyle** - Model wearing the product (optional)

## Naming Convention

```
{product-type}-{variant}-{view}.jpg

Examples:
- signature-navy-front.jpg
- midnight-elite-back.jpg
- urban-street-detail.jpg
- essential-black.jpg
```

## Image Optimization

Before adding images, optimize them:
1. Resize to required dimensions
2. Compress to reduce file size
3. Ensure consistent lighting and background
4. Use white or transparent backgrounds for product shots

## Quick Setup

To add your actual product images:

1. **Take/Source High-Quality Photos**
   - Use good lighting (natural light preferred)
   - White or neutral background
   - Multiple angles for each product

2. **Resize and Optimize**
   - Use tools like TinyPNG, Photoshop, or online compressors
   - Maintain aspect ratio
   - Optimize for web

3. **Upload to Public Folder**
   - Place in appropriate category subfolder
   - Use consistent naming convention

4. **Update Database**
   - Run the enhanced products migration
   - Verify image paths in admin panel

## Image Management Features

The admin panel includes:
- ✅ Image URL input for products
- ✅ Multiple images per product
- ✅ Image preview in product cards
- ✅ Automatic fallback to placeholder images

## Placeholder Images

For testing, the system uses:
- `/placeholder.svg` - Generic placeholder
- Existing assets from `/src/assets/` folder

## Production Notes

- Use a CDN (Cloudinary, AWS S3) for better performance
- Implement image lazy loading
- Add alt text for accessibility
- Consider WebP format for better compression