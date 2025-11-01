import { Briefcase, Github, Twitter, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

export function PageFooter() {
  return (
    <footer className="bg-dark text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-primary rounded-lg p-2">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white font-heading">
                OpportunityHub
              </span>
            </div>
            <p className="text-gray-400 font-body mb-6 leading-relaxed">
              Connecting talented professionals with their dream opportunities.
              Find your next career move or discover the perfect candidate for
              your team.
            </p>
            <div className="flex gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

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
                  to="/candidate/dashboard"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  My Applications
                </Link>
              </li>
              <li>
                <Link
                  to="/candidate/profile"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold font-heading mb-4">
              For Employers
            </h3>
            <ul className="space-y-3 font-body">
              <li>
                <Link
                  to="/employer/dashboard"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  Post a Job
                </Link>
              </li>
              <li>
                <Link
                  to="/employer/dashboard"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  Manage Jobs
                </Link>
              </li>
              <li>
                <Link
                  to="/employer/profile"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  Company Profile
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-8 text-center">
          <p className="text-gray-400 font-body text-sm">
            &copy; {new Date().getFullYear()} OpportunityHub. Built with care for
            connecting talent with opportunity.
          </p>
        </div>
      </div>
    </footer>
  );
}
