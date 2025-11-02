import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Building2,
  Calendar,
  Users,
  ArrowLeft,
  CheckCircle,
} from 'lucide-react';
import { useJob } from '../../hooks/useJobs';
import { applicationService } from '../../services/applicationService';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { TextArea } from '../../components/common/TextArea';
import { GlassCard } from '../../components/common/GlassCard';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { formatSalary, formatDate } from '../../utils/formatters';

interface JobDetailPageProps {
  user: any;
  profile: any;
}

export function JobDetailPage({ user, profile }: JobDetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { job, loading } = useJob(id!);

  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);

  useEffect(() => {
    if (user && profile && job) {
      checkExistingApplication();
    }
  }, [user, profile, job]);

  const checkExistingApplication = async () => {
    if (!job || !profile) return;
    try {
      const exists = await applicationService.checkExistingApplication(
        job.id,
        profile.id
      );
      setHasApplied(exists);
    } catch (error) {
      console.error('Error checking application:', error);
    }
  };

  const handleApply = async () => {
    if (!user) {
      navigate('/auth/login', { state: { from: `/jobs/${id}` } });
      return;
    }

    if (profile?.role !== 'candidate') {
      alert('Only candidates can apply for jobs');
      return;
    }

    setShowApplicationModal(true);
  };

  const submitApplication = async () => {
    if (!profile || !job) return;

    try {
      setApplying(true);
      await applicationService.createApplication({
        job_id: job.id,
        candidate_id: profile.id,
        cover_letter: coverLetter,
        resume_url: profile.resume_url || '',
      });

      setApplicationSuccess(true);
      setHasApplied(true);

      setTimeout(() => {
        setShowApplicationModal(false);
        setApplicationSuccess(false);
        setCoverLetter('');
      }, 2000);
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingSkeleton type="card" />
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Job not found</h1>
          <PrimaryButton onClick={() => navigate('/jobs')}>
            Browse All Jobs
          </PrimaryButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/jobs')}
          className="flex items-center gap-2 text-primary hover:text-primary-600 mb-10 font-body font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Jobs
        </button>

        <GlassCard>
          <div className="p-10">
            <div className="flex items-start justify-between mb-10">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-dark font-heading mb-4">
                  {job.title}
                </h1>
                <div className="flex items-center gap-2 text-lg text-gray-700 font-body">
                  <Building2 className="w-5 h-5" />
                  <span>{job.company_name}</span>
                </div>
              </div>
              {job.is_featured && (
                <div className="bg-accent-100 text-accent-700 px-4 py-2 rounded-full text-sm font-semibold">
                  Featured
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 pb-10 border-b border-gray-200">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Location</p>
                  <p className="font-semibold text-gray-900 mt-1">{job.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <Briefcase className="w-5 h-5 text-primary mt-0.5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Job Type</p>
                  <p className="font-semibold text-gray-900 mt-1">{job.job_type}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <Clock className="w-5 h-5 text-primary mt-0.5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Experience</p>
                  <p className="font-semibold text-gray-900 mt-1">{job.experience_level}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <DollarSign className="w-5 h-5 text-primary mt-0.5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Salary</p>
                  <p className="font-semibold text-gray-900 mt-1">
                    {formatSalary(job.salary_min, job.salary_max, job.salary_currency)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-12">
              <span className="px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-medium">
                {job.category}
              </span>
              {job.is_remote && (
                <span className="px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                  Remote
                </span>
              )}
            </div>

            <div className="border-t border-gray-200 pt-12 mb-12">
              <h2 className="text-2xl font-semibold text-dark font-heading mb-6">
                Job Description
              </h2>
              <div className="prose prose-gray max-w-none font-body text-gray-700 leading-relaxed whitespace-pre-wrap">
                {job.description}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pt-10 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6 text-sm text-gray-500 font-body">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Posted {formatDate(job.created_at)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{job.application_count} applicants</span>
                </div>
              </div>

              {hasApplied ? (
                <div className="flex items-center gap-2 text-green-600 font-semibold">
                  <CheckCircle className="w-5 h-5" />
                  <span>Applied</span>
                </div>
              ) : (
                <PrimaryButton onClick={handleApply} size="lg">
                  Apply Now
                </PrimaryButton>
              )}
            </div>
          </div>
        </GlassCard>
      </div>

      {showApplicationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <GlassCard className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              {applicationSuccess ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-dark font-heading mb-2">
                    Application Submitted!
                  </h2>
                  <p className="text-gray-600 font-body">
                    Your application has been sent to the employer.
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-dark font-heading mb-6">
                    Apply for {job.title}
                  </h2>

                  <div className="mb-6">
                    <TextArea
                      label="Cover Letter (Optional)"
                      placeholder="Tell the employer why you're a great fit for this role..."
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      rows={8}
                    />
                  </div>

                  <div className="flex gap-3">
                    <PrimaryButton
                      onClick={submitApplication}
                      isLoading={applying}
                      disabled={applying}
                      className="flex-1"
                    >
                      Submit Application
                    </PrimaryButton>
                    <PrimaryButton
                      variant="outline"
                      onClick={() => setShowApplicationModal(false)}
                      disabled={applying}
                    >
                      Cancel
                    </PrimaryButton>
                  </div>
                </>
              )}
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
