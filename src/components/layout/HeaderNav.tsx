import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Briefcase, User, LogOut, Menu, X, Settings, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { PrimaryButton } from '../common/PrimaryButton';

interface HeaderNavProps {
  user: any;
  profile: any;
  onLogout: () => void;
}

export function HeaderNav({ user, profile, onLogout }: HeaderNavProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => location.pathname === path;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="bg-primary rounded-lg p-2">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-dark font-heading">
              NextGig
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link
              to="/jobs"
              className={`font-body font-medium transition-colors py-1 ${
                isActive('/jobs')
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-700 hover:text-primary'
              }`}
            >
              Browse Jobs
            </Link>

            {user ? (
              <>
                {profile?.role === 'employer' ? (
                  <Link
                    to="/employer/dashboard"
                    className={`font-body font-medium transition-colors py-1 ${
                      isActive('/employer/dashboard')
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-gray-700 hover:text-primary'
                    }`}
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/candidate/dashboard"
                    className={`font-body font-medium transition-colors py-1 ${
                      isActive('/candidate/dashboard')
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-gray-700 hover:text-primary'
                    }`}
                  >
                    My Applications
                  </Link>
                )}

                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors py-2 px-3 rounded-lg hover:bg-gray-50"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-body font-medium max-w-[120px] truncate">
                      {profile?.full_name || 'User'}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {profile?.full_name || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 truncate mt-0.5">
                          {user?.email}
                        </p>
                      </div>

                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>

                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Account Settings</span>
                      </Link>

                      <div className="border-t border-gray-100 my-1"></div>

                      <button
                        onClick={() => {
                          onLogout();
                          setProfileDropdownOpen(false);
                        }}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <PrimaryButton
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/auth/login')}
                >
                  Sign In
                </PrimaryButton>
                <PrimaryButton
                  size="sm"
                  onClick={() => navigate('/auth/register')}
                >
                  Get Started
                </PrimaryButton>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white shadow-lg">
          <div className="px-4 py-4 space-y-1">
            <Link
              to="/jobs"
              className="block px-3 py-2.5 font-body font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Browse Jobs
            </Link>

            {user ? (
              <>
                <Link
                  to={profile?.role === 'employer' ? '/employer/dashboard' : '/candidate/dashboard'}
                  className="block px-3 py-2.5 font-body font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>

                <div className="border-t border-gray-100 my-2"></div>

                <div className="px-3 py-2 bg-gray-50 rounded-lg mb-2">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {profile?.full_name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    {user?.email}
                  </p>
                </div>

                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-3 py-2.5 font-body font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </Link>

                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-3 py-2.5 font-body font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Settings className="w-4 h-4" />
                  <span>Account Settings</span>
                </Link>

                <div className="border-t border-gray-100 my-2"></div>

                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full text-left px-3 py-2.5 font-body font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="space-y-2 pt-2">
                <PrimaryButton
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    navigate('/auth/login');
                    setMobileMenuOpen(false);
                  }}
                >
                  Sign In
                </PrimaryButton>
                <PrimaryButton
                  className="w-full"
                  onClick={() => {
                    navigate('/auth/register');
                    setMobileMenuOpen(false);
                  }}
                >
                  Get Started
                </PrimaryButton>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}