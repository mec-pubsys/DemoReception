import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <h1>デモ用簡易版QR受付アプリ</h1>
        <div className="status-indicator">
          <span className={`status ${isOnline ? 'online' : 'offline'}`}>
            {isOnline ? '🟢 オンライン' : '🔴 オフライン'}
          </span>
        </div>
        
        <div className="demo-section">
          <h2>デモカウンター</h2>
          <div className="counter">
            <button onClick={() => setCount((count) => count + 1)}>
              受付者数: {count}
            </button>
          </div>
          <p>
            このアプリはPWA（Progressive Web App）として動作し、
            オフラインでも利用可能です。
          </p>
        </div>

        <div className="features">
          <h3>主な機能（デモ版）</h3>
          <ul>
            <li>✅ PWA対応（オフライン動作）</li>
            <li>✅ レスポンシブデザイン</li>
            <li>✅ GitHub Pages対応</li>
            <li>🚧 QRコードスキャン（今後実装予定）</li>
            <li>🚧 受付者管理（今後実装予定）</li>
          </ul>
        </div>
      </header>
    </div>
  )
}

export default App