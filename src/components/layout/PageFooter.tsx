// src/components/layout/PageFooter.tsx
import { Briefcase, Github, Twitter, Linkedin } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export function PageFooter() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  const userRole = profile?.role || user?.role || null;
  const isAuthenticated = !!user;

  const handleProtectedLink = (e: React.MouseEvent, path: string) => {
    if (!isAuthenticated) {
      e.preventDefault();
      navigate("/auth/login", { state: { from: path } });
    }
  };

  return (
    <footer className="bg-dark text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content - Left: Brand, Right: Role Links */}
        <div className="flex flex-col md:flex-row justify-between gap-10 md:gap-16">
          {/* Left Side - Brand Section */}
          <div className="flex-1 max-w-md">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-primary rounded-lg p-2">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white font-heading">
                NextGig
              </span>
            </div>

            <p className="text-gray-400 font-body mb-6 leading-relaxed">
              Connecting talented professionals with their dream opportunities.
              Find your next career move or discover the perfect candidate for
              your team.
            </p>

            <div className="flex gap-4">
              <a
                href="https://github.com/caffeine-rohit/NextGig"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/rohit-sharma-connect/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Right Side - Role-Based Links */}
          <div className="flex gap-12 md:gap-16">
            {/* Candidate Column */}
            {(userRole === "candidate" || !isAuthenticated) && (
              <div>
                <h3 className="text-white font-semibold font-heading mb-4">
                  For Candidates
                </h3>
                <ul className="space-y-3 font-body">
                  <li>
                    <Link
                      to="/jobs"
                      className="text-gray-400 hover:text-primary transition-colors"
                    >
                      Browse Jobs
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/candidate/dashboard#applications"
                      onClick={(e) =>
                        handleProtectedLink(e, "/candidate/dashboard#applications")
                      }
                      className="text-gray-400 hover:text-primary transition-colors"
                    >
                      My Applications
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/profile"
                      onClick={(e) => handleProtectedLink(e, "/profile")}
                      className="text-gray-400 hover:text-primary transition-colors"
                    >
                      Profile
                    </Link>
                  </li>
                </ul>
              </div>
            )}

            {/* Employer Column */}
            {(userRole === "employer" || !isAuthenticated) && (
              <div>
                <h3 className="text-white font-semibold font-heading mb-4">
                  For Employers
                </h3>
                <ul className="space-y-3 font-body">
                  <li>
                    <Link
                      to="/employer/dashboard"
                      onClick={(e) => handleProtectedLink(e, "/employer/dashboard")}
                      className="text-gray-400 hover:text-primary transition-colors"
                    >
                      Post / Manage Jobs
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/profile"
                      onClick={(e) => handleProtectedLink(e, "/profile")}
                      className="text-gray-400 hover:text-primary transition-colors"
                    >
                      Company Profile
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Navigation - Spread Across */}
        <div className="border-t border-gray-700 mt-10 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
            <Link
              to="/"
              className="text-gray-400 hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              to="/#about"
              className="text-gray-400 hover:text-primary transition-colors"
            >
              About
            </Link>
            <Link
              to="/#contact"
              className="text-gray-400 hover:text-primary transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Copyright - Centered Below */}
          <div className="text-center mt-6">
            <p className="text-gray-500 font-body text-sm">
              &copy; {new Date().getFullYear()} NextGig. Built with ❤️ for
              connecting talent with opportunity.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default PageFooter;