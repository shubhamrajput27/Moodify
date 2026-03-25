import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'

const Home = lazy(() => import('./pages/Home'))
const Recommend = lazy(() => import('./pages/Recommend'))
const Login = lazy(() => import('./pages/Login'))

function App() {
  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <Suspense
        fallback={
          <div className="flex min-h-[60vh] items-center justify-center text-gray-600 dark:text-gray-400">
            Loading...
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recommend" element={<Recommend />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Suspense>
    </div>
  )
}

export default App
