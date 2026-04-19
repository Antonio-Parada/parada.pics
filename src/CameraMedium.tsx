import React, { useEffect, useRef, useState } from 'react';
// @ts-ignore
import * as Pretext from '@chenglou/pretext';

interface CameraMediumProps {
  ascii: string;
  isPhosphor: boolean;
}

const CameraMedium: React.FC<CameraMediumProps> = ({ ascii, isPhosphor }) => {
  const [layoutHeight, setLayoutHeight] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ascii || !containerRef.current) return;

    try {
      const computedStyle = window.getComputedStyle(containerRef.current);
      const fontSize = parseFloat(computedStyle.fontSize);

      const prepared = Pretext.prepare(
        ascii, 
        `${fontSize}px 'Courier New', Courier, monospace`
      );

      const layout = Pretext.layout(
        prepared, 
        containerRef.current.clientWidth, 
        fontSize 
      );
      
      setLayoutHeight(layout.height);
    } catch (e) {
      // Fallback
    }
  }, [ascii]);

  return (
    <div 
      ref={containerRef}
      className="camera-render"
      style={{
        minHeight: layoutHeight || 'auto',
        color: isPhosphor ? 'var(--pixels-green)' : '#fff',
        textShadow: isPhosphor ? '0 0 5px rgba(0, 255, 0, 0.5)' : 'none'
      }}
    >
      {ascii}
    </div>
  );
};

export default CameraMedium;
