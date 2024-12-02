import React, { useState } from 'react';
import { Menu, ChevronDown, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';
import { NotificationBell } from '../notifications/NotificationBell';

export function Header() {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <button className="text-primary-500 hover:text-primary-600">
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="ml-4 text-xl font-bold text-gray-900">MNP Tracker</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <NotificationBell />
            
            <div className="relative">
              <button
                className="flex items-center space-x-2 p-2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <span className="text-sm font-medium">{user?.username || 'Utilisateur'}</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Déconnexion
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}