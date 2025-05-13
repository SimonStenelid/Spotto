import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import { Navigation } from './components/ui/Navigation';
import { HomeIcon, BookmarkIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { supabase } from './lib/supabase';

// Pages
import HomePage from './pages/HomePage';
import PlaceDetailPage from './pages/PlaceDetailPage';
import ProfilePage from './pages/ProfilePage';
import BookmarksPage from './pages/BookmarksPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

// Route guard component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authState } = useAuthStore();
  
  if (authState === 'LOADING') {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }
  
  if (authState === 'SIGNED_OUT') {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`flex flex-col items-center ${
        isActive ? 'text-purple-600' : 'text-gray-500'
      }`}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </Link>
  );
};

function AppContent() {
  const { initialize, authState } = useAuthStore();
  
  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <Navigation />
      </div>
      
      {/* Main Content */}
      <main className={cn(
        "flex-1 transition-all duration-300",
        "relative h-screen overflow-hidden"
      )}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/place/:id" element={<PlaceDetailPage />} />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/bookmarks" 
            element={
              <ProtectedRoute>
                <BookmarksPage />
              </ProtectedRoute>
            } 
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </main>
      
      {/* Mobile Navigation */}
      {authState === 'SIGNED_IN' && (
        <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 flex justify-around py-3 px-4 shadow-lg md:hidden">
          <NavItem to="/" icon={<HomeIcon className="h-6 w-6" />} label="Home" />
          <NavItem to="/bookmarks" icon={<BookmarkIcon className="h-6 w-6" />} label="Saved" />
          <NavItem to="/profile" icon={<UserCircleIcon className="h-6 w-6" />} label="Profile" />
        </nav>
      )}

      <Toaster />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
