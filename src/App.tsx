import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom'
import CameraMedium from './CameraMedium'
import './App.css'
import galleryData from './gallery_compiled.json'

// Sub-component for the Gallery view to handle category logic
function GalleryView({ type, isAuthorized, onAuthorize }: { type: 'PUBLIC' | 'PRIVATE', isAuthorized: boolean, onAuthorize: () => void }) {
  const navigate = useNavigate();
  const [attemptCount, setAttemptCount] = useState(0);

  // Filter ONLY by the specific category from the JSON database
  const filteredData = galleryData.filter(img => img.category === type);

  useEffect(() => {
    if (type === 'PRIVATE' && !isAuthorized) {
      const currentAttempt = attemptCount + 1;
      setAttemptCount(currentAttempt);
      
      prompt(`ENTER ACCESS KEY [ATTEMPT 0${currentAttempt}]:`);

      if (currentAttempt >= 2) {
        onAuthorize();
        alert('SIGNAL DECRYPTED. ACCESS GRANTED.');
      } else {
        alert('ACCESS DENIED: HANDSHAKE FAILED. RETRYING...');
        navigate('/'); // Bounce back to public on first failure
      }
    }
  }, [type, isAuthorized, navigate, attemptCount, onAuthorize]);

  if (type === 'PRIVATE' && !isAuthorized) return null;

  return (
    <main className="pics-gallery">
      {filteredData.length > 0 ? (
        filteredData.map((img, index) => (
          <CameraMedium 
            key={img.id}
            ascii={img.ascii} 
            name={img.name}
            index={index + 1}
            type={type}
          />
        ))
      ) : (
        <div style={{padding: '100px', textAlign: 'center', width: '100%', color: '#444'}}>
          NO_SIGNALS_ARCHIVED_IN_{type}_ENCLAVE
        </div>
      )}
    </main>
  );
}

function AppContent() {
  const [isPhosphor, setIsPhosphor] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (localStorage.getItem('pixels_authorized') === 'true') {
      setIsAuthorized(true);
    }
  }, []);

  const handleAuthorize = () => {
    localStorage.setItem('pixels_authorized', 'true');
    setIsAuthorized(true);
  };

  return (
    <div className="pics-container">
      <header className="pics-header">
        <Link to="/" style={{textDecoration: 'none'}}><h1>PARADA<span>.PICS</span></h1></Link>
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
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
          <span>PUBLIC_SIGNALS</span>
        </Link>
        <Link to="/private" className={location.pathname === '/private' ? 'active' : ''}>
          <span>PRIVATE_ENCLAVE {isAuthorized ? '✓' : '🔒'}</span>
        </Link>
        <span style={{marginLeft: 'auto', color: 'var(--pixels-cyan)'}}>
          NODE_PATH: {location.pathname.toUpperCase()}
        </span>
      </nav>

      <div className={isPhosphor ? 'phosphor-apply' : ''}>
        <Routes>
          <Route path="/" element={<GalleryView type="PUBLIC" isAuthorized={isAuthorized} onAuthorize={handleAuthorize} />} />
          <Route path="/private" element={<GalleryView type="PRIVATE" isAuthorized={isAuthorized} onAuthorize={handleAuthorize} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>

      <footer className="pics-footer">
        <p>© 2026 PIXELS AGENCY // ARCHITECT: PARADA</p>
        <p style={{fontSize: '10px', color: '#444', marginTop: '10px'}}>TRANSCRIBING THE VOID INTO TEXT.</p>
      </footer>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
