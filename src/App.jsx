import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import Navbar from './Navbar'
import Home from './Home'
import Events from './Events'
import Challenges from './Challenges'
import Team from './Team'
import Projects from './Projects'
import Leaderboard from './Leaderboard'
import Gallery from './Gallery'
import Profile from './Profile'
import Admin from './Admin'
import Login from './Login'
import Signup from './Signup'
import ChallengeDetail from './ChallengeDetail'
import ProjectDetail from './ProjectDetail'
import Unauthorized from './Unauthorized'
import NotFound from './NotFound'
import HexGrid from './components/HexGrid'
import FloatingDecorations from './components/FloatingDecorations'

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-bg selection:bg-teal/30 selection:text-teal font-space">
          <HexGrid />
          <FloatingDecorations />
          <Navbar />
          <main className="relative z-10">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* Protected Routes - Require Login */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/events" element={
                <ProtectedRoute>
                  <Events />
                </ProtectedRoute>
              } />
              <Route path="/challenges" element={
                <ProtectedRoute>
                  <Challenges />
                </ProtectedRoute>
              } />
              <Route path="/challenges/:id" element={
                <ProtectedRoute>
                  <ChallengeDetail />
                </ProtectedRoute>
              } />
              <Route path="/projects" element={
                <ProtectedRoute>
                  <Projects />
                </ProtectedRoute>
              } />
              <Route path="/projects/:id" element={
                <ProtectedRoute>
                  <ProjectDetail />
                </ProtectedRoute>
              } />
              <Route path="/team" element={
                <ProtectedRoute>
                  <Team />
                </ProtectedRoute>
              } />
              <Route path="/gallery" element={
                <ProtectedRoute>
                  <Gallery />
                </ProtectedRoute>
              } />
              <Route path="/leaderboard" element={
                <ProtectedRoute>
                  <Leaderboard />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />

              {/* Admin Routes - Require Admin Role */}
              <Route path="/admin/*" element={
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              } />

              {/* Catch-all - 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App
