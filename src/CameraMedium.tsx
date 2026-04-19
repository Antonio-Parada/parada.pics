import React, { useEffect, useRef, useState } from 'react';
// @ts-ignore
import * as Pretext from '@chenglou/pretext';

interface CameraMediumProps {
  ascii: string;
  name: string;
  index: number;
  type: 'PUBLIC' | 'PRIVATE';
}

const CameraMedium: React.FC<CameraMediumProps> = ({ ascii, name, index, type }) => {
  const [layoutHeight, setLayoutHeight] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const copyToClipboard = () => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(ascii).then(() => {
        alert('Signal Copied to Buffer.');
      });
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = ascii;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        alert('Signal Copied to Buffer (Fallback).');
      } catch (err) {
        console.error('Unable to copy', err);
      }
      document.body.removeChild(textArea);
    }
  };

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
    <div className="pics-item">
      <div className="item-overlay"></div>
      <div 
        ref={containerRef}
        className="camera-render"
        style={{
          minHeight: layoutHeight || 'auto',
        }}
      >
        {ascii}
      </div>
      <div className="pics-meta">
        <div className="meta-info">
          <h3>{name.replace('.JPG', '')}</h3>
          <p>BLOCK_ARRAY_0{index} // {type}_SIGNAL</p>
        </div>
        <div className="action-btns">
          <button 
            className="copy-btn" 
            onClick={copyToClipboard}
          >
            COPY_SIGNAL
          </button>
        </div>
      </div>
    </div>
  );
};

export default CameraMedium;
