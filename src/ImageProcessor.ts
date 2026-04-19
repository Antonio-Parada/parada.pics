export interface PixelMap {
  data: number[][];
  width: number;
  height: number;
}

export const processImage = (
  img: HTMLImageElement, 
  width: number = 160
): Promise<PixelMap> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const fontAspectRatio = 0.55; 
    const height = Math.floor((img.height / img.width) * width * fontAspectRatio);
    
    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(img, 0, 0, width, height);
    const imageData = ctx.getImageData(0, 0, width, height).data;

    let minLum = 255;
    let maxLum = 0;
    const rawLuminances: number[] = [];

    // Step 1: Perceptual Luminance extraction
    for (let i = 0; i < imageData.length; i += 4) {
      const r = imageData[i];
      const g = imageData[i + 1];
      const b = imageData[i + 2];
      const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b);
      rawLuminances.push(lum);
      if (lum < minLum) minLum = lum;
      if (lum > maxLum) maxLum = lum;
    }

    // Step 2: Dynamic Normalization (Autolevels)
    // Ensures every image utilizes the full 0-255 range
    const data: number[][] = [];
    const range = maxLum - minLum || 1;

    for (let y = 0; y < height; y++) {
      const row: number[] = [];
      for (let x = 0; x < width; x++) {
        const lum = rawLuminances[y * width + x];
        
        // Stretch the luminance to fill 0-255
        let normalized = ((lum - minLum) / range) * 255;

        // Apply a gentle S-Curve for mid-tone separation
        // This sharpens details without blowing out highs/lows
        const s = normalized / 255;
        normalized = (s < 0.5 ? 2 * s * s : 1 - Math.pow(-2 * s + 2, 2) / 2) * 255;

        row.push(normalized);
      }
      data.push(row);
    }

    resolve({ data, width, height });
  });
};

export const getCharForLuminance = (l: number): string => {
  // Balanced ramp for high-contrast B&W photography
  const chars = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^`'. ";
  const index = Math.floor(((255 - l) / 255) * (chars.length - 1));
  return chars[index];
};
