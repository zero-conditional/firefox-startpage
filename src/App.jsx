import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const getCountdown = (targetDate) => {
    const now = new Date()
    const target = new Date(targetDate)
    const diff = target - now
    
    if (diff < 0) return 'Past due!'
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    return `${days}d ${hours}h ${minutes}m`
  }

  return (
    <div className="app">
      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      <div className="minimal-container">
        <div className="time-section">
          <div className="main-time">{currentTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</div>
          <div className="date">{currentTime.toLocaleDateString('en-GB', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
        </div>

        <div className="greeting">
          <h1>Good {currentTime.getHours() < 12 ? 'morning' : currentTime.getHours() < 18 ? 'afternoon' : 'evening'}, Bellsey</h1>
        </div>

        <div className="quick-links">
          <a href="https://console.aws.amazon.com" className="link-item" target="_blank" rel="noopener noreferrer">
            <span className="link-icon">☁️</span>
            <span>AWS Console</span>
          </a>
          <a href="https://isengard.amazon.com" className="link-item" target="_blank" rel="noopener noreferrer">
            <span className="link-icon">🔐</span>
            <span>Isengard</span>
          </a>
          <a href="https://slack.com" className="link-item" target="_blank" rel="noopener noreferrer">
            <span className="link-icon">💬</span>
            <span>Slack</span>
          </a>
          <a href="https://outlook.office.com" className="link-item" target="_blank" rel="noopener noreferrer">
            <span className="link-icon">📧</span>
            <span>Outlook</span>
          </a>
        </div>

        <div className="countdowns">
          <div className="countdown-mini">
            🎂 Mum's Birthday: {getCountdown('2026-03-17T09:00:00')}
          </div>
          <div className="countdown-mini">
            🎂 Lucy's Birthday: {getCountdown('2026-02-02T07:00:00')}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
