import React, { useEffect, useRef, useState } from 'react';
// @ts-ignore
import * as Pretext from '@chenglou/pretext';

interface CameraMediumProps {
  ascii: string;
}

const CameraMedium: React.FC<CameraMediumProps> = ({ ascii }) => {
  const [layoutHeight, setLayoutHeight] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ascii || !containerRef.current) return;

    try {
      // Get the calculated font size from the browser (the fluid 'vw' value)
      const computedStyle = window.getComputedStyle(containerRef.current);
      const fontSize = parseFloat(computedStyle.fontSize);

      const prepared = Pretext.prepare(
        ascii, 
        `${fontSize}px 'Courier New', Courier, monospace`
      );

      const layout = Pretext.layout(
        prepared, 
        containerRef.current.clientWidth, 
        fontSize // Match line height to font size for high density
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
      }}
    >
      {ascii}
    </div>
  );
};

export default CameraMedium;
