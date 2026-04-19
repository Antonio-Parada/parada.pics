import React, { useEffect, useRef, useState } from 'react';
// @ts-ignore - Pretext might not have official types yet
import * as Pretext from '@chenglou/pretext';
import { processImage, getCharForLuminance, type PixelMap } from './ImageProcessor';

interface CameraMediumProps {
  imageSrc: string;
  targetWidth?: number;
}

const CameraMedium: React.FC<CameraMediumProps> = ({ imageSrc, targetWidth = 120 }) => {
  const [ascii, setAscii] = useState<string>('');
  const [layoutHeight, setLayoutHeight] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageSrc;
    img.onload = async () => {
      const pixels: PixelMap = await processImage(img, targetWidth);
      let asciiStr = '';
      for (let y = 0; y < pixels.height; y++) {
        for (let x = 0; x < pixels.width; x++) {
          asciiStr += getCharForLuminance(pixels.data[y][x]);
        }
        asciiStr += '\n';
      }
      setAscii(asciiStr);
    };
  }, [imageSrc, targetWidth]);

  useEffect(() => {
    if (!ascii || !containerRef.current) return;

    // Use Pretext to calculate layout high-speed
    try {
      const prepared = Pretext.prepare(
        ascii, 
        "12px 'Courier New', Courier, monospace"
      );

      const layout = Pretext.layout(
        prepared, 
        containerRef.current.clientWidth, 
        12 // lineHeight
      );
      
      setLayoutHeight(layout.height);
    } catch (e) {
      console.warn("Pretext layout fallback:", e);
    }
  }, [ascii]);

  return (
    <div 
      ref={containerRef}
      style={{
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: '12px',
        lineHeight: '1',
        whiteSpace: 'pre',
        backgroundColor: '#000',
        color: '#fff',
        padding: '20px',
        width: '100%',
        minHeight: layoutHeight || 'auto',
        overflow: 'hidden',
        textAlign: 'center'
      }}
    >
      {ascii}
    </div>
  );
};

export default CameraMedium;
