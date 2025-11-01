import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Clock, CheckCircle, XCircle } from 'lucide-react';
import { applicationService } from '../../services/applicationService';
import { Application } from '../../types';
import { GlassCard } from '../../components/common/GlassCard';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { formatDate, formatSalary } from '../../utils/formatters';
import { PrimaryButton } from '../../components/common/PrimaryButton';

interface CandidateDashboardProps {
  profile: any;
}

export function CandidateDashboard({ profile }: CandidateDashboardProps) {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      fetchApplications();
    }
  }, [profile]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await applicationService.getCandidateApplications(profile.id);
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'reviewing':
        return 'bg-blue-100 text-blue-700';
      case 'shortlisted':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      case 'accepted':
        return 'bg-primary-100 text-primary-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
      case 'reviewing':
        return <Clock className="w-5 h-5" />;
      case 'shortlisted':
      case 'accepted':
        return <CheckCircle className="w-5 h-5" />;
      case 'rejected':
        return <XCircle className="w-5 h-5" />;
      default:
        return <Briefcase className="w-5 h-5" />;
    }
  };

  const pendingCount = applications.filter((app) => app.status === 'pending').length;
  const reviewingCount = applications.filter((app) => app.status === 'reviewing').length;
  const shortlistedCount = applications.filter((app) => app.status === 'shortlisted').length;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark font-heading mb-2">
            My Applications
          </h1>
          <p className="text-gray-600 font-body">
            Track the status of your job applications
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <GlassCard>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-8 h-8 text-yellow-500" />
                <span className="text-3xl font-bold text-dark font-heading">
                  {pendingCount}
                </span>
              </div>
              <p className="text-gray-600 font-body">Pending Review</p>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Briefcase className="w-8 h-8 text-blue-500" />
                <span className="text-3xl font-bold text-dark font-heading">
                  {reviewingCount}
                </span>
              </div>
              <p className="text-gray-600 font-body">Under Review</p>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="w-8 h-8 text-green-500" />
                <span className="text-3xl font-bold text-dark font-heading">
                  {shortlistedCount}
                </span>
              </div>
              <p className="text-gray-600 font-body">Shortlisted</p>
            </div>
          </GlassCard>
        </div>

        <GlassCard>
          <div className="p-8">
            <h2 className="text-xl font-semibold text-dark font-heading mb-6">
              All Applications
            </h2>

            {loading ? (
              <LoadingSkeleton type="list" />
            ) : applications.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 font-body mb-4">
                  You haven't applied to any jobs yet
                </p>
                <PrimaryButton onClick={() => navigate('/jobs')}>
                  Browse Jobs
                </PrimaryButton>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((application) => (
                  <div
                    key={application.id}
                    className="border border-gray-200 rounded-card p-6 hover:border-primary transition-colors cursor-pointer"
                    onClick={() => navigate(`/jobs/${application.job_id}`)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-dark font-heading mb-1">
                          {application.job?.title}
                        </h3>
                        <p className="text-gray-600 font-body text-sm mb-2">
                          {application.job?.company_name}
                        </p>
                        <p className="text-gray-500 font-body text-sm">
                          {application.job?.location} • {application.job?.job_type} •{' '}
                          {formatSalary(
                            application.job?.salary_min || null,
                            application.job?.salary_max || null,
                            application.job?.salary_currency || 'INR'
                          )}
                        </p>
                      </div>

                      <div
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                          application.status
                        )}`}
                      >
                        {getStatusIcon(application.status)}
                        <span className="capitalize">{application.status}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-gray-500 font-body">
                      <span>Applied {formatDate(application.created_at)}</span>
                      <span>
                        {application.job?.application_count || 0} total applicants
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
