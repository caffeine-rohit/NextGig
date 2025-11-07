import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  FileText,
  ExternalLink,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';
import { useJob } from '../../hooks/useJobs';
import { applicationService } from '../../services/applicationService';
import { Application } from '../../types';
import { GlassCard } from '../../components/common/GlassCard';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { formatDate } from '../../utils/formatters';

interface ApplicantsPageProps {
  profile: any;
}

export function ApplicantsPage({ profile }: ApplicantsPageProps) {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { job, loading: jobLoading } = useJob(jobId!);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    if (jobId) {
      fetchApplications();
    }
  }, [jobId]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await applicationService.getJobApplications(jobId!);
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId: string, newStatus: Application['status']) => {
    try {
      await applicationService.updateApplicationStatus(applicationId, newStatus);
      // Refresh applications
      fetchApplications();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update application status');
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

  const filteredApplications = selectedStatus === 'all' 
    ? applications 
    : applications.filter(app => app.status === selectedStatus);

  if (jobLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingSkeleton type="list" />
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Job not found</h1>
          <PrimaryButton onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </PrimaryButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <button
          onClick={() => navigate(`/jobs/${jobId}`)}
          className="flex items-center gap-2 text-primary hover:text-primary-600 mb-8 font-body font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Job Details
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-dark font-heading mb-2">
            Applicants for {job.title}
          </h1>
          <p className="text-lg text-gray-600 font-body">
            {applications.length} {applications.length === 1 ? 'application' : 'applications'} received
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setSelectedStatus('all')}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
              selectedStatus === 'all'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-primary'
            }`}
          >
            All ({applications.length})
          </button>
          <button
            onClick={() => setSelectedStatus('pending')}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
              selectedStatus === 'pending'
                ? 'bg-yellow-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-yellow-600'
            }`}
          >
            Pending ({applications.filter(a => a.status === 'pending').length})
          </button>
          <button
            onClick={() => setSelectedStatus('reviewing')}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
              selectedStatus === 'reviewing'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-600'
            }`}
          >
            Reviewing ({applications.filter(a => a.status === 'reviewing').length})
          </button>
          <button
            onClick={() => setSelectedStatus('shortlisted')}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
              selectedStatus === 'shortlisted'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-green-600'
            }`}
          >
            Shortlisted ({applications.filter(a => a.status === 'shortlisted').length})
          </button>
        </div>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <GlassCard>
            <div className="p-16 text-center">
              <p className="text-lg text-gray-600 font-body">
                No applications found for this filter.
              </p>
            </div>
          </GlassCard>
        ) : (
          <div className="space-y-6">
            {filteredApplications.map((application) => (
              <GlassCard key={application.id}>
                <div className="p-8">
                
                  {/* Applicant Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-start gap-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full">
                        <User className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-dark font-heading mb-1">
                          {application.candidate?.full_name || 'Candidate Name'}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            <span>{application.candidate?.email || 'No email'}</span>
                          </div>
                          {application.candidate?.location && (
                            <span className="text-gray-400">•</span>
                          )}
                          {application.candidate?.location && (
                            <span>{application.candidate.location}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className={`px-4 py-2 rounded-lg border-2 font-semibold text-sm ${getStatusColor(application.status)}`}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </div>
                  </div>

                  {/* Applicant Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 pb-6 border-b border-gray-200">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        Applied {formatDate(application.created_at)}
                      </span>
                    </div>

                    {application.resume_url && (
                      <a
                        href={application.resume_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-primary hover:text-primary-600 font-semibold"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FileText className="w-4 h-4" />
                        <span>View Resume</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}

                    {application.candidate?.website && (
                      <a
                        href={application.candidate.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-primary hover:text-primary-600 font-semibold"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Portfolio</span>
                      </a>
                    )}
                  </div>

                  {/* Cover Letter */}
                  {application.cover_letter && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                        Cover Letter
                      </h4>
                      <p className="text-gray-700 font-body leading-relaxed">
                        {application.cover_letter}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200">
                    {application.status !== 'reviewing' && (
                      <button
                        onClick={() => handleStatusUpdate(application.id, 'reviewing')}
                        className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-semibold text-sm hover:bg-blue-100 transition-colors flex items-center gap-2"
                      >
                        <Clock className="w-4 h-4" />
                        Mark as Reviewing
                      </button>
                    )}
                    {application.status !== 'shortlisted' && (
                      <button
                        onClick={() => handleStatusUpdate(application.id, 'shortlisted')}
                        className="px-4 py-2 bg-green-50 text-green-700 rounded-lg font-semibold text-sm hover:bg-green-100 transition-colors flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Shortlist
                      </button>
                    )}
                    {application.status !== 'rejected' && (
                      <button
                        onClick={() => handleStatusUpdate(application.id, 'rejected')}
                        className="px-4 py-2 bg-red-50 text-red-700 rounded-lg font-semibold text-sm hover:bg-red-100 transition-colors flex items-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    )}
                    {application.status === 'shortlisted' && (
                      <button
                        onClick={() => handleStatusUpdate(application.id, 'accepted')}
                        className="px-4 py-2 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-primary-600 transition-colors flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Accept
                      </button>
                    )}
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}