import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, Users, Briefcase, BarChart } from 'lucide-react';
import { jobService } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';
import { Job, Application } from '../../types';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { GlassCard } from '../../components/common/GlassCard';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { formatDate, formatApplicationCount } from '../../utils/formatters';

interface EmployerDashboardProps {
  profile: any;
}

export function EmployerDashboard({ profile }: EmployerDashboardProps) {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    company_name: profile?.company_name || '',
    description: '',
    category: 'Engineering',
    location: 'Bengaluru',
    job_type: 'Full-time',
    experience_level: 'Mid',
    salary_min: '',
    salary_max: '',
    is_remote: false,
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (profile) {
      fetchJobs();
    }
  }, [profile]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await jobService.getEmployerJobs(profile.id);
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCreating(true);
      await jobService.createJob({
        ...newJob,
        employer_id: profile.id,
        salary_min: newJob.salary_min ? parseInt(newJob.salary_min) : null,
        salary_max: newJob.salary_max ? parseInt(newJob.salary_max) : null,
        salary_currency: 'INR',
        status: 'active',
      });
      setShowCreateModal(false);
      fetchJobs();
      setNewJob({
        title: '',
        company_name: profile?.company_name || '',
        description: '',
        category: 'Engineering',
        location: 'Bengaluru',
        job_type: 'Full-time',
        experience_level: 'Mid',
        salary_min: '',
        salary_max: '',
        is_remote: false,
      });
    } catch (error) {
      console.error('Error creating job:', error);
      alert('Failed to create job');
    } finally {
      setCreating(false);
    }
  };

  const totalApplications = jobs.reduce((sum, job) => sum + job.application_count, 0);
  const activeJobs = jobs.filter((job) => job.status === 'active').length;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-dark font-heading mb-2">
              Employer Dashboard
            </h1>
            <p className="text-gray-600 font-body">
              Manage your job postings and track applications
            </p>
          </div>
          <PrimaryButton onClick={() => setShowCreateModal(true)}>
            <Plus className="w-5 h-5 mr-2" />
            Post a Job
          </PrimaryButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <GlassCard>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Briefcase className="w-8 h-8 text-primary" />
                <span className="text-3xl font-bold text-dark font-heading">
                  {activeJobs}
                </span>
              </div>
              <p className="text-gray-600 font-body">Active Jobs</p>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-8 h-8 text-accent" />
                <span className="text-3xl font-bold text-dark font-heading">
                  {totalApplications}
                </span>
              </div>
              <p className="text-gray-600 font-body">Total Applications</p>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <BarChart className="w-8 h-8 text-primary" />
                <span className="text-3xl font-bold text-dark font-heading">
                  {jobs.length}
                </span>
              </div>
              <p className="text-gray-600 font-body">Total Jobs Posted</p>
            </div>
          </GlassCard>
        </div>

        <GlassCard>
          <div className="p-8">
            <h2 className="text-xl font-semibold text-dark font-heading mb-6">
              Your Job Postings
            </h2>

            {loading ? (
              <LoadingSkeleton type="list" />
            ) : jobs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 font-body mb-4">
                  You haven't posted any jobs yet
                </p>
                <PrimaryButton onClick={() => setShowCreateModal(true)}>
                  Post Your First Job
                </PrimaryButton>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="border border-gray-200 rounded-card p-6 hover:border-primary transition-colors cursor-pointer"
                    onClick={() => navigate(`/jobs/${job.id}`)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-dark font-heading mb-1">
                          {job.title}
                        </h3>
                        <p className="text-gray-600 font-body text-sm">
                          {job.location} • {job.job_type} • {job.experience_level}
                        </p>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          job.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {job.status}
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-gray-500 font-body">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{formatApplicationCount(job.application_count)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        <span>{job.views_count} views</span>
                      </div>
                      <span>Posted {formatDate(job.created_at)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </GlassCard>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-card shadow-custom-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-dark font-heading mb-6">
                Post a New Job
              </h2>

              <form onSubmit={handleCreateJob} className="space-y-5">
                <input
                  type="text"
                  placeholder="Job Title"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-input font-body"
                  value={newJob.title}
                  onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                  required
                />

                <textarea
                  placeholder="Job Description"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-input font-body resize-none"
                  rows={6}
                  value={newJob.description}
                  onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Location"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-input font-body"
                    value={newJob.location}
                    onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                    required
                  />

                  <input
                    type="text"
                    placeholder="Category"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-input font-body"
                    value={newJob.category}
                    onChange={(e) => setNewJob({ ...newJob, category: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder="Min Salary"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-input font-body"
                    value={newJob.salary_min}
                    onChange={(e) => setNewJob({ ...newJob, salary_min: e.target.value })}
                  />

                  <input
                    type="number"
                    placeholder="Max Salary"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-input font-body"
                    value={newJob.salary_max}
                    onChange={(e) => setNewJob({ ...newJob, salary_max: e.target.value })}
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newJob.is_remote}
                    onChange={(e) => setNewJob({ ...newJob, is_remote: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium text-gray-700 font-body">
                    Remote Position
                  </span>
                </label>

                <div className="flex gap-3">
                  <PrimaryButton
                    type="submit"
                    isLoading={creating}
                    disabled={creating}
                    className="flex-1"
                  >
                    Post Job
                  </PrimaryButton>
                  <PrimaryButton
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateModal(false)}
                    disabled={creating}
                  >
                    Cancel
                  </PrimaryButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
