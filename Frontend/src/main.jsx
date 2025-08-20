import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import GlobalStyles from './components/GlobalStyles'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GlobalStyles>
      <Router>
        <App />
      </Router>
    </GlobalStyles>
  </StrictMode>,
)
