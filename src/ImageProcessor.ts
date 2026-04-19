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

    // MONOSPACE ASPECT CORRECTION
    // $ sign is roughly 0.6 as wide as it is tall
    const fontAspectRatio = 0.55; 
    const height = Math.floor((img.height / img.width) * width * fontAspectRatio);
    
    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(img, 0, 0, width, height);
    const imageData = ctx.getImageData(0, 0, width, height).data;

    let minLum = 255;
    let maxLum = 0;
    const rawLuminances: number[] = [];

    for (let i = 0; i < imageData.length; i += 4) {
      const r = imageData[i];
      const g = imageData[i + 1];
      const b = imageData[i + 2];
      const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b);
      rawLuminances.push(lum);
      if (lum < minLum) minLum = lum;
      if (lum > maxLum) maxLum = lum;
    }

    const data: number[][] = [];
    const range = maxLum - minLum || 1;

    for (let y = 0; y < height; y++) {
      const row: number[] = [];
      for (let x = 0; x < width; x++) {
        const lum = rawLuminances[y * width + x];
        let normalized = ((lum - minLum) / range) * 255;

        // Apply S-Curve
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
  // "$" ONLY DENSITY MAP
  // Using space for zero-light and "$" for light to create high-contrast pointillism
  return l > 127 ? "$" : " ";
};
