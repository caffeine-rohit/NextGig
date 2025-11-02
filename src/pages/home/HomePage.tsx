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
      <section className="bg-gradient-to-br from-primary-50 via-white to-accent-50 py-28 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold text-dark font-heading leading-tight">
              Discover Your Next
              <span className="text-primary"> Career Move</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 font-body leading-relaxed">
              Connect with top opportunities from leading companies across India.
              Your dream job is just a search away.
            </p>

            <form onSubmit={handleSearch} className="max-w-2xl mx-auto pt-4">
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

            <div className="flex flex-wrap justify-center items-center gap-4 pt-6">
              <span className="text-sm text-gray-600 font-body">Popular:</span>
              {['Engineering', 'Design', 'Product', 'Marketing'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => navigate(`/jobs?category=${cat}`)}
                  className="px-4 py-2 bg-white text-primary border border-primary-200 rounded-full text-sm font-medium hover:bg-primary hover:text-white transition-all duration-200"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full">
                  <TrendingUp className="w-10 h-10 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-dark mb-4 font-heading">
                  Growing Opportunities
                </h3>
                <p className="text-gray-600 font-body leading-relaxed">
                  Access hundreds of new job postings daily from startups to
                  enterprises
                </p>
              </div>
            </div>

            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-accent-100 rounded-full">
                  <Users className="w-10 h-10 text-accent" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-dark mb-4 font-heading">
                  Trusted Network
                </h3>
                <p className="text-gray-600 font-body leading-relaxed">
                  Connect directly with hiring managers and decision makers
                </p>
              </div>
            </div>

            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full">
                  <Zap className="w-10 h-10 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-dark mb-4 font-heading">
                  Quick Apply
                </h3>
                <p className="text-gray-600 font-body leading-relaxed">
                  Streamlined application process that saves you time
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-dark font-heading mb-4">
                Featured Opportunities
              </h2>
              <p className="text-lg text-gray-600 font-body">
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

      <section className="py-28 md:py-32 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10">
          <h2 className="text-4xl md:text-5xl font-bold font-heading leading-tight">
            Ready to Find Your Perfect Opportunity?
          </h2>
          <p className="text-lg md:text-xl text-primary-100 font-body leading-relaxed">
            Join thousands of professionals who have found their dream jobs
            through OpportunityHub
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center pt-4">
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
