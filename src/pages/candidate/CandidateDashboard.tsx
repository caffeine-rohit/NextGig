import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  Clock, 
  CheckCircle, 
  XCircle, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Building2,
  TrendingUp,
  FileText,
  ExternalLink
} from 'lucide-react';
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
      console.log('Fetched applications:', data);
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
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'reviewing':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'shortlisted':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'accepted':
        return 'bg-primary-50 text-primary-700 border-primary-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'reviewing':
        return <TrendingUp className="w-4 h-4" />;
      case 'shortlisted':
      case 'accepted':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Briefcase className="w-4 h-4" />;
    }
  };

  const pendingCount = applications.filter((app) => app.status === 'pending').length;
  const reviewingCount = applications.filter((app) => app.status === 'reviewing').length;
  const shortlistedCount = applications.filter((app) => app.status === 'shortlisted').length;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-dark font-heading mb-3">
            My Applications
          </h1>
          <p className="text-lg text-gray-600 font-body">
            Track the status of your job applications
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <GlassCard>
            <div className="p-8">
              <div className="flex items-center justify-between mb-4">
                <Clock className="w-10 h-10 text-yellow-500" />
                <span className="text-4xl font-bold text-dark font-heading">
                  {pendingCount}
                </span>
              </div>
              <p className="text-lg text-gray-600 font-body">Pending Review</p>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="p-8">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-10 h-10 text-blue-500" />
                <span className="text-4xl font-bold text-dark font-heading">
                  {reviewingCount}
                </span>
              </div>
              <p className="text-lg text-gray-600 font-body">Under Review</p>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="p-8">
              <div className="flex items-center justify-between mb-4">
                <CheckCircle className="w-10 h-10 text-green-500" />
                <span className="text-4xl font-bold text-dark font-heading">
                  {shortlistedCount}
                </span>
              </div>
              <p className="text-lg text-gray-600 font-body">Shortlisted</p>
            </div>
          </GlassCard>
        </div>

        {/* Applications List */}
        <GlassCard>
          <div className="p-10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-semibold text-dark font-heading">
                All Applications
              </h2>
              <span className="text-sm text-gray-500 font-body">
                {applications.length} {applications.length === 1 ? 'application' : 'applications'}
              </span>
            </div>

            {loading ? (
              <LoadingSkeleton type="list" />
            ) : applications.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <Briefcase className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-lg text-gray-600 font-body mb-6">
                  You haven't applied to any jobs yet
                </p>
                <PrimaryButton onClick={() => navigate('/jobs')}>
                  Browse Jobs
                </PrimaryButton>
              </div>
            ) : (
              <div className="space-y-6">
                {applications.map((application) => {
                  const job = application.job;
                  
                  return (
                    <div
                      key={application.id}
                      className="border-2 border-gray-200 rounded-xl p-6 hover:border-primary transition-all duration-200 cursor-pointer hover:shadow-lg bg-white"
                      onClick={() => navigate(`/jobs/${application.job_id}`)}
                    >
                      {/* Header Section */}
                      <div className="flex items-start justify-between mb-5">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-dark font-heading mb-2 hover:text-primary transition-colors">
                            {job?.title || 'Job Title Not Available'}
                          </h3>
                          <div className="flex items-center gap-2 text-gray-700 font-body mb-1">
                            <Building2 className="w-5 h-5 text-primary" />
                            <span className="font-semibold text-lg">
                              {job?.company_name || 'Company Not Available'}
                            </span>
                          </div>
                          {job?.category && (
                            <span className="inline-block mt-2 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-semibold">
                              {job.category}
                            </span>
                          )}
                        </div>

                        <div
                          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border-2 ${getStatusColor(
                            application.status
                          )}`}
                        >
                          {getStatusIcon(application.status)}
                          <span className="capitalize">{application.status}</span>
                        </div>
                      </div>

                      {/* Job Details Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5 pb-5 border-b border-gray-200">
                        <div className="flex items-center gap-3 text-sm text-gray-600 font-body">
                          <div className="flex items-center justify-center w-8 h-8 bg-primary-50 rounded-lg">
                            <MapPin className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Location</p>
                            <p className="font-semibold text-gray-900">
                              {job?.location || 'Not specified'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-sm text-gray-600 font-body">
                          <div className="flex items-center justify-center w-8 h-8 bg-blue-50 rounded-lg">
                            <Briefcase className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Type & Level</p>
                            <p className="font-semibold text-gray-900">
                              {job?.job_type || 'N/A'} • {job?.experience_level || 'N/A'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-sm text-gray-600 font-body">
                          <div className="flex items-center justify-center w-8 h-8 bg-green-50 rounded-lg">
                            <DollarSign className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Salary</p>
                            <p className="font-semibold text-gray-900">
                              {job?.salary_min && job?.salary_max
                                ? formatSalary(job.salary_min, job.salary_max, job.salary_currency || 'INR')
                                : 'Not disclosed'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Application Metadata */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
                        <div className="flex items-center gap-2 text-sm text-gray-600 font-body">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>Applied on {formatDate(application.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          {job?.application_count !== undefined && (
                            <span className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              {job.application_count} total applicants
                            </span>
                          )}
                          {job?.is_remote && (
                            <span className="px-2 py-1 bg-green-50 text-green-700 rounded-full font-medium">
                              Remote
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Cover Letter Preview */}
                      {application.cover_letter && (
                        <div className="mt-5 pt-5 border-t border-gray-200 bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="w-4 h-4 text-primary" />
                            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                              Your Cover Letter
                            </p>
                          </div>
                          <p className="text-sm text-gray-700 font-body leading-relaxed line-clamp-3">
                            {application.cover_letter}
                          </p>
                        </div>
                      )}

                      {/* View Details Link */}
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <button
                          className="flex items-center gap-2 text-primary hover:text-primary-600 font-semibold text-sm transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/jobs/${application.job_id}`);
                          }}
                        >
                          <span>View Job Details</span>
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
