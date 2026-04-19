import React, { useEffect, useRef, useState } from 'react';
// @ts-ignore
import * as Pretext from '@chenglou/pretext';
import { processImage, getCharForLuminance, type PixelMap } from './ImageProcessor';

interface CameraMediumProps {
  imageSrc: string;
  targetWidth?: number;
}

const CameraMedium: React.FC<CameraMediumProps> = ({ imageSrc, targetWidth = 160 }) => {
  const [ascii, setAscii] = useState<string>('');
  const [layoutHeight, setLayoutHeight] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageSrc;
    img.onload = async () => {
      // Increased contrast to 1.3 for sharper edges
      const pixels: PixelMap = await processImage(img, targetWidth, 1.3);
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

    try {
      const prepared = Pretext.prepare(
        ascii, 
        "10px 'Courier New', Courier, monospace"
      );

      const layout = Pretext.layout(
        prepared, 
        containerRef.current.clientWidth, 
        10 // Matches font size for tight line spacing
      );
      
      setLayoutHeight(layout.height);
    } catch (e) {
      console.warn("Pretext layout fallback:", e);
    }
  }, [ascii]);

  return (
    <div 
      ref={containerRef}
      className="camera-render"
      style={{
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: '10px',
        lineHeight: '1',
        whiteSpace: 'pre',
        backgroundColor: '#000',
        color: '#fff',
        width: '100%',
        minHeight: layoutHeight || 'auto',
        overflow: 'hidden',
        textAlign: 'center',
        padding: '20px 0'
      }}
    >
      {ascii}
    </div>
  );
};

export default CameraMedium;
