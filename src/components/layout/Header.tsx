import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, Bell, Settings } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useHealthStore } from '../../store/healthStore';

export const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { alerts } = useHealthStore();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const criticalAlerts = alerts.filter((a) => a.status === 'pending' && a.severity === 'critical').length;

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/welcome');
  };

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 shadow-elegant border-b border-neutral-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            to="/dashboard"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                ElderEase
              </p>
              <p className="text-xs text-neutral-400">Healthcare for Seniors</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/dashboard"
              className="text-neutral-300 hover:text-primary-400 text-sm font-medium transition-colors duration-200"
            >
              Dashboard
            </Link>
            <Link
              to="/health"
              className="text-neutral-300 hover:text-primary-400 text-sm font-medium transition-colors duration-200"
            >
              Health
            </Link>
            <Link
              to="/healthcare"
              className="text-neutral-300 hover:text-primary-400 text-sm font-medium transition-colors duration-200"
            >
              Healthcare
            </Link>
            <Link
              to="/home-assistance"
              className="text-neutral-300 hover:text-primary-400 text-sm font-medium transition-colors duration-200"
            >
              Home Help
            </Link>
            <Link
              to="/medications"
              className="text-neutral-300 hover:text-primary-400 text-sm font-medium transition-colors duration-200"
            >
              Medications
            </Link>
            <Link
              to="/contacts"
              className="text-neutral-300 hover:text-primary-400 text-sm font-medium transition-colors duration-200"
            >
              Contacts
            </Link>
            <Link
              to="/reports"
              className="text-neutral-300 hover:text-primary-400 text-sm font-medium transition-colors duration-200"
            >
              Reports
            </Link>
            <Link
              to="/medical-info"
              className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors duration-200"
            >
              Medical Info
            </Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Alerts Bell */}
            <button className="relative p-2 text-neutral-300 hover:text-primary-400 hover:bg-neutral-700 rounded-lg transition-all duration-200">
              <Bell size={20} />
              {criticalAlerts > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold leading-none text-white bg-gradient-to-r from-accent-500 to-accent-600 rounded-full">
                  {criticalAlerts}
                </span>
              )}
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 text-neutral-300 hover:text-primary-400 hover:bg-neutral-700 rounded-lg transition-all duration-200"
              >
                <img
                  src={user?.profileImage}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full border-2 border-primary-400"
                />
                <span className="hidden sm:inline text-sm font-medium text-neutral-300">
                  {user?.name}
                </span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-neutral-800 rounded-xl shadow-hover border border-neutral-700 py-2 z-50">
                  <div className="px-4 py-3 border-b border-neutral-700">
                    <p className="font-semibold text-white">{user?.name}</p>
                    <p className="text-xs text-neutral-400">{user?.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-4 py-2 text-neutral-300 hover:bg-neutral-700 hover:text-primary-400 transition-colors"
                  >
                    <Settings size={16} />
                    Profile Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-3 px-4 py-2 text-accent-400 hover:bg-neutral-700 transition-colors"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 text-neutral-300 hover:text-primary-400 hover:bg-neutral-700 rounded-lg transition-all duration-200"
            >
              {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {showMobileMenu && (
          <nav className="md:hidden border-t border-neutral-700 py-4 space-y-2 pb-4">
            <Link
              to="/dashboard"
              className="block px-4 py-2 text-neutral-300 hover:text-primary-400 hover:bg-neutral-700 rounded-lg transition-colors"
              onClick={() => setShowMobileMenu(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/health"
              className="block px-4 py-2 text-neutral-300 hover:text-primary-400 hover:bg-neutral-700 rounded-lg transition-colors"
              onClick={() => setShowMobileMenu(false)}
            >
              Health
            </Link>
            <Link
              to="/healthcare"
              className="block px-4 py-2 text-neutral-300 hover:text-primary-400 hover:bg-neutral-700 rounded-lg transition-colors"
              onClick={() => setShowMobileMenu(false)}
            >
              Healthcare
            </Link>
            <Link
              to="/home-assistance"
              className="block px-4 py-2 text-neutral-300 hover:text-primary-400 hover:bg-neutral-700 rounded-lg transition-colors"
              onClick={() => setShowMobileMenu(false)}
            >
              Home Help
            </Link>
            <Link
              to="/medications"
              className="block px-4 py-2 text-neutral-300 hover:text-primary-400 hover:bg-neutral-700 rounded-lg transition-colors"
              onClick={() => setShowMobileMenu(false)}
            >
              Contacts
            </Link>
            <Link
              to="/reports"
              className="block px-4 py-2 text-neutral-300 hover:text-primary-400 hover:bg-neutral-700 rounded-lg transition-colors"
              onClick={() => setShowMobileMenu(false)}
            >
              Reports
            </Link>
            <Link
              to="/medical-info"
              className="block px-4 py-2 text-red-400 hover:text-red-300 hover:bg-neutral-700 rounded-lg transition-colors"
              onClick={() => setShowMobileMenu(false)}
            >
              Medical Info
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};
