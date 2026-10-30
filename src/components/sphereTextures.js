import * as THREE from 'three';

/**
 * Generates high-resolution procedural textures for the 4 Spider-Men spheres.
 * Returns THREE.CanvasTexture objects configured for equirectangular sphere mapping.
 */

// 1. Tobey Maguire (Classic Raimi Suit: Dark metallic Red, Cobalt Blue & Raised Silver Webbing)
export function createTobeyTexture() {
  const width = 1024;
  const height = 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Base metallic dark red
  const redGrad = ctx.createLinearGradient(0, 0, width, height);
  redGrad.addColorStop(0, '#5e030e');
  redGrad.addColorStop(0.5, '#8c0717');
  redGrad.addColorStop(1, '#5e030e');
  ctx.fillStyle = redGrad;
  ctx.fillRect(0, 0, width, height);

  // Deep metallic blue flank panels
  ctx.fillStyle = '#0a1630';
  ctx.beginPath();
  // Left blue panel
  ctx.ellipse(160, 256, 130, 210, 0, 0, Math.PI * 2);
  ctx.fill();
  // Right blue panel
  ctx.beginPath();
  ctx.ellipse(864, 256, 130, 210, 0, 0, Math.PI * 2);
  ctx.fill();

  // Subtle fabric noise/stippling
  ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
  for (let i = 0; i < 15000; i++) {
    const rx = Math.random() * width;
    const ry = Math.random() * height;
    ctx.fillRect(rx, ry, 1.5, 1.5);
  }

  // Raised Silver Webbing Grid
  // Concentric web rings around front center (512, 256)
  const cx = 512;
  const cy = 256;
  const rings = 12;

  // Draw shadow first for 3D raised web effect
  for (let offset of [1.5, 0]) {
    ctx.strokeStyle = offset > 0 ? 'rgba(15, 0, 5, 0.85)' : '#d4d8e2';
    ctx.lineWidth = offset > 0 ? 3.5 : 2;

    // Rings
    for (let r = 35; r < 460; r += 36) {
      ctx.beginPath();
      ctx.ellipse(cx + offset, cy + offset, r * 1.3, r, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Radial web lines
    const rays = 24;
    for (let i = 0; i < rays; i++) {
      const angle = (i * Math.PI * 2) / rays;
      ctx.beginPath();
      ctx.moveTo(cx + offset, cy + offset);
      ctx.lineTo(cx + Math.cos(angle) * 600 + offset, cy + Math.sin(angle) * 600 + offset);
      ctx.stroke();
    }
  }

  // Classic Raimi Spider Emblem in center
  ctx.save();
  ctx.translate(cx, cy);
  ctx.fillStyle = '#e2e6f0';
  ctx.shadowColor = 'rgba(0,0,0,0.8)';
  ctx.shadowBlur = 8;
  // Spider Body
  ctx.beginPath();
  ctx.ellipse(0, -6, 5, 14, 0, 0, Math.PI * 2);
  ctx.ellipse(0, 10, 7, 18, 0, 0, Math.PI * 2);
  ctx.fill();
  // 8 Pointed Legs
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#e2e6f0';
  for (let side of [-1, 1]) {
    // Top legs
    ctx.beginPath();
    ctx.moveTo(side * 4, -10);
    ctx.lineTo(side * 28, -32);
    ctx.lineTo(side * 22, -55);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(side * 5, -5);
    ctx.lineTo(side * 36, -20);
    ctx.lineTo(side * 34, -40);
    ctx.stroke();

    // Bottom legs
    ctx.beginPath();
    ctx.moveTo(side * 5, 12);
    ctx.lineTo(side * 38, 25);
    ctx.lineTo(side * 30, 52);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(side * 4, 18);
    ctx.lineTo(side * 26, 40);
    ctx.lineTo(side * 18, 62);
    ctx.stroke();
  }
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

// 2. Andrew Garfield (The Amazing Spider-Man: Sleek Crimson, Deep Navy, Honeycomb Texture)
export function createAndrewTexture() {
  const width = 1024;
  const height = 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Rich crimson red base
  const redGrad = ctx.createLinearGradient(0, 0, width, height);
  redGrad.addColorStop(0, '#820516');
  redGrad.addColorStop(0.5, '#be0b26');
  redGrad.addColorStop(1, '#820516');
  ctx.fillStyle = redGrad;
  ctx.fillRect(0, 0, width, height);

  // Deep navy blue athletic side panels
  ctx.fillStyle = '#071024';
  ctx.beginPath();
  ctx.moveTo(0, 100);
  ctx.bezierCurveTo(280, 120, 280, 392, 0, 412);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(width, 100);
  ctx.bezierCurveTo(width - 280, 120, width - 280, 392, width, 412);
  ctx.fill();

  // Honeycomb pattern overlay
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.lineWidth = 1;
  const hexRadius = 8;
  const hexWidth = hexRadius * Math.sqrt(3);
  const hexHeight = hexRadius * 1.5;

  for (let y = 0; y < height + hexHeight; y += hexHeight) {
    const isOdd = Math.floor(y / hexHeight) % 2 === 1;
    for (let x = 0; x < width + hexWidth; x += hexWidth) {
      const cx = x + (isOdd ? hexWidth / 2 : 0);
      ctx.beginPath();
      for (let k = 0; k < 6; k++) {
        const a = (Math.PI / 3) * k;
        const px = cx + hexRadius * Math.cos(a);
        const py = y + hexRadius * Math.sin(a);
        if (k === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
    }
  }

  // Sleek, thin black web pattern with gold specular edge
  const cx = 512;
  const cy = 256;
  ctx.strokeStyle = '#1a0408';
  ctx.lineWidth = 2;
  for (let r = 40; r < 480; r += 40) {
    ctx.beginPath();
    ctx.ellipse(cx, cy, r * 1.25, r * 0.95, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  for (let i = 0; i < 28; i++) {
    const angle = (i * Math.PI * 2) / 28;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(angle) * 600, cy + Math.sin(angle) * 600);
    ctx.stroke();
  }

  // Amazing Spider-Man elongated emblem
  ctx.save();
  ctx.translate(cx, cy);
  ctx.fillStyle = '#0a0a0e';
  ctx.strokeStyle = '#0a0a0e';
  ctx.lineWidth = 2.5;

  // Thin elongated body
  ctx.beginPath();
  ctx.ellipse(0, -10, 4, 10, 0, 0, Math.PI * 2);
  ctx.ellipse(0, 16, 5, 24, 0, 0, Math.PI * 2);
  ctx.fill();

  // Sprawling sharp legs
  for (let side of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(side * 3, -16);
    ctx.lineTo(side * 32, -45);
    ctx.lineTo(side * 28, -75);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(side * 3, -8);
    ctx.lineTo(side * 45, -28);
    ctx.lineTo(side * 42, -50);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(side * 4, 12);
    ctx.lineTo(side * 48, 32);
    ctx.lineTo(side * 38, 70);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(side * 4, 22);
    ctx.lineTo(side * 34, 55);
    ctx.lineTo(side * 22, 90);
    ctx.stroke();
  }
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

// 3. Tom Holland (MCU / Iron Spider: Vibrant Scarlet, Iron Gold & Obsidian Black Nanotech)
export function createTomTexture() {
  const width = 1024;
  const height = 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Vibrant high-tech scarlet red
  const redGrad = ctx.createLinearGradient(0, 0, width, height);
  redGrad.addColorStop(0, '#a50c1b');
  redGrad.addColorStop(0.5, '#e0162b');
  redGrad.addColorStop(1, '#a50c1b');
  ctx.fillStyle = redGrad;
  ctx.fillRect(0, 0, width, height);

  // Carbon black geometric armor plates
  ctx.fillStyle = '#111215';
  // Side armor flanks
  ctx.beginPath();
  ctx.moveTo(0, 60);
  ctx.lineTo(240, 140);
  ctx.lineTo(260, 360);
  ctx.lineTo(0, 440);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(width, 60);
  ctx.lineTo(width - 240, 140);
  ctx.lineTo(width - 260, 360);
  ctx.lineTo(width, 440);
  ctx.closePath();
  ctx.fill();

  // Nanotech brushed texture lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
  ctx.lineWidth = 1;
  for (let i = 0; i < height; i += 4) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(width, i);
    ctx.stroke();
  }

  // Iron Spider Bold Gold Trim Bands & Chevrons
  const cx = 512;
  const cy = 256;
  const goldGrad = ctx.createLinearGradient(0, 0, width, height);
  goldGrad.addColorStop(0, '#c79222');
  goldGrad.addColorStop(0.5, '#ffd24c');
  goldGrad.addColorStop(1, '#c79222');

  ctx.strokeStyle = goldGrad;
  ctx.lineWidth = 7;
  ctx.shadowColor = 'rgba(255, 210, 76, 0.5)';
  ctx.shadowBlur = 10;

  // Massive Iron Spider Gold Logo on chest
  ctx.save();
  ctx.translate(cx, cy);

  // Central Gold Emblem
  ctx.beginPath();
  ctx.moveTo(-70, -110);
  ctx.lineTo(0, -60);
  ctx.lineTo(70, -110);
  ctx.lineTo(40, -40);
  ctx.lineTo(95, -10);
  ctx.lineTo(35, 10);
  ctx.lineTo(110, 50);
  ctx.lineTo(20, 45);
  ctx.lineTo(0, 110);
  ctx.lineTo(-20, 45);
  ctx.lineTo(-110, 50);
  ctx.lineTo(-35, 10);
  ctx.lineTo(-95, -10);
  ctx.lineTo(-40, -40);
  ctx.closePath();
  ctx.fillStyle = '#121316';
  ctx.fill();
  ctx.stroke();

  // Glowing center arc reactor / nanotech diamond
  ctx.beginPath();
  ctx.ellipse(0, -10, 16, 22, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#ffd24c';
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(0, -10, 8, 12, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();

  // Angular Nanotech panel borders
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#ffd24c';
  ctx.beginPath();
  ctx.moveTo(-160, -140);
  ctx.lineTo(-60, -80);
  ctx.lineTo(-120, 0);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(160, -140);
  ctx.lineTo(60, -80);
  ctx.lineTo(120, 0);
  ctx.stroke();

  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

// 4. Miles Morales (Earth-1610: Stealth Matte Black, Glowing Neon Graffiti Red & Cyan Glitch)
export function createMilesTexture() {
  const width = 1024;
  const height = 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Stealth matte black base
  ctx.fillStyle = '#0d0d10';
  ctx.fillRect(0, 0, width, height);

  // Carbon fiber weave texture
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.lineWidth = 1.5;
  for (let x = -height; x < width + height; x += 12) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + height, height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x, height);
    ctx.lineTo(x + height, 0);
    ctx.stroke();
  }

  // Red shoulder / collar accent stripes
  ctx.fillStyle = '#e50938';
  ctx.beginPath();
  ctx.moveTo(180, 0);
  ctx.lineTo(240, 0);
  ctx.lineTo(310, 140);
  ctx.lineTo(260, 150);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(width - 180, 0);
  ctx.lineTo(width - 240, 0);
  ctx.lineTo(width - 310, 140);
  ctx.lineTo(width - 260, 150);
  ctx.closePath();
  ctx.fill();

  const cx = 512;
  const cy = 256;

  // Cyan & Magenta Glitch Chromatic Aberration Shadows
  for (let [color, ox, oy] of [
    ['#00f0ff', -4, -2],
    ['#ff0077', 4, 2],
    ['#ff0938', 0, 0]
  ]) {
    ctx.save();
    ctx.translate(cx + ox, cy + oy);

    // Dynamic hand-drawn graffiti webbing
    ctx.strokeStyle = color;
    ctx.lineWidth = color === '#ff0938' ? 3.5 : 2;
    ctx.shadowColor = color;
    ctx.shadowBlur = color === '#ff0938' ? 16 : 8;

    for (let r = 50; r < 400; r += 55) {
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    for (let i = 0; i < 16; i++) {
      const angle = (i * Math.PI * 2) / 16;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(angle) * 450, Math.sin(angle) * 450);
      ctx.stroke();
    }

    // Iconic Spray-Painted Spider Logo
    ctx.fillStyle = color;
    ctx.beginPath();
    // Central spray body
    ctx.ellipse(0, 0, 18, 28, 0, 0, Math.PI * 2);
    ctx.fill();

    // 8 Spray-painted sharp angled legs
    ctx.lineWidth = color === '#ff0938' ? 6 : 4;
    for (let side of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(side * 10, -14);
      ctx.lineTo(side * 45, -55);
      ctx.lineTo(side * 75, -45);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(side * 12, -4);
      ctx.lineTo(side * 60, -25);
      ctx.lineTo(side * 85, -15);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(side * 12, 10);
      ctx.lineTo(side * 65, 30);
      ctx.lineTo(side * 80, 55);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(side * 8, 20);
      ctx.lineTo(side * 42, 60);
      ctx.lineTo(side * 60, 95);
      ctx.stroke();
    }

    // Spray paint splatter dots around emblem
    if (color === '#ff0938') {
      ctx.fillStyle = '#ff0938';
      const splatters = [
        [-50, -70, 3],
        [65, -60, 2.5],
        [-75, 40, 2],
        [80, 75, 3.5],
        [15, 95, 2],
        [-20, 105, 3],
        [-90, -10, 2.5],
        [95, 10, 2]
      ];
      for (let [sx, sy, sr] of splatters) {
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}
