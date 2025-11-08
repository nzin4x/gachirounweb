#!/bin/bash
# Generate og-image.png (800x400, 2:1 ratio for KakaoTalk)
# Logo centered with safe padding to prevent cropping

cd public/images

# Create 800x400 image with brand gradient background
magick convert -size 800x400 gradient:"#FF6B35-#FFB800" \
  -gravity center \
  \( ci.png -resize 280x280 \) -geometry +0-30 -composite \
  \( -background none -fill white -font Arial -pointsize 32 -gravity center \
     label:"사회적협동조합 가치로운" \) -geometry +0+140 -composite \
  og-image-new.png

# Replace old og-image with new one
mv og-image-new.png og-image.png

echo "✓ og-image.png generated (800x400)"
echo "  - Logo centered with safe padding"
echo "  - Text will not be cropped on any platform"
