
import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Expenses } from './pages/Expenses';
import { History } from './pages/History';
import { Settings } from './pages/Settings';
import { Onboarding } from './pages/Onboarding';
import { Tools } from './pages/Tools';
import { mockBackend } from './services/mockBackend';
import { User } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        // With the new LocalStorage backend, this always returns a user (created if needed)
        const currentUser = await mockBackend.getCurrentUser();
        setUser(currentUser);
      } catch (e) {
        console.error("Error loading user", e);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-primary-500">
        <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mb-4"></div>
        <span className="animate-pulse">Money Booster...</span>
      </div>
    );
  }

  // Fallback safety, though backend should always return user now
  if (!user) {
     return <div className="p-10 text-white text-center">Erro ao carregar aplicação. Tente recarregar.</div>;
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard user={user} />} />
          <Route path="/add" element={<Expenses user={user} />} />
          <Route path="/history" element={<History user={user} />} />
          <Route path="/settings" element={<Settings user={user} />} />
          <Route path="/tools" element={<Tools user={user} />} />
          <Route path="/onboarding" element={<Onboarding onUpdateUser={setUser} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
