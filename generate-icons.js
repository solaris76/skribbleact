const fs = require('fs');
const path = require('path');

// Create a simple SVG icon for SkribbleAct
const svgIcon = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="512" height="512" rx="80" fill="url(#bg)"/>
  
  <!-- Film Reel Icon -->
  <circle cx="256" cy="200" r="60" fill="white" opacity="0.9"/>
  <circle cx="256" cy="200" r="45" fill="url(#bg)"/>
  <circle cx="256" cy="200" r="15" fill="white"/>
  
  <!-- Paint Brush Icon -->
  <path d="M 180 320 Q 200 300 220 320 L 240 340 Q 260 360 240 380 L 220 400 Q 200 420 180 400 Z" fill="white" opacity="0.9"/>
  <rect x="175" y="315" width="10" height="90" rx="5" fill="white" opacity="0.9"/>
  
  <!-- Text -->
  <text x="256" y="480" font-family="Arial, sans-serif" font-size="24" font-weight="bold" text-anchor="middle" fill="white">SkribbleAct</text>
</svg>
`;

// Ensure public directory exists
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
}

// Write SVG file
fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgIcon);

console.log('✅ Icon files created!');
console.log('📱 To create PNG icons, you can:');
console.log('   1. Use an online SVG to PNG converter');
console.log('   2. Open icon.svg in a browser and screenshot it');
console.log('   3. Use a tool like Inkscape or GIMP');
console.log('');
console.log('🎯 Required sizes: 192x192 and 512x512');
console.log('📁 Save them as icon-192.png and icon-512.png in the public folder');
