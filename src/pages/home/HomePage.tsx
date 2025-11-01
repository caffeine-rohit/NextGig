import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, TrendingUp, Users, Zap } from 'lucide-react';
import { useFeaturedJobs } from '../../hooks/useJobs';
import { OpportunityGrid } from '../../components/jobs/OpportunityGrid';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { InputField } from '../../components/common/InputField';
import { JOB_CATEGORIES } from '../../constants/categories';

export function HomePage() {
  const navigate = useNavigate();
  const { jobs, loading } = useFeaturedJobs();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/jobs');
    }
  };

  return (
    <div>
      <section className="bg-gradient-to-br from-primary-50 via-white to-accent-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-dark mb-6 font-heading leading-tight">
              Discover Your Next
              <span className="text-primary"> Career Move</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 font-body leading-relaxed">
              Connect with top opportunities from leading companies across India.
              Your dream job is just a search away.
            </p>

            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="flex gap-3">
                <div className="flex-1">
                  <InputField
                    type="text"
                    placeholder="Search by job title, company, or skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="text-lg"
                  />
                </div>
                <PrimaryButton type="submit" size="lg">
                  <Search className="w-5 h-5" />
                </PrimaryButton>
              </div>
            </form>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <span className="text-sm text-gray-600 font-body">Popular:</span>
              {['Engineering', 'Design', 'Product', 'Marketing'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => navigate(`/jobs?category=${cat}`)}
                  className="px-4 py-1.5 bg-white text-primary border border-primary-200 rounded-full text-sm font-medium hover:bg-primary hover:text-white transition-all duration-200"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-5">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-dark mb-3 font-heading">
                Growing Opportunities
              </h3>
              <p className="text-gray-600 font-body leading-relaxed">
                Access hundreds of new job postings daily from startups to
                enterprises
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-100 rounded-full mb-5">
                <Users className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-dark mb-3 font-heading">
                Trusted Network
              </h3>
              <p className="text-gray-600 font-body leading-relaxed">
                Connect directly with hiring managers and decision makers
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-5">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-dark mb-3 font-heading">
                Quick Apply
              </h3>
              <p className="text-gray-600 font-body leading-relaxed">
                Streamlined application process that saves you time
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-dark font-heading mb-2">
                Featured Opportunities
              </h2>
              <p className="text-gray-600 font-body">
                Hand-picked positions from top companies
              </p>
            </div>
            <PrimaryButton variant="outline" onClick={() => navigate('/jobs')}>
              View All Jobs
            </PrimaryButton>
          </div>

          <OpportunityGrid jobs={jobs} isLoading={loading} />
        </div>
      </section>

      <section className="py-20 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-5 font-heading">
            Ready to Find Your Perfect Opportunity?
          </h2>
          <p className="text-xl text-primary-100 mb-10 font-body max-w-2xl mx-auto">
            Join thousands of professionals who have found their dream jobs
            through OpportunityHub
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <PrimaryButton
              variant="secondary"
              size="lg"
              onClick={() => navigate('/jobs')}
            >
              Browse All Jobs
            </PrimaryButton>
            <PrimaryButton
              variant="outline"
              size="lg"
              onClick={() => navigate('/auth/register')}
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary"
            >
              Create Account
            </PrimaryButton>
          </div>
        </div>
      </section>
    </div>
  );
}
