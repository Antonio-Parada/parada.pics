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
      const prepared = Pretext.prepare(
        ascii, 
        "6px 'Courier New', Courier, monospace"
      );

      const layout = Pretext.layout(
        prepared, 
        containerRef.current.clientWidth, 
        6 
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
