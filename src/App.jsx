import { useState, useEffect } from 'react'
import './App.css'

// Top bad habits with default costs and frequencies
const BAD_HABITS = [
  { id: 'drinking', name: 'Drinking Alcohol', icon: '🍺', defaultCost: 15, defaultFrequency: 4, unit: 'times/week', funnyFact: 'Your liver is throwing a party!' },
  { id: 'smoking', name: 'Smoking Cigarettes', icon: '🚬', defaultCost: 12, defaultFrequency: 20, unit: 'times/day', funnyFact: 'Your lungs are doing backflips!' },
  { id: 'vaping', name: 'Vaping', icon: '💨', defaultCost: 8, defaultFrequency: 30, unit: 'times/day', funnyFact: 'Not a dragon anymore!' },
  { id: 'gambling', name: 'Gambling', icon: '🎰', defaultCost: 50, defaultFrequency: 2, unit: 'times/week', funnyFact: 'The house was winning, now you are!' },
  { id: 'porn', name: 'Watching Porn', icon: '🙈', defaultCost: 15, defaultFrequency: 7, unit: 'times/week', funnyFact: 'Brain fog clearing up!' },
  { id: 'masturbating', name: 'Excessive Masturbation', icon: '✊', defaultCost: 0, defaultFrequency: 14, unit: 'times/week', funnyFact: 'Reclaiming your energy!' },
  { id: 'junk-food', name: 'Junk Food', icon: '🍔', defaultCost: 12, defaultFrequency: 7, unit: 'times/week', funnyFact: 'Your arteries are unclogging!' },
  { id: 'energy-drinks', name: 'Energy Drinks', icon: '⚡', defaultCost: 4, defaultFrequency: 7, unit: 'times/week', funnyFact: 'Your heart rate thanks you!' },
  { id: 'coffee', name: 'Excessive Coffee', icon: '☕', defaultCost: 6, defaultFrequency: 14, unit: 'times/week', funnyFact: 'Sleep is possible again!' },
  { id: 'social-media', name: 'Doomscrolling Social Media', icon: '📱', defaultCost: 0, defaultFrequency: 50, unit: 'times/day', funnyFact: 'Time machine activated!' },
  { id: 'video-games', name: 'Excessive Gaming', icon: '🎮', defaultCost: 20, defaultFrequency: 7, unit: 'times/week', funnyFact: 'Real life achievements unlocked!' },
  { id: 'netflix', name: 'Binge Watching', icon: '📺', defaultCost: 15, defaultFrequency: 7, unit: 'times/week', funnyFact: 'Couch groove disappearing!' },
  { id: 'shopping', name: 'Impulse Shopping', icon: '🛍️', defaultCost: 100, defaultFrequency: 2, unit: 'times/week', funnyFact: 'Credit card is confused!' },
  { id: 'fast-food', name: 'Fast Food', icon: '🍟', defaultCost: 10, defaultFrequency: 7, unit: 'times/week', funnyFact: 'Your wallet is getting thicc!' },
  { id: 'soda', name: 'Soda/Pop', icon: '🥤', defaultCost: 3, defaultFrequency: 14, unit: 'times/week', funnyFact: 'Teeth rejoicing!' },
  { id: 'nail-biting', name: 'Nail Biting', icon: '💅', defaultCost: 0, defaultFrequency: 20, unit: 'times/day', funnyFact: 'Manicure budget saved!' },
  { id: 'procrastinating', name: 'Procrastinating', icon: '⏰', defaultCost: 0, defaultFrequency: 7, unit: 'times/day', funnyFact: 'Productivity unlocked!' },
  { id: 'overthinking', name: 'Overthinking', icon: '🤯', defaultCost: 0, defaultFrequency: 10, unit: 'times/day', funnyFact: 'Mental peace loading...' },
  { id: 'late-sleeping', name: 'Staying Up Late', icon: '🌙', defaultCost: 0, defaultFrequency: 7, unit: 'times/week', funnyFact: 'Morning person activated!' },
  { id: 'sugar', name: 'Excessive Sugar', icon: '🍭', defaultCost: 5, defaultFrequency: 14, unit: 'times/week', funnyFact: 'Insulin doing happy dance!' },
].sort((a, b) => a.name.localeCompare(b.name))

function App() {
  const [selectedHabit, setSelectedHabit] = useState(null)
  const [quitDate, setQuitDate] = useState(null)
  const [customCost, setCustomCost] = useState(0)
  const [customFrequency, setCustomFrequency] = useState(0)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showSetup, setShowSetup] = useState(false)

  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem('iQuitData')
    if (saved) {
      const data = JSON.parse(saved)
      setSelectedHabit(data.habitId)
      setQuitDate(new Date(data.quitDate))
      setCustomCost(data.customCost)
      setCustomFrequency(data.customFrequency)
    }
  }, [])

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const saveData = (habitId, date, cost, frequency) => {
    localStorage.setItem('iQuitData', JSON.stringify({
      habitId,
      quitDate: date.toISOString(),
      customCost: cost,
      customFrequency: frequency
    }))
  }

  const handleStartQuitting = (habit) => {
    const now = new Date()
    setSelectedHabit(habit.id)
    setQuitDate(now)
    setCustomCost(habit.defaultCost)
    setCustomFrequency(habit.defaultFrequency)
    saveData(habit.id, now, habit.defaultCost, habit.defaultFrequency)
    setShowSetup(false)
  }

  const handleReset = () => {
    if (confirm('Are you sure you want to reset? This will delete all your progress!')) {
      localStorage.removeItem('iQuitData')
      setSelectedHabit(null)
      setQuitDate(null)
      setCustomCost(0)
      setCustomFrequency(0)
    }
  }

  const calculateStats = () => {
    if (!quitDate) return null

    const diff = currentTime - quitDate
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const weeks = Math.floor(days / 7)
    const months = Math.floor(days / 30)
    const years = Math.floor(days / 365)

    const habit = BAD_HABITS.find(h => h.id === selectedHabit)
    
    // Calculate money saved based on frequency
    let moneySaved = 0
    if (habit.unit === 'times/day') {
      moneySaved = (days * customFrequency * customCost)
    } else if (habit.unit === 'times/week') {
      moneySaved = (weeks * customFrequency * customCost)
    }

    return {
      seconds: seconds % 60,
      minutes: minutes % 60,
      hours: hours % 24,
      days: days % 7,
      weeks: weeks % 4,
      months: months % 12,
      years,
      totalDays: days,
      moneySaved: moneySaved.toFixed(2)
    }
  }

  const currentHabit = selectedHabit ? BAD_HABITS.find(h => h.id === selectedHabit) : null
  const stats = calculateStats()

  // Main tracking view
  if (selectedHabit && quitDate && !showSetup) {
    return (
      <div className="app">
        <div className="container">
          <header>
            <h1>I QUIT</h1>
            <button className="settings-btn" onClick={() => setShowSetup(true)}>⚙️</button>
          </header>

          <div className="habit-badge">
            <span className="habit-icon">{currentHabit.icon}</span>
            <h2>{currentHabit.name}</h2>
            <p className="funny-fact">{currentHabit.funnyFact}</p>
          </div>

          <div className="stats-grid">
            {stats.years > 0 && (
              <div className="stat-card rainbow">
                <div className="stat-value">{stats.years}</div>
                <div className="stat-label">Years</div>
              </div>
            )}
            {(stats.months > 0 || stats.years > 0) && (
              <div className="stat-card">
                <div className="stat-value">{stats.months}</div>
                <div className="stat-label">Months</div>
              </div>
            )}
            <div className="stat-card">
              <div className="stat-value">{stats.weeks}</div>
              <div className="stat-label">Weeks</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.days}</div>
              <div className="stat-label">Days</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.hours}</div>
              <div className="stat-label">Hours</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.minutes}</div>
              <div className="stat-label">Minutes</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.seconds}</div>
              <div className="stat-label">Seconds</div>
            </div>
          </div>

          {customCost > 0 && (
            <div className="money-saved">
              <div className="money-icon">💰</div>
              <div className="money-amount">${stats.moneySaved}</div>
              <div className="money-label">Money Saved</div>
              <div className="money-subtext">
                {stats.moneySaved > 1000 ? "That's a vacation!" : 
                 stats.moneySaved > 500 ? "Nice chunk of change!" : 
                 stats.moneySaved > 100 ? "Keep stacking!" : 
                 "Every penny counts!"}
              </div>
            </div>
          )}

          <div className="milestones">
            <h3>🏆 Milestones</h3>
            <div className="milestone-list">
              <div className={`milestone ${stats.totalDays >= 1 ? 'achieved' : ''}`}>
                ✓ 1 Day - Baby steps!
              </div>
              <div className={`milestone ${stats.totalDays >= 3 ? 'achieved' : ''}`}>
                ✓ 3 Days - You're on a roll!
              </div>
              <div className={`milestone ${stats.totalDays >= 7 ? 'achieved' : ''}`}>
                ✓ 1 Week - Legend status!
              </div>
              <div className={`milestone ${stats.totalDays >= 30 ? 'achieved' : ''}`}>
                ✓ 1 Month - Unstoppable!
              </div>
              <div className={`milestone ${stats.totalDays >= 90 ? 'achieved' : ''}`}>
                ✓ 90 Days - Habit crushed!
              </div>
              <div className={`milestone ${stats.totalDays >= 365 ? 'achieved' : ''}`}>
                ✓ 1 Year - Absolute warrior!
              </div>
            </div>
          </div>

          <button className="reset-btn" onClick={handleReset}>
            Start Over
          </button>
        </div>
      </div>
    )
  }

  // Setup/Selection view
  return (
    <div className="app">
      <div className="container">
        <header>
          <h1>I QUIT</h1>
          {selectedHabit && <button className="back-btn" onClick={() => setShowSetup(false)}>← Back</button>}
        </header>

        <div className="intro">
          <h2>What bad habit are you quitting?</h2>
          <p>Choose your vice below and start tracking your freedom 🎯</p>
        </div>

        <div className="habits-grid">
          {BAD_HABITS.map(habit => (
            <div 
              key={habit.id} 
              className="habit-card"
              onClick={() => handleStartQuitting(habit)}
            >
              <div className="habit-card-icon">{habit.icon}</div>
              <div className="habit-card-name">{habit.name}</div>
              {habit.defaultCost > 0 && (
                <div className="habit-card-cost">${habit.defaultCost}/{habit.unit.split('/')[1]}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
