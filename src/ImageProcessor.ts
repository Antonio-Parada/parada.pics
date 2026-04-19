export interface PixelMap {
  data: number[][];
  width: number;
  height: number;
}

export const processImage = (img: HTMLImageElement, width: number = 100): Promise<PixelMap> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scale = width / img.width;
    const height = Math.floor(img.height * scale);
    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(img, 0, 0, width, height);
    const imageData = ctx.getImageData(0, 0, width, height).data;

    const data: number[][] = [];
    for (let y = 0; y < height; y++) {
      const row: number[] = [];
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        // Greyscale conversion (Luminance)
        const avg = (imageData[i] + imageData[i + 1] + imageData[i + 2]) / 3;
        row.push(avg);
      }
      data.push(row);
    }

    resolve({ data, width, height });
  });
};

export const getCharForLuminance = (l: number): string => {
  // Classic ASCII density map
  const chars = "@%#*+=-:. ";
  const index = Math.floor((l / 255) * (chars.length - 1));
  return chars[index];
};
