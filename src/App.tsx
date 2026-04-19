import CameraMedium from './CameraMedium'
import './App.css'

const galleryImages = [
  { id: '001', name: 'IMG_001.RAW' },
  { id: '002', name: 'IMG_002.RAW' },
  { id: '003', name: 'IMG_003.RAW' },
  { id: '004', name: 'IMG_004.RAW' },
  { id: '005', name: 'IMG_005.RAW' },
  { id: '006', name: 'IMG_006.RAW' },
  { id: '007', name: 'IMG_007.RAW' },
  { id: '008', name: 'IMG_008.RAW' },
  { id: '009', name: 'IMG_009.RAW' },
  { id: '010', name: 'IMG_010.RAW' },
  { id: '011', name: 'IMG_011.RAW' },
  { id: '012', name: 'IMG_012.RAW' },
  { id: '013', name: 'IMG_013.RAW' },
  { id: '014', name: 'IMG_014.RAW' },
  { id: '015', name: 'IMG_015.RAW' },
];

function App() {
  return (
    <div className="pics-container">
      <header className="pics-header">
        <h1>PARADA.PICS</h1>
        <p>CAMERA AS MEDIUM // TEXT AS LIGHT</p>
      </header>

      <main className="pics-gallery">
        {galleryImages.map((img) => (
          <div key={img.id} className="pics-item">
            <CameraMedium 
              imageSrc={`/gallery/img_${img.id}.jpg`} 
              targetWidth={120}
            />
            <div className="pics-meta">
              <span>{img.name}</span>
              <span>COMPILED_VIA_PRETEXT // LUMINANCE_MAP_ACTIVE</span>
            </div>
          </div>
        ))}
      </main>

      <footer className="pics-footer">
        <p>© 2026 PIXELS AGENCY // ARCHITECT: PARADA</p>
      </footer>
    </div>
  )
}

export default App
