import CameraMedium from './CameraMedium'
import './App.css'
import galleryData from './gallery_compiled.json'

function App() {
  return (
    <div className="pics-container">
      <header className="pics-header">
        <h1>PARADA.PICS</h1>
        <p>CAMERA AS MEDIUM // ARCHIVED SIGNAL</p>
      </header>

      <main className="pics-gallery">
        {galleryData.map((img) => (
          <CameraMedium 
            key={img.id}
            ascii={img.ascii}
            name={img.name}
          />
        ))}
      </main>

      <footer className="pics-footer">
        <p>© 2026 PIXELS AGENCY // ARCHITECT: PARADA</p>
      </footer>
    </div>
  )
}

export default App
