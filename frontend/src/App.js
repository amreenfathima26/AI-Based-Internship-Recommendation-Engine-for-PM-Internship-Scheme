import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import config from './config';
import { LayoutDashboard, Globe, BookOpen, ScanLine, LogOut } from 'lucide-react';
import './App.css';

// Components
import Login from './components/Login';
import Register from './components/Register';
import RecommendationForm from './components/RecommendationForm';
import RecommendationResults from './components/RecommendationResults';
import ChatWidget from './components/ChatWidget';
import ParticlesBackground from './components/ParticlesBackground';
import Navigation from './components/Navigation';

// Pages
import Dashboard from './pages/Dashboard';
import LiveJobs from './pages/LiveJobs';
import ATSScanner from './pages/ATSScanner';
import InterviewPrep from './pages/InterviewPrep';
import QuizHub from './pages/QuizHub';
import ProfilePage from './pages/ProfilePage';

// Deleted const API_BASE_URL

function App() {
  const [authMode, setAuthMode] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      checkAuthStatus();
    }
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`${config.API_BASE_URL}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      }
    } catch (err) {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
    }
  };

  const handleLogin = async (loginData) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      localStorage.setItem('token', data.access_token);
      setUser(data.user);
      setIsAuthenticated(true);
      await checkAuthStatus(); // Refresh profile
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (registerData) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      localStorage.setItem('token', data.access_token);
      setUser(data.user);
      setIsAuthenticated(true);
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  // Protected Route Component for Corporate Security
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) return <Navigate to="/" replace />;
    return children;
  };

  // Landing Page Component
  const LandingPage = () => {
    if (isAuthenticated) return <Navigate to="/dashboard" replace />;

    return (
      <div className="master-container">
        <ParticlesBackground />

        <div className="relative z-10 w-full flex flex-col items-center">
          {/* Professional Corporate Landing Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-7xl font-black text-white mb-2 tracking-tighter drop-shadow-2xl">
                PM Intern <span className="text-blue-500">AI</span>
              </h1>
              <p className="text-blue-100/60 text-lg font-medium tracking-widest uppercase mb-1">
                Enterprise Career Intelligence Platform
              </p>
              <div className="h-1 w-24 bg-blue-600 mx-auto rounded-full mt-4"></div>
            </motion.div>
          </div>

          {/* Main Auth Wrapper */}
          <div className="auth-card-wrapper">
            {authMode === 'login' ? (
              <Login
                onLogin={handleLogin}
                onSwitchToRegister={() => setAuthMode('register')}
                loading={authLoading}
                error={authError}
              />
            ) : (
              <Register
                onRegister={handleRegister}
                onSwitchToLogin={() => setAuthMode('login')}
                loading={authLoading}
                error={authError}
              />
            )}
          </div>
        </div>
      </div>
    );
  };

  // Internal component for the Recommendation Flow to fit routing
  const RecommendationWrapper = () => {
    const [recs, setRecs] = useState(null);

    const handleSubmit = async (data) => {
      const token = localStorage.getItem('token');
      const res = await fetch(`${config.API_BASE_URL}/api/recommend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      setRecs(json.recommendations);
    };

    if (recs) return <div className="p-8"><RecommendationResults recommendations={recs} onReset={() => setRecs(null)} /></div>

    return (
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="corp-header text-3xl mb-6 text-white">🎯 Get Recommended</h1>
        <div className="corp-card shadow-sm">
          <RecommendationForm onSubmit={handleSubmit} initialProfile={user?.profile} />
        </div>
      </div>
    )
  }

  return (
    <Router>
      {!isAuthenticated ? (
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      ) : (
        <div className="flex min-h-screen font-sans">
          <Navigation user={user} onLogout={handleLogout} />

          <div className="flex-1 ml-64 relative z-10 p-4">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/jobs" element={<LiveJobs />} />
                <Route path="/ats" element={<ATSScanner />} />
                <Route path="/rec" element={<RecommendationWrapper />} />
                <Route path="/interview" element={<InterviewPrep />} />
                <Route path="/quiz" element={<QuizHub />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Routes>
            </AnimatePresence>
            <ChatWidget />
          </div>
        </div>
      )}
    </Router>
  );
}

export default App;
