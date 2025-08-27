# Logo Images

This folder should contain the following logo images for the receipt:

## Required Images:

1. **college-logo.png** - College logo (recommended size: 80x80px or higher)

   - Should be the official Saffrony Institute of Technology logo
   - Supported formats: PNG, JPG, JPEG, SVG
   - Will be displayed on the left side of the receipt header

2. **veyg-logo.png** - VEYG event/web logo (recommended size: 80x80px or higher)
   - Should be the official VEYG 2K25 event logo
   - Supported formats: PNG, JPG, JPEG, SVG
   - Will be displayed on the right side of the receipt header

## Fallback Behavior:

If the logo images are not found, the component will automatically display placeholder icons with labels:

- College Logo: Building icon with "College Logo" text
- VEYG Logo: Globe icon with "VEYG Logo" text

## How to Add Logos:

1. Place your logo files in this directory (`Frontend/public/images/`)
2. Name them exactly as specified above
3. The receipt component will automatically load them

## Image Guidelines:

- Use high-quality images for better print quality
- Transparent backgrounds (PNG) work best
- Square aspect ratio recommended (1:1)
- Maximum file size: 2MB per image
