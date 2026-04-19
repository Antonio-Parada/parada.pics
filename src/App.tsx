import { useState } from 'react'
import CameraMedium from './CameraMedium'
import './App.css'
import galleryData from './gallery_compiled.json'

function App() {
  const [isColorMode, setIsColorMode] = useState(false);

  const copyToClipboard = (text: string) => {
    // Robust copy fallback
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        alert('Signal Copied to Buffer.');
      });
    } else {
      // Fallback for non-secure contexts or older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
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

  return (
    <div className="pics-container">
      <header className="pics-header">
        <h1>PARADA<span>.PICS</span></h1>
        <div className="header-actions">
          <button 
            className="color-btn" 
            onClick={() => setIsColorMode(!isColorMode)}
          >
            {isColorMode ? 'PHOSPHOR_OFF' : 'PHOSPHOR_ON'}
          </button>
        </div>
      </header>

      <nav className="category-bar">
        <span className="active">LATEST</span>
        <span>BARE_METAL</span>
        <span>SOLARIS</span>
        <span>ZFS_POOLS</span>
        <span>GOPHER</span>
        <span>STOWE_VT</span>
        <span style={{marginLeft: 'auto', color: 'var(--pixels-cyan)'}}>SYSTEM_STABLE</span>
      </nav>

      <main className="pics-gallery">
        {galleryData.map((img, index) => (
          <div key={img.id} className="pics-item">
            <div className="item-overlay"></div>
            <div style={{ color: isColorMode ? 'var(--pixels-green)' : '#fff' }}>
              <CameraMedium ascii={img.ascii} />
            </div>
            
            <div className="pics-meta">
              <div className="meta-info">
                <h3>{img.name.replace('.JPG', '')}</h3>
                <p>BLOCK_ARRAY_0{index + 1} // 160_WIDTH</p>
              </div>
              <div className="action-btns">
                <button 
                  className="copy-btn" 
                  onClick={() => copyToClipboard(img.ascii)}
                >
                  COPY_SIGNAL
                </button>
              </div>
            </div>
          </div>
        ))}
      </main>

      <footer style={{padding: '80px 30px', textAlign: 'center', borderTop: '1px solid var(--pixels-border)', backgroundColor: '#000'}}>
        <p style={{fontSize: '12px', fontWeight: '800', letterSpacing: '2px'}}>PIXELS AGENCY // ARCHITECT: PARADA</p>
        <p style={{fontSize: '10px', color: '#444', marginTop: '10px'}}>TRANSCRIBING THE VOID INTO TEXT.</p>
      </footer>
    </div>
  )
}

export default App
