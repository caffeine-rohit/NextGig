import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useJobs } from '../../hooks/useJobs';
import { OpportunityGrid } from '../../components/jobs/OpportunityGrid';
import { FilterPanel } from '../../components/jobs/FilterPanel';
import { InputField } from '../../components/common/InputField';
import { JobFilters } from '../../types';

export function BrowseJobsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || '';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const { jobs, loading, filters, updateFilters, clearFilters } = useJobs({
    search: initialSearch,
    category: initialCategory,
  });

  useEffect(() => {
    const params: JobFilters = {};
    if (initialSearch) params.search = initialSearch;
    if (initialCategory) params.category = initialCategory;
    updateFilters(params);
  }, [initialSearch, initialCategory]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ ...filters, search: searchQuery });
    if (searchQuery) {
      setSearchParams({ ...Object.fromEntries(searchParams), search: searchQuery });
    } else {
      searchParams.delete('search');
      setSearchParams(searchParams);
    }
  };

  const handleClearFilters = () => {
    clearFilters();
    setSearchQuery('');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-dark font-heading mb-8">
            Browse Opportunities
          </h1>

          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="flex gap-3">
              <div className="flex-1">
                <InputField
                  type="text"
                  placeholder="Search by job title, company, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 bg-primary text-white rounded-button font-semibold hover:bg-primary-600 transition-all duration-200 hover:scale-[1.02] shadow-custom hover:shadow-custom-hover"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <aside className="lg:col-span-1">
            <FilterPanel
              filters={filters}
              onFiltersChange={updateFilters}
              onClear={handleClearFilters}
            />
          </aside>

          <main className="lg:col-span-3">
            <div className="mb-10">
              <p className="text-lg text-gray-600 font-body">
                {loading ? (
                  'Loading opportunities...'
                ) : (
                  <>
                    Showing <span className="font-semibold text-dark">{jobs.length}</span>{' '}
                    {jobs.length === 1 ? 'opportunity' : 'opportunities'}
                  </>
                )}
              </p>
            </div>

            <OpportunityGrid jobs={jobs} isLoading={loading} />
          </main>
        </div>
      </div>
    </div>
  );
}
