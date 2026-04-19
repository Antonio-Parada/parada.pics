export interface PixelMap {
  data: number[][];
  width: number;
  height: number;
}

export const processImage = (
  img: HTMLImageElement, 
  width: number = 120, 
  contrast: number = 1.2
): Promise<PixelMap> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // ACCOUNT FOR FONT ASPECT RATIO
    // Monospace chars are usually ~1:2 ratio (height is 2x width)
    // To prevent vertical stretching, we double the horizontal sampling or halve the vertical
    const fontAspectRatio = 0.55; 
    const height = Math.floor((img.height / img.width) * width * fontAspectRatio);
    
    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(img, 0, 0, width, height);
    const imageData = ctx.getImageData(0, 0, width, height).data;

    const data: number[][] = [];
    for (let y = 0; y < height; y++) {
      const row: number[] = [];
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        
        // PERCEPTUAL LUMINANCE (Rec. 709)
        let r = imageData[i];
        let g = imageData[i + 1];
        let b = imageData[i + 2];
        
        let luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b);

        // CONTRAST ENHANCEMENT
        // Boosts highs and drops lows to sharpen the ASCII threshold
        luminance = ((luminance / 255 - 0.5) * contrast + 0.5) * 255;
        luminance = Math.max(0, Math.min(255, luminance));

        row.push(luminance);
      }
      data.push(row);
    }

    resolve({ data, width, height });
  });
};

export const getCharForLuminance = (l: number): string => {
  // EXTENDED DENSITY MAP for finer gradients
  const chars = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^`'. ";
  const index = Math.floor(((255 - l) / 255) * (chars.length - 1));
  return chars[index];
};
