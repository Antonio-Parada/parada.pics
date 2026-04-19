import CameraMedium from './CameraMedium'
import './App.css'

function App() {
  return (
    <div className="pics-container">
      <header className="pics-header">
        <h1>PARADA.PICS</h1>
        <p>CAMERA AS MEDIUM // TEXT AS LIGHT</p>
      </header>

      <main className="pics-gallery">
        <div className="pics-item">
          <CameraMedium 
            imageSrc="https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=800&q=80" 
            targetWidth={100}
          />
          <div className="pics-meta">
            <span>IMAGE_001.RAW</span>
            <span>COMPILED_VIA_PRETEXT</span>
          </div>
        </div>

        <div className="pics-item">
          <CameraMedium 
            imageSrc="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=800&q=80" 
            targetWidth={100}
          />
          <div className="pics-meta">
            <span>IMAGE_002.RAW</span>
            <span>LUMINANCE_MAP_ACTIVE</span>
          </div>
        </div>
      </main>

      <footer className="pics-footer">
        <p>© 2026 PIXELS AGENCY // ARCHITECT: PARADA</p>
      </footer>
    </div>
  )
}

export default App
