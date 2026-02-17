import { useState, useEffect } from 'react'
import './App.css'

// Encouragement messages that rotate
const ENCOURAGEMENTS = [
  "You're absolutely crushing it! 💪",
  "Legend status unlocked! 🏆",
  "Your future self is high-fiving you right now! 🙌",
  "Unstoppable force detected! ⚡",
  "You're literally glowing with self-control! ✨",
  "That willpower though! 🔥",
  "Main character energy! 🎬",
  "Keep flexing that discipline muscle! 💪",
  "You're inspiring people you don't even know! 🌟",
  "Absolute warrior vibes! ⚔️"
]

// Top bad habits with costs, frequencies, and special stats
const BAD_HABITS = [
  { 
    id: 'drinking', 
    name: 'Drinking Alcohol', 
    icon: '🍺', 
    defaultCost: 15, 
    defaultFrequency: 4, 
    unit: 'times/week', 
    funnyFact: 'Your liver is throwing a party!',
    specialStat: (times) => `${times} hangovers avoided! 🎉`
  },
  { 
    id: 'smoking', 
    name: 'Smoking Cigarettes', 
    icon: '🚬', 
    defaultCost: 12, 
    defaultFrequency: 20, 
    unit: 'times/day', 
    funnyFact: 'Your lungs are doing backflips!',
    specialStat: (times) => `${times} cigarettes not smoked! 🚭`
  },
  { 
    id: 'vaping', 
    name: 'Vaping', 
    icon: '💨', 
    defaultCost: 8, 
    defaultFrequency: 30, 
    unit: 'times/day', 
    funnyFact: 'Not a dragon anymore!',
    specialStat: (times) => `${times} puffs avoided! Cloud-free! ☁️`
  },
  { 
    id: 'gambling', 
    name: 'Gambling', 
    icon: '🎰', 
    defaultCost: 50, 
    defaultFrequency: 2, 
    unit: 'times/week', 
    funnyFact: 'The house was winning, now you are!',
    specialStat: (times) => `${times} times you didn't lose money! 💰`
  },
  { 
    id: 'porn', 
    name: 'Watching Porn', 
    icon: '🙈', 
    defaultCost: 15, 
    defaultFrequency: 7, 
    unit: 'times/week', 
    funnyFact: 'Brain fog clearing up!',
    specialStat: (times) => `${(times * 30).toFixed(0)} hours of life reclaimed! ⏰`
  },
  { 
    id: 'masturbating', 
    name: 'Excessive Masturbation', 
    icon: '✊', 
    defaultCost: 0, 
    defaultFrequency: 14, 
    unit: 'times/week', 
    funnyFact: 'Reclaiming your energy!',
    specialStat: (times) => `${(times * 100).toFixed(0)} million sperm saved! 🏊‍♂️`
  },
  { 
    id: 'junk-food', 
    name: 'Junk Food', 
    icon: '🍔', 
    defaultCost: 12, 
    defaultFrequency: 7, 
    unit: 'times/week', 
    funnyFact: 'Your arteries are unclogging!',
    specialStat: (times) => `~${(times * 600).toFixed(0)} calories not consumed! 🔥`
  },
  { 
    id: 'energy-drinks', 
    name: 'Energy Drinks', 
    icon: '⚡', 
    defaultCost: 4, 
    defaultFrequency: 7, 
    unit: 'times/week', 
    funnyFact: 'Your heart rate thanks you!',
    specialStat: (times) => `${(times * 160).toFixed(0)}mg caffeine avoided! ❤️`
  },
  { 
    id: 'coffee', 
    name: 'Excessive Coffee', 
    icon: '☕', 
    defaultCost: 6, 
    defaultFrequency: 14, 
    unit: 'times/week', 
    funnyFact: 'Sleep is possible again!',
    specialStat: (times) => `${(times * 95).toFixed(0)}mg caffeine not consumed! 😴`
  },
  { 
    id: 'social-media', 
    name: 'Doomscrolling Social Media', 
    icon: '📱', 
    defaultCost: 0, 
    defaultFrequency: 50, 
    unit: 'times/day', 
    funnyFact: 'Time machine activated!',
    specialStat: (times) => `~${(times * 15 / 60).toFixed(0)} hours of scrolling avoided! 📵`
  },
  { 
    id: 'video-games', 
    name: 'Excessive Gaming', 
    icon: '🎮', 
    defaultCost: 20, 
    defaultFrequency: 7, 
    unit: 'times/week', 
    funnyFact: 'Real life achievements unlocked!',
    specialStat: (times) => `${(times * 3).toFixed(0)} hours of IRL gameplay! 🌍`
  },
  { 
    id: 'netflix', 
    name: 'Binge Watching', 
    icon: '📺', 
    defaultCost: 15, 
    defaultFrequency: 7, 
    unit: 'times/week', 
    funnyFact: 'Couch groove disappearing!',
    specialStat: (times) => `${(times * 2).toFixed(0)} hours not wasted! 🎬`
  },
  { 
    id: 'shopping', 
    name: 'Impulse Shopping', 
    icon: '🛍️', 
    defaultCost: 100, 
    defaultFrequency: 2, 
    unit: 'times/week', 
    funnyFact: 'Credit card is confused!',
    specialStat: (times) => `${times} impulse purchases resisted! 💳`
  },
  { 
    id: 'fast-food', 
    name: 'Fast Food', 
    icon: '🍟', 
    defaultCost: 10, 
    defaultFrequency: 7, 
    unit: 'times/week', 
    funnyFact: 'Your wallet is getting thicc!',
    specialStat: (times) => `~${(times * 700).toFixed(0)} calories not eaten! 🍎`
  },
  { 
    id: 'soda', 
    name: 'Soda/Pop', 
    icon: '🥤', 
    defaultCost: 3, 
    defaultFrequency: 14, 
    unit: 'times/week', 
    funnyFact: 'Teeth rejoicing!',
    specialStat: (times) => `${(times * 39).toFixed(0)}g of sugar avoided! 🦷`
  },
  { 
    id: 'nail-biting', 
    name: 'Nail Biting', 
    icon: '💅', 
    defaultCost: 0, 
    defaultFrequency: 20, 
    unit: 'times/day', 
    funnyFact: 'Manicure budget saved!',
    specialStat: (times) => `${times} fingers kept beautiful! 💅`
  },
  { 
    id: 'procrastinating', 
    name: 'Procrastinating', 
    icon: '⏰', 
    defaultCost: 0, 
    defaultFrequency: 7, 
    unit: 'times/day', 
    funnyFact: 'Productivity unlocked!',
    specialStat: (times) => `${times} tasks you actually did! ✅`
  },
  { 
    id: 'overthinking', 
    name: 'Overthinking', 
    icon: '🤯', 
    defaultCost: 0, 
    defaultFrequency: 10, 
    unit: 'times/day', 
    funnyFact: 'Mental peace loading...',
    specialStat: (times) => `${times} mental spirals prevented! 🧘‍♂️`
  },
  { 
    id: 'late-sleeping', 
    name: 'Staying Up Late', 
    icon: '🌙', 
    defaultCost: 0, 
    defaultFrequency: 7, 
    unit: 'times/week', 
    funnyFact: 'Morning person activated!',
    specialStat: (times) => `${times} good nights of sleep! 😴`
  },
  { 
    id: 'sugar', 
    name: 'Excessive Sugar', 
    icon: '🍭', 
    defaultCost: 5, 
    defaultFrequency: 14, 
    unit: 'times/week', 
    funnyFact: 'Insulin doing happy dance!',
    specialStat: (times) => `~${(times * 50).toFixed(0)}g sugar not consumed! 🍬`
  },
].sort((a, b) => a.name.localeCompare(b.name))

function App() {
  const [selectedHabit, setSelectedHabit] = useState(null)
  const [quitDate, setQuitDate] = useState(null)
  const [customCost, setCustomCost] = useState(0)
  const [customFrequency, setCustomFrequency] = useState(0)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showSetup, setShowSetup] = useState(false)
  const [encouragement, setEncouragement] = useState('')
  
  // Setup form state
  const [setupDate, setSetupDate] = useState('')
  const [setupTime, setSetupTime] = useState('')
  const [setupFrequency, setSetupFrequency] = useState('')
  const [setupCost, setSetupCost] = useState('')

  // Get random encouragement on mount and when opening app
  useEffect(() => {
    const randomEncouragement = ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)]
    setEncouragement(randomEncouragement)
  }, [selectedHabit])

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
    setSelectedHabit(habit.id)
    setShowSetup(true)
    
    // Set default values in setup form
    const now = new Date()
    setSetupDate(now.toISOString().split('T')[0])
    setSetupTime(now.toTimeString().slice(0, 5))
    setSetupFrequency(habit.defaultFrequency.toString())
    setSetupCost(habit.defaultCost.toString())
  }

  // When opening setup for existing habit (editing)
  useEffect(() => {
    if (showSetup && selectedHabit && quitDate) {
      // Populate with existing values
      setSetupDate(quitDate.toISOString().split('T')[0])
      setSetupTime(quitDate.toTimeString().slice(0, 5))
      setSetupFrequency(customFrequency.toString())
      setSetupCost(customCost.toString())
    }
  }, [showSetup])

  const confirmSetup = () => {
    if (!setupDate || !setupTime || !setupFrequency) {
      alert('Please fill in all required fields!')
      return
    }

    // Combine date and time
    const quitDateTime = new Date(`${setupDate}T${setupTime}`)
    
    setQuitDate(quitDateTime)
    setCustomFrequency(parseFloat(setupFrequency))
    setCustomCost(parseFloat(setupCost) || 0)
    
    saveData(
      selectedHabit,
      quitDateTime,
      parseFloat(setupCost) || 0,
      parseFloat(setupFrequency)
    )
    
    setShowSetup(false)
  }

  const cancelSetup = () => {
    setSelectedHabit(null)
    setShowSetup(false)
    setSetupDate('')
    setSetupTime('')
    setSetupFrequency('')
    setSetupCost('')
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
    
    // Calculate money saved and times avoided
    let moneySaved = 0
    let timesAvoided = 0
    let weeklyCost = 0
    
    if (habit.unit === 'times/day') {
      timesAvoided = days * customFrequency
      moneySaved = timesAvoided * customCost
      weeklyCost = customFrequency * 7 * customCost
    } else if (habit.unit === 'times/week') {
      timesAvoided = weeks * customFrequency
      moneySaved = timesAvoided * customCost
      weeklyCost = customFrequency * customCost
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
      moneySaved: moneySaved.toFixed(2),
      weeklyCost: weeklyCost.toFixed(2),
      timesAvoided: Math.floor(timesAvoided),
      specialStat: habit.specialStat ? habit.specialStat(timesAvoided) : null
    }
  }

  const currentHabit = selectedHabit ? BAD_HABITS.find(h => h.id === selectedHabit) : null
  const stats = calculateStats()

  // Setup form view
  if (showSetup && currentHabit) {
    return (
      <div className="app">
        <div className="container">
          <header>
            <h1>I QUIT</h1>
          </header>

          <div className="setup-form">
            <div className="setup-header">
              <span className="setup-icon">{currentHabit.icon}</span>
              <h2>Setup: {currentHabit.name}</h2>
              <p className="setup-subtitle">Let's track your progress accurately!</p>
            </div>

            <div className="form-group">
              <label htmlFor="quit-date">When did you quit?</label>
              <input
                id="quit-date"
                type="date"
                value={setupDate}
                onChange={(e) => setSetupDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="quit-time">What time?</label>
              <input
                id="quit-time"
                type="time"
                value={setupTime}
                onChange={(e) => setSetupTime(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="frequency">
                How often were you doing this? ({currentHabit.unit})
              </label>
              <input
                id="frequency"
                type="number"
                min="0"
                step="0.5"
                value={setupFrequency}
                onChange={(e) => setSetupFrequency(e.target.value)}
                placeholder={`e.g., ${currentHabit.defaultFrequency}`}
                required
              />
              <span className="input-hint">times per {currentHabit.unit.split('/')[1]}</span>
            </div>

            {currentHabit.defaultCost > 0 && (
              <div className="form-group">
                <label htmlFor="cost">
                  Average cost per time? (optional)
                </label>
                <div className="input-with-prefix">
                  <span className="input-prefix">$</span>
                  <input
                    id="cost"
                    type="number"
                    min="0"
                    step="0.01"
                    value={setupCost}
                    onChange={(e) => setSetupCost(e.target.value)}
                    placeholder={`e.g., ${currentHabit.defaultCost}`}
                  />
                </div>
                <span className="input-hint">Leave blank if no cost</span>
              </div>
            )}

            <div className="form-actions">
              <button className="btn-cancel" onClick={cancelSetup}>
                Cancel
              </button>
              <button className="btn-start" onClick={confirmSetup}>
                Start Tracking! 🚀
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Main tracking view
  if (selectedHabit && quitDate && !showSetup) {
    return (
      <div className="app">
        <div className="container">
          <header>
            <h1>I QUIT</h1>
            <button className="settings-btn" onClick={() => setShowSetup(true)}>⚙️ Edit</button>
          </header>

          <div className="habit-badge">
            <span className="habit-icon">{currentHabit.icon}</span>
            <h2>{currentHabit.name}</h2>
            <p className="funny-fact">{currentHabit.funnyFact}</p>
            <div className="quit-date">
              Started: {quitDate.toLocaleDateString()} at {quitDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </div>
            <div className="encouragement-bubble">{encouragement}</div>
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
              <div className="money-label">Total Money Saved</div>
              <div className="weekly-cost">
                You were spending ${stats.weeklyCost}/week
              </div>
              <div className="money-subtext">
                {stats.moneySaved > 1000 ? "That's a vacation!" : 
                 stats.moneySaved > 500 ? "Nice chunk of change!" : 
                 stats.moneySaved > 100 ? "Keep stacking!" : 
                 "Every penny counts!"}
              </div>
            </div>
          )}

          {stats.specialStat && (
            <div className="special-stat">
              <div className="special-stat-content">
                {stats.specialStat}
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
