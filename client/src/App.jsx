import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Recommend from './pages/Recommend'
import Login from './pages/Login'

function App() {
  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recommend" element={<Recommend />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  )
}

export default App
