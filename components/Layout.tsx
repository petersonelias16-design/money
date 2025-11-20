
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, History, Settings } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, showNav = true }) => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-dark-bg text-dark-text font-sans flex flex-col pb-20 md:pb-0">
      <main className="flex-1 relative z-0">
        {children}
      </main>

      {showNav && (
        <nav className="fixed bottom-0 left-0 right-0 bg-dark-card border-t border-white/10 pb-safe z-50">
          <div className="flex justify-around items-center h-16 px-2">
            <Link to="/" className={`flex flex-col items-center p-2 transition-colors ${isActive('/') ? 'text-primary' : 'text-dark-muted'}`}>
              <LayoutDashboard size={24} strokeWidth={isActive('/') ? 2.5 : 2} />
              <span className="text-[10px] mt-1 font-medium">Dashboard</span>
            </Link>
            
            <Link to="/add" className={`flex flex-col items-center p-2 transition-colors ${isActive('/add') ? 'text-primary' : 'text-dark-muted'}`}>
              <PlusCircle size={24} strokeWidth={isActive('/add') ? 2.5 : 2} />
              <span className="text-[10px] mt-1 font-medium">Adicionar</span>
            </Link>
            
            <Link to="/history" className={`flex flex-col items-center p-2 transition-colors ${isActive('/history') ? 'text-primary' : 'text-dark-muted'}`}>
              <History size={24} strokeWidth={isActive('/history') ? 2.5 : 2} />
              <span className="text-[10px] mt-1 font-medium">Histórico</span>
            </Link>
            
            <Link to="/settings" className={`flex flex-col items-center p-2 transition-colors ${isActive('/settings') ? 'text-primary' : 'text-dark-muted'}`}>
              <Settings size={24} strokeWidth={isActive('/settings') ? 2.5 : 2} />
              <span className="text-[10px] mt-1 font-medium">Config</span>
            </Link>
          </div>
        </nav>
      )}
    </div>
  );
};
