import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { AuthForm } from './components/AuthForm';
import { Dashboard } from './components/Dashboard';
import { Profile } from './components/Profile';
import { User, AppState } from './types';
import { storage } from './utils/storage';

function App() {
  const [appState, setAppState] = useState<AppState>({
    auth: {
      user: null,
      isAuthenticated: false
    },
    currentView: 'landing',
    notes: [],
    currentNote: null,
    searchQuery: '',
    showAIInsights: false
  });

  // Check for existing user session on app load
  useEffect(() => {
    const existingUser = storage.getCurrentUser(); // FIXED
    if (existingUser) {
      setAppState(prev => ({
        ...prev,
        auth: {
          user: existingUser,
          isAuthenticated: true
        },
        currentView: 'dashboard'
      }));
    }
  }, []);

  const handleGetStarted = () => {
    setAppState(prev => ({ ...prev, currentView: 'auth' }));
  };

  const handleBackToLanding = () => {
    setAppState(prev => ({ ...prev, currentView: 'landing' }));
  };

  const handleAuthenticate = (user: User) => {
    storage.saveUser(user);
    setAppState(prev => ({
      ...prev,
      auth: {
        user,
        isAuthenticated: true
      },
      currentView: 'dashboard'
    }));
  };

  const handleLogout = () => {
    storage.logout(); // FIXED
    setAppState(prev => ({
      ...prev,
      auth: {
        user: null,
        isAuthenticated: false
      },
      currentView: 'landing'
    }));
  };

  const handleShowProfile = () => {
    setAppState(prev => ({ ...prev, currentView: 'profile' }));
  };

  const handleBackToDashboard = () => {
    setAppState(prev => ({ ...prev, currentView: 'dashboard' }));
  };

  const handleUpdateUser = (updatedUser: User) => {
    setAppState(prev => ({
      ...prev,
      auth: {
        ...prev.auth,
        user: updatedUser
      }
    }));
  };

  // Render based on current view
  switch (appState.currentView) {
    case 'landing':
      return <LandingPage onGetStarted={handleGetStarted} />;
    
    case 'auth':
      return (
        <AuthForm 
          onBack={handleBackToLanding}
          onAuthenticate={handleAuthenticate}
        />
      );
    
    case 'dashboard':
      return appState.auth.user ? (
        <Dashboard
          user={appState.auth.user}
          onLogout={handleLogout}
          onShowProfile={handleShowProfile}
        />
      ) : null;
    
    case 'profile':
      return appState.auth.user ? (
        <Profile
          user={appState.auth.user}
          onBack={handleBackToDashboard}
          onUpdateUser={handleUpdateUser}
        />
      ) : null;
    
    default:
      return <LandingPage onGetStarted={handleGetStarted} />;
  }
}

export default App;