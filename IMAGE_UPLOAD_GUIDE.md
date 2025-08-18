# Image Upload Guide for Nyerere Marathon Slider

## 🖼️ How to Add Images to Your Slider

### Option 1: Use Local Images (Recommended)

1. **Prepare Your Images**:
   - Recommended size: 1920x1080 pixels (16:9 aspect ratio)
   - Format: JPG or PNG
   - File size: Keep under 2MB for fast loading

2. **Add Images to Project**:
   ```bash
   # Copy your images to the assets folder
   cp your-image1.jpg public/assets/images/slider1.jpg
   cp your-image2.jpg public/assets/images/slider2.jpg
   cp your-image3.jpg public/assets/images/slider3.jpg
   ```

3. **Update Slider Data**:
   Edit `src/data/sliderData.ts`:
   ```typescript
   export const sliderData: Slide[] = [
     {
       id: '1',
       imageUrl: '/assets/images/slider1.jpg', // Your local image
       title: 'Your Title',
       subtitle: 'Your Subtitle',
       description: 'Your description',
       alt: 'Alt text for accessibility'
     },
     // ... more slides
   ];
   ```

### Option 2: Use External URLs

1. **Find High-Quality Images**:
   - Unsplash: https://unsplash.com/s/photos/marathon
   - Pexels: https://www.pexels.com/search/marathon/
   - Your own photos

2. **Update Slider Data**:
   Edit `src/data/sliderData.ts`:
   ```typescript
   export const sliderData: Slide[] = [
     {
       id: '1',
       imageUrl: 'https://your-image-url.com/image.jpg',
       title: 'Your Title',
       subtitle: 'Your Subtitle',
       description: 'Your description',
       alt: 'Alt text for accessibility'
     },
   ];
   ```

### Option 3: Use Your Existing Images

If you have images from your previous marathon events:

1. **Copy from Your Assets**:
   ```bash
   # Copy from your existing assets folder
   cp ../assets/highlights/slider1.jpg public/assets/images/
   cp ../assets/highlights/slider2.jpg public/assets/images/
   cp ../assets/highlights/slider3.jpg public/assets/images/
   ```

2. **Update the Data**:
   ```typescript
   export const sliderData: Slide[] = [
     {
       id: '1',
       imageUrl: '/assets/images/slider1.jpg',
       title: 'Nyerere International Marathon',
       subtitle: '2025 - 11 Oct 2025',
       description: 'Experience the excitement and energy of Tanzania\'s premier marathon event',
       alt: 'Marathon runners at starting line'
     },
     // ... more slides
   ];
   ```

## 🎨 Image Guidelines

### Recommended Content:
- **Slide 1**: Marathon start line with runners
- **Slide 2**: Finish line celebrations
- **Slide 3**: Scenic views of Mbeya
- **Slide 4**: Prize ceremony or trophies
- **Slide 5**: Diverse group of runners

### Technical Requirements:
- **Resolution**: 1920x1080 (minimum)
- **Format**: JPG for photos, PNG for graphics
- **File Size**: Under 2MB per image
- **Aspect Ratio**: 16:9 (landscape)

### Content Tips:
- Use high-contrast images for better text readability
- Include diverse representation of runners
- Show the beauty of Mbeya and Tanzania
- Capture the excitement and energy of marathon events

## 🔧 Customization Options

### Change Slider Settings:
Edit the ImageSlider component in `src/pages/home/HeroSection.tsx`:

```typescript
<ImageSlider 
  slides={sliderData}
  autoPlay={true}           // Enable/disable auto-play
  autoPlayInterval={6000}   // Change slide every 6 seconds
  showArrows={true}         // Show/hide navigation arrows
  showDots={true}           // Show/hide pagination dots
  className="w-full h-full"
/>
```

### Add More Slides:
Simply add more objects to the `sliderData` array in `src/data/sliderData.ts`.

### Change Text Overlay:
Each slide can have:
- `title`: Main heading
- `subtitle`: Secondary text
- `description`: Longer description text

## 🚀 Quick Start

1. **Add Your Images**:
   ```bash
   # Copy your images to the assets folder
   cp your-marathon-photos/*.jpg public/assets/images/
   ```

2. **Update the Data**:
   Edit `src/data/sliderData.ts` with your image paths and text.

3. **Test Your Changes**:
   ```bash
   npm start
   ```

4. **View Your Slider**:
   Open http://localhost:3000 to see your updated slider!

## 📝 Example Configuration

```typescript
export const sliderData: Slide[] = [
  {
    id: '1',
    imageUrl: '/assets/images/nyerere-marathon-start.jpg',
    title: 'Nyerere International Marathon',
    subtitle: '2025 - 11 Oct 2025',
    description: 'Experience the excitement and energy of Tanzania\'s premier marathon event',
    alt: 'Runners at the starting line of Nyerere Marathon'
  },
  {
    id: '2',
    imageUrl: '/assets/images/mbeya-scenery.jpg',
    title: 'Mbeya, Tanzania',
    subtitle: 'The Heart of the Marathon',
    description: 'Discover the beauty and hospitality of Mbeya as we run through its scenic routes',
    alt: 'Scenic view of Mbeya city and mountains'
  },
  // Add more slides as needed
];
```

## 🎯 Next Steps

1. Add your actual marathon photos
2. Customize the text content
3. Adjust the slider timing
4. Test on different devices
5. Optimize images for web

Your slider is now ready to showcase the Nyerere International Marathon 2025! 🏃‍♂️🇹🇿 