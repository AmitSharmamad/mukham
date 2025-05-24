const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconDir = path.join(__dirname, '../public/icons');

// Ensure icons directory exists
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

// Create a simple SVG icon for the trading app
const svgIcon = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <!-- Background circle -->
  <circle cx="256" cy="256" r="240" fill="#121212" stroke="#00E676" stroke-width="4"/>
  
  <!-- Trading chart pattern -->
  <g stroke="#00E676" stroke-width="3" fill="none">
    <!-- Candlestick pattern -->
    <rect x="100" y="200" width="8" height="80" fill="#00E676"/>
    <line x1="104" y1="180" x2="104" y2="300"/>
    
    <rect x="150" y="160" width="8" height="120" fill="#FF5252"/>
    <line x1="154" y1="140" x2="154" y2="300"/>
    
    <rect x="200" y="180" width="8" height="100" fill="#00E676"/>
    <line x1="204" y1="160" x2="204" y2="300"/>
    
    <rect x="250" y="140" width="8" height="80" fill="#00E676"/>
    <line x1="254" y1="120" x2="254" y2="240"/>
    
    <rect x="300" y="170" width="8" height="90" fill="#FF5252"/>
    <line x1="304" y1="150" x2="304" y2="280"/>
    
    <rect x="350" y="130" width="8" height="70" fill="#00E676"/>
    <line x1="354" y1="110" x2="354" y2="220"/>
    
    <rect x="400" y="160" width="8" height="60" fill="#00E676"/>
    <line x1="404" y1="140" x2="404" y2="240"/>
  </g>
  
  <!-- Trend line -->
  <path d="M 80 300 Q 200 200 350 120" stroke="#00E676" stroke-width="2" fill="none" opacity="0.7"/>
  
  <!-- App name -->
  <text x="256" y="400" text-anchor="middle" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="#00E676">M</text>
</svg>
`;

async function generateIcons() {
  try {
    console.log('Generating PWA icons...');
    
    // Create SVG buffer
    const svgBuffer = Buffer.from(svgIcon);
    
    // Generate icons for each required size
    for (const size of sizes) {
      const outputPath = path.join(iconDir, `icon-${size}x${size}.png`);
      
      await sharp(svgBuffer)
        .resize(size, size)
        .png({
          quality: 90,
          compressionLevel: 9,
        })
        .toFile(outputPath);
      
      console.log(`Generated: icon-${size}x${size}.png`);
    }
    
    // Also create a favicon
    await sharp(svgBuffer)
      .resize(32, 32)
      .png()
      .toFile(path.join(__dirname, '../public/favicon.ico'));
    
    console.log('Generated: favicon.ico');
    console.log('All icons generated successfully!');
    
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons();
