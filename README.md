# 💖 Valentine's Day Interactive Website

A romantic, playful Valentine's Day website that asks "Will you be my Valentine?" with delightful interactions and a celebratory YES outcome.

## ✨ Features

### Interactive Elements
- **YES Button**: Triggers confetti, floating hearts, background music, and success celebration
- **NO Button**: Playfully runs away when hovered or tapped (works on both desktop and mobile)
- **Confetti Explosion**: 150 colorful confetti pieces with random colors and animations
- **Floating Hearts**: Continuous heart animations that float up the screen
- **Background Music**: Soft romantic music that plays after YES is clicked
- **YouTube Video**: Embedded video with autoplay that starts after YES click

### Design Features
- Romantic Valentine's theme with custom color palette
- Custom typography using Pacifico (headings) and Quicksand (body)
- Smooth animations and micro-interactions
- Fully responsive and mobile-first design
- Bootstrap 5 integration for layout
- Animated gradient background with pulse effect

## 🚀 Setup Instructions

### 1. File Structure
```
valentine-website/
├── index.html
├── styles.css
├── script.js
└── README.md
```

### 2. Customization

#### Change YouTube Video
Open `script.js` and modify line 2:
```javascript
const YOUTUBE_VIDEO_ID = 'dQw4w9WgXcQ'; // Replace with your YouTube video ID
```

**How to find YouTube Video ID:**
- For URL: `https://www.youtube.com/watch?v=ABC123XYZ`
- The ID is: `ABC123XYZ`

#### Change Background Music
Open `index.html` and modify line 87:
```html
<source src="YOUR_MUSIC_URL_HERE.mp3" type="audio/mpeg">
```

You can use:
- Royalty-free music from Pixabay, Uppbeat, or Free Music Archive
- Your own hosted audio file

#### Customize Colors
Open `styles.css` and modify the CSS variables (lines 2-15):
```css
:root {
    --primary-red: #ff6b9d;
    --primary-pink: #ffc1e3;
    /* etc. */
}
```

## 📱 How It Works

### Landing Page
1. User sees romantic heading: "Will you be my Valentine? 💖"
2. Two buttons appear: YES ✅ and NO ❌

### NO Button Behavior
- **Desktop**: Moves randomly when hovered
- **Mobile**: Moves randomly when tapped
- **Progressive Difficulty**: Shrinks and moves faster after multiple attempts
- **Never Clickable**: Always escapes before being clicked

### YES Button Click
1. **Confetti explosion** - 150 pieces with random colors
2. **Floating hearts** - Continuous heart animations
3. **Background music** - Starts playing automatically
4. **Page transition** - Smooth fade to success section

### Success Section
- Large celebratory message
- Gift box with pulse animation
- YouTube video embed with autoplay
- Continuous floating hearts

## 🎨 Design Philosophy

**Aesthetic**: Soft, dreamy, modern romantic
- Custom typography for distinctive personality
- Layered animations for depth
- Pastel gradient backgrounds
- Generous use of shadows and glows
- Playful micro-interactions

**Responsive Design**:
- Mobile-first approach
- Breakpoints: 768px (tablet), 480px (mobile)
- Touch-optimized interactions
- Flexible layouts using Bootstrap 5

## 🛠️ Technologies Used

- **HTML5**: Semantic structure
- **CSS3**: Advanced animations, gradients, and transitions
- **JavaScript**: Interactive functionality
- **Bootstrap 5**: Responsive grid and utilities
- **Google Fonts**: Pacifico and Quicksand

## 📋 Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 💡 Usage Tips

1. **Test on mobile**: The NO button movement works great on touchscreens
2. **Audio permissions**: Some browsers block autoplay - user interaction (clicking YES) enables it
3. **YouTube autoplay**: Requires user interaction to work (handled automatically)
4. **Performance**: Confetti is optimized to remove after animation completes

## 🎯 Customization Ideas

- Add your own photos in the success section
- Include multiple YouTube videos in a playlist
- Add a custom message or poem
- Include a countdown timer
- Add more interactive elements (e.g., photo gallery)

## 📝 Optional Features (Currently Disabled)

### Disable Back Navigation
Uncomment lines in `script.js` (around line 186) to prevent users from going back after clicking YES:
```javascript
yesBtn.addEventListener('click', () => {
    setTimeout(disableBackNavigation, 1000);
});
```

## 🎉 Enjoy!

This website is designed to create a memorable, delightful experience for your Valentine. Feel free to customize it to make it even more personal!

---

Made with ❤️ for Valentine's Day
