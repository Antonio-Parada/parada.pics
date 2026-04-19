import { useState } from 'react'
import CameraMedium from './CameraMedium'
import './App.css'
import galleryData from './gallery_compiled.json'

function App() {
  const [isPhosphor, setIsPhosphor] = useState(false);

  const copyToClipboard = (text: string) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        alert('Signal Copied to Buffer.');
      });
    } else {
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
            className={`color-btn ${isPhosphor ? 'active' : ''}`} 
            onClick={() => setIsPhosphor(!isPhosphor)}
          >
            {isPhosphor ? 'PHOSPHOR_ON' : 'PHOSPHOR_OFF'}
          </button>
        </div>
      </header>

      <nav className="category-bar">
        <span className="active">LATEST</span>
        <span>STOWE_VT</span>
        <span>METROPOLIS</span>
        <span>NATURE</span>
        <span>EXPERIMENTAL</span>
        <span style={{marginLeft: 'auto', color: 'var(--pixels-cyan)'}}>SIGNAL_ACTIVE</span>
      </nav>

      <main className="pics-gallery">
        {galleryData.map((img, index) => (
          <div key={img.id} className="pics-item">
            <CameraMedium 
              ascii={img.ascii} 
              isPhosphor={isPhosphor}
            />
            
            <div className="pics-meta">
              <div className="meta-info">
                <h3>{img.name.replace('.JPG', '')}</h3>
                <p>BLOCK_ARRAY_0{index + 1} // ARCHIVED_2026</p>
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

      <footer className="pics-footer">
        <p>© 2026 PIXELS AGENCY // ARCHITECT: PARADA</p>
        <p style={{fontSize: '10px', color: '#444', marginTop: '10px'}}>TRANSCRIBING THE VOID INTO TEXT.</p>
      </footer>
    </div>
  )
}

export default App
