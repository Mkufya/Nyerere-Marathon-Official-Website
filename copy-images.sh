#!/bin/bash

echo "🏃‍♂️ Copying Nyerere Marathon Images..."
echo ""

# Create images directory if it doesn't exist
mkdir -p public/assets/images

# Copy slider images from highlights folder
echo "📸 Copying slider images..."
if [ -d "../assets/highlights" ]; then
    cp ../assets/highlights/slider*.jpg public/assets/images/ 2>/dev/null || echo "No slider*.jpg files found"
    cp ../assets/highlights/Image_*.jpg public/assets/images/ 2>/dev/null || echo "No Image_*.jpg files found"
    echo "✅ Slider images copied successfully!"
else
    echo "⚠️  ../assets/highlights directory not found"
fi

# Copy logo
echo "🏷️  Copying logo..."
if [ -f "../assets/images/nyerere-art.png" ]; then
    cp ../assets/images/nyerere-art.png public/assets/images/logo.png
    echo "✅ Logo copied successfully!"
elif [ -f "../assets/nyerere-art.png" ]; then
    cp ../assets/nyerere-art.png public/assets/images/logo.png
    echo "✅ Logo copied successfully!"
else
    echo "⚠️  Logo file not found"
fi

# List copied files
echo ""
echo "📁 Files in public/assets/images/:"
ls -la public/assets/images/ 2>/dev/null || echo "No files found"

echo ""
echo "🎯 Next steps:"
echo "1. Edit src/data/sliderData.ts to use your local images"
echo "2. Run 'npm start' to test your slider"
echo "3. Open http://localhost:3000 to see the results"
echo ""
echo "🏃‍♂️ Happy coding!" 