import React, { useEffect, useRef, useState } from 'react';
// @ts-ignore
import * as Pretext from '@chenglou/pretext';

interface CameraMediumProps {
  ascii: string;
  name: string;
}

const CameraMedium: React.FC<CameraMediumProps> = ({ ascii, name }) => {
  const [layoutHeight, setLayoutHeight] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

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
        10 
      );
      
      setLayoutHeight(layout.height);
    } catch (e) {
      console.warn("Pretext layout fallback:", e);
    }
  }, [ascii]);

  return (
    <div className="pics-item">
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
      <div className="pics-meta">
        <span>{name}</span>
        <span>ARCHIVED_SIGNAL // PRE_COMPILED</span>
      </div>
    </div>
  );
};

export default CameraMedium;
