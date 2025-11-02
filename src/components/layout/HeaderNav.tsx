import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Briefcase, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
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

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-custom sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary rounded-lg p-2">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-dark font-heading">
              NextGig
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/jobs"
              className={`font-body font-medium transition-colors ${
                isActive('/jobs')
                  ? 'text-primary'
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
                    className={`font-body font-medium transition-colors ${
                      isActive('/employer/dashboard')
                        ? 'text-primary'
                        : 'text-gray-700 hover:text-primary'
                    }`}
                  >
                    Employer Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/candidate/dashboard"
                    className={`font-body font-medium transition-colors ${
                      isActive('/candidate/dashboard')
                        ? 'text-primary'
                        : 'text-gray-700 hover:text-primary'
                    }`}
                  >
                    My Applications
                  </Link>
                )}

                <div className="flex items-center gap-3">
                  <Link
                    to={
                      profile?.role === 'employer'
                        ? '/employer/profile'
                        : '/candidate/profile'
                    }
                    className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors"
                  >
                    <User className="w-5 h-5" />
                    <span className="font-body font-medium">
                      {profile?.full_name}
                    </span>
                  </Link>

                  <button
                    onClick={onLogout}
                    className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
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

          <button
            className="md:hidden text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-3">
            <Link
              to="/jobs"
              className="block py-2 font-body font-medium text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Browse Jobs
            </Link>

            {user ? (
              <>
                <Link
                  to={
                    profile?.role === 'employer'
                      ? '/employer/dashboard'
                      : '/candidate/dashboard'
                  }
                  className="block py-2 font-body font-medium text-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to={
                    profile?.role === 'employer'
                      ? '/employer/profile'
                      : '/candidate/profile'
                  }
                  className="block py-2 font-body font-medium text-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 font-body font-medium text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="space-y-2">
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
