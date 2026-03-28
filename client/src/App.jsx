import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import MiniPlayer from './components/MiniPlayer'
import { usePlayer } from './context/PlayerContext'

const Home = lazy(() => import('./pages/Home'))
const Recommend = lazy(() => import('./pages/Recommend'))
const Login = lazy(() => import('./pages/Login'))

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname])

  return null
}

function App() {
  const { currentTrack } = usePlayer()

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col">
      <ScrollToTop />
      <Navbar />
      <main className={currentTrack ? 'flex-1 pb-28' : 'flex-1'}>
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
      </main>
      <Footer />
      <MiniPlayer />
    </div>
  )
}

export default App
