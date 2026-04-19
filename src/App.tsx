import CameraMedium from './CameraMedium'
import './App.css'
import galleryData from './gallery_compiled.json'

function App() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Signal Copied to Buffer.');
  };

  return (
    <div className="pics-container">
      <header className="pics-header">
        <h1>PARADA<span>PICS</span></h1>
      </header>

      <nav className="category-bar">
        <span>ALL</span>
        <span>BARE_METAL</span>
        <span>SOLARIS</span>
        <span>ZFS_POOLS</span>
        <span>GOPHER</span>
        <span>INFRASTRUCTURE</span>
        <span style={{marginLeft: 'auto', color: 'var(--portal-orange)'}}>LIVE_ARCHIVE</span>
      </nav>

      <main className="pics-gallery">
        {galleryData.map((img, index) => (
          <div key={img.id} className="pics-item">
            <CameraMedium ascii={img.ascii} />
            <div className="duration-label">RAW:{index + 1}</div>
            
            <div className="pics-meta">
              <h3>{img.name}</h3>
              <div className="stats">
                <span>100% QUALITY</span> • <span>ARCHIVED 2026</span>
              </div>
              <button 
                className="copy-btn" 
                onClick={() => copyToClipboard(img.ascii)}
              >
                COPY_STRING
              </button>
            </div>
          </div>
        ))}
      </main>

      <footer className="pics-footer" style={{padding: '40px', textAlign: 'center', borderTop: '1px solid #222'}}>
        <p>© 2026 PIXELS AGENCY // ARCHITECT: PARADA</p>
        <p style={{fontSize: '10px', color: '#444'}}>THE QUIET IS THE GOAL.</p>
      </footer>
    </div>
  )
}

export default App
