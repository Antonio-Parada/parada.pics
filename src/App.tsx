import { useState, useEffect } from 'react'
import CameraMedium from './CameraMedium'
import './App.css'
import galleryData from './gallery_compiled.json'

function App() {
  const [isPhosphor, setIsPhosphor] = useState(false);
  const [category, setCategory] = useState<'PUBLIC' | 'PRIVATE'>('PUBLIC');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);

  useEffect(() => {
    const auth = localStorage.getItem('pixels_authorized');
    if (auth === 'true') {
      setIsAuthorized(true);
    }
  }, []);

  const handlePrivateClick = () => {
    if (isAuthorized) {
      setCategory('PRIVATE');
    } else {
      const currentAttempt = attemptCount + 1;
      setAttemptCount(currentAttempt);

      prompt(`ENTER ACCESS KEY [ATTEMPT 0${currentAttempt}]:`);

      // NARRATIVE LOGIC: 
      // First attempt always fails. 
      // Second attempt (or higher) always succeeds.
      if (currentAttempt >= 2) {
        localStorage.setItem('pixels_authorized', 'true');
        setIsAuthorized(true);
        setCategory('PRIVATE');
        alert('SIGNAL DECRYPTED. ACCESS GRANTED.');
      } else {
        alert('ACCESS DENIED: HANDSHAKE FAILED. RETRYING...');
      }
    }
  };

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

  const filteredData = galleryData.filter((_, index) => {
    if (category === 'PUBLIC') return index % 2 === 0;
    return index % 2 !== 0;
  });

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
        <span 
          className={category === 'PUBLIC' ? 'active' : ''} 
          onClick={() => setCategory('PUBLIC')}
        >
          PUBLIC_SIGNALS
        </span>
        <span 
          className={category === 'PRIVATE' ? 'active' : ''} 
          onClick={handlePrivateClick}
        >
          PRIVATE_ENCLAVE {isAuthorized ? '✓' : '🔒'}
        </span>
        <span style={{marginLeft: 'auto', color: 'var(--pixels-cyan)'}}>
          SIGNAL_STATUS: {isAuthorized ? 'DECRYPTED' : 'LOCKED'}
        </span>
      </nav>

      <main className="pics-gallery">
        {filteredData.map((img, index) => (
          <div key={img.id} className="pics-item">
            <CameraMedium 
              ascii={img.ascii} 
              isPhosphor={isPhosphor}
            />
            
            <div className="pics-meta">
              <div className="meta-info">
                <h3>{img.name.replace('.JPG', '')}</h3>
                <p>BLOCK_ARRAY_0{index + 1} // {category}_SIGNAL</p>
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
