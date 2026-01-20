import React from 'react'

function App() {
  return (
    <div className="dashboard">
      <header className="header">
        <h1>WebWaka Dashboard</h1>
        <p className="subtitle">Tenant Management Suite</p>
      </header>
      
      <main className="main">
        <div className="card-grid">
          <div className="card">
            <h2>Overview</h2>
            <p>Welcome to the WebWaka Dashboard. This is the tenant management interface for the WebWaka platform.</p>
          </div>
          
          <div className="card">
            <h2>Status</h2>
            <div className="status-indicator active"></div>
            <span>All systems operational</span>
          </div>
          
          <div className="card">
            <h2>Quick Stats</h2>
            <ul className="stats-list">
              <li><span>Active Tenants:</span> 0</li>
              <li><span>Resources:</span> 0</li>
              <li><span>Uptime:</span> 100%</li>
            </ul>
          </div>
          
          <div className="card">
            <h2>Getting Started</h2>
            <p>Configure your tenant settings and start managing your resources.</p>
          </div>
        </div>
      </main>
      
      <footer className="footer">
        <p>WebWaka Suite - Tenant Dashboard v0.0.0</p>
      </footer>
    </div>
  )
}

export default App
