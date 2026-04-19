import { useState, useEffect } from 'react'
import CameraMedium from './CameraMedium'
import './App.css'
import galleryData from './gallery_compiled.json'

function App() {
  const [isPhosphor, setIsPhosphor] = useState(false);
  const [category, setCategory] = useState<'PUBLIC' | 'PRIVATE'>('PUBLIC');
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Persistence: Check if already authorized on mount
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
      const password = prompt('ENTER ACCESS KEY:');
      if (password === 'pixels2026') { // Placeholder password
        localStorage.setItem('pixels_authorized', 'true');
        setIsAuthorized(true);
        setCategory('PRIVATE');
      } else {
        alert('ACCESS DENIED: INVALID KEY');
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

  // Logic: Display even IDs as Public, odd as Private for demonstration
  // In the future, you can add a 'category' field to your compiler.py
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
          MODE: {category}
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
