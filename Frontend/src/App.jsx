import {Routes, Route, Link} from 'react-router-dom'
import HomePage from './pages/Home'
import DashboardPage from './pages/Dashboard'
import AuthPage from './pages/Auth'
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";

function App() {
  return (
      <div className='app'>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/Dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/Auth">Auth</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/Dashboard" element={<DashboardPage/>} />
          <Route path="/Auth" element={<AuthPage/>} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </div>
  )
}

export default App
