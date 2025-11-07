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
  FileText,
  Link as LinkIcon,
  Eye,
  Edit3,
  Trash2,
  X,
} from 'lucide-react';
import { useJob } from '../../hooks/useJobs';
import { applicationService } from '../../services/applicationService';
import { uploadResume } from '../../services/applicationService';
import { jobService } from '../../services/jobService';
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
  const [phoneNumber, setPhoneNumber] = useState('');
  const [portfolioLink, setPortfolioLink] = useState('');
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [resumeLink, setResumeLink] = useState(profile?.resume_url || '');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedResumeUrl, setUploadedResumeUrl] = useState('');
  const [displayResumeName, setDisplayResumeName] = useState('');
  
  // Edit/Delete states
  const [editingJob, setEditingJob] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (user && profile && job) {
      checkExistingApplication();
    }
  }, [user, profile, job]);

  useEffect(() => {
    // Pre-fill resume link and portfolio from profile if available
    if (profile) {
      setResumeLink(profile.resume_url || '');
      setPortfolioLink(profile.website || '');
    }
  }, [profile]);

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

    // Validate required fields
    if (!resumeLink.trim() && !resumeFile) {
      alert('Please provide your resume link or upload a file.');
      return;
    }

    if (!phoneNumber.trim()) {
      alert('Please provide your phone number');
      return;
    }

    try {
      setApplying(true);

      const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
      if (!cleanPhoneNumber) {
        setApplying(false);
        alert('Please provide a valid phone number');
        return;
      }

      // Handle Resume Upload
      let finalResumeUrl = resumeLink;
      if (resumeFile) {
        try {
          setUploading(true);
          const uploadedUrl = await uploadResume(resumeFile, profile.id);
          finalResumeUrl = uploadedUrl;
        } catch (err) {
          console.error('Resume upload failed:', err);
          alert('Failed to upload resume. Please try again.');
          return;
        } finally {
          setUploading(false);
        }
      }

      // Submit Application 
      await applicationService.createApplication({
        job_id: job.id,
        candidate_id: profile.id,
        cover_letter: coverLetter,
        resume_url: finalResumeUrl,
      });

      setApplicationSuccess(true);
      setHasApplied(true);

      // Reset state after success
      setTimeout(() => {
        setShowApplicationModal(false);
        setApplicationSuccess(false);
        setCoverLetter('');
        setPhoneNumber('');
        setResumeLink(profile.resume_url || '');
        setPortfolioLink(profile.website || '');
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  // Handle Delete Job
  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      return;
    }

    try {
      setIsDeleting(true);
      await jobService.deleteJob(jobId);
      alert('✅ Job deleted successfully!');
      navigate('/employer/dashboard');
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('❌ Failed to delete job. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle Update Job
  const handleUpdateJob = async (jobId: string, updatedData: any) => {
    try {
      await jobService.updateJob(jobId, updatedData);
      alert('✅ Job updated successfully!');
      setEditingJob(null);
      window.location.reload();
    } catch (error) {
      console.error('Error updating job:', error);
      alert('❌ Failed to update job. Please try again.');
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
          className="flex items-center gap-2 text-primary hover:text-primary-600 mb-10 font-body font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Jobs
        </button>

        <GlassCard>
          <div className="p-10">
            {/* Header Section */}
            <div className="flex items-start justify-between mb-10">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-dark font-heading mb-4 leading-tight">
                  {job.title}
                </h1>
                <div className="flex items-center gap-2 text-lg text-gray-700 font-body mb-4">
                  <Building2 className="w-5 h-5 text-primary" />
                  <span className="font-semibold">{job.company_name}</span>
                </div>
              </div>
              {job.is_featured && (
                <div className="bg-gradient-to-r from-accent to-accent-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-md">
                  ⭐ Featured
                </div>
              )}
            </div>

            {/* Job Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 pb-10 border-b border-gray-200">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-primary-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Location
                  </p>
                  <p className="font-bold text-gray-900">{job.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Job Type
                  </p>
                  <p className="font-bold text-gray-900">{job.job_type}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-purple-50 rounded-lg">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Experience
                  </p>
                  <p className="font-bold text-gray-900">{job.experience_level}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-green-50 rounded-lg">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Salary
                  </p>
                  <p className="font-bold text-gray-900 text-sm">
                    {formatSalary(job.salary_min, job.salary_max, job.salary_currency)}
                  </p>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-3 mb-12">
              <span className="px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-semibold border border-primary-200">
                {job.category}
              </span>
              {job.is_remote && (
                <span className="px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-semibold border border-green-200">
                  🌍 Remote
                </span>
              )}
            </div>

            {/* Job Description */}
            <div className="border-t border-gray-200 pt-12 mb-12">
              <h2 className="text-2xl font-bold text-dark font-heading mb-6">
                Job Description
              </h2>
              <div className="prose prose-lg prose-gray max-w-none font-body text-gray-700 leading-relaxed whitespace-pre-wrap">
                {job.description}
              </div>
            </div>

            {/* Footer Section with Stats and Apply Button */}
            <div className="pt-8 border-t-2 border-gray-200">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                {/* Stats Section */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                  <div className="flex items-center gap-3 text-gray-600 font-body">
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg">
                      <Calendar className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">Posted</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatDate(job.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="hidden sm:block w-px h-12 bg-gray-300"></div>

                  <div className="flex items-center gap-3 text-gray-600 font-body">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">Applicants</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {job.application_count} {job.application_count === 1 ? 'person' : 'people'}
                      </p>
                    </div>
                  </div>

                  {job.views_count > 0 && (
                    <>
                      <div className="hidden sm:block w-px h-12 bg-gray-300"></div>
                      
                      <div className="flex items-center gap-3 text-gray-600 font-body">
                        <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg">
                          <Eye className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase">Views</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {job.views_count}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Apply Button - Conditional based on user role */}
                <div className="flex-shrink-0">
                  {profile?.role === "candidate" ? (
                    // Candidate View - Apply Now or Already Applied
                    hasApplied ? (
                      <div className="flex items-center gap-3 px-6 py-3 bg-green-50 text-green-700 rounded-xl font-semibold border-2 border-green-200">
                        <CheckCircle className="w-5 h-5" />
                        <span>Application Submitted</span>
                      </div>
                    ) : (
                      <PrimaryButton onClick={handleApply} size="lg" className="w-full sm:w-auto">
                        Apply Now
                      </PrimaryButton>
                    )
                  ) : profile?.role === "employer" ? (
                    // Employer View - View Applicants Button
                    <PrimaryButton 
                      onClick={() => navigate(`/employer/jobs/${job.id}/applicants`)} 
                      size="lg" 
                      className="w-full sm:w-auto"
                    >
                      <Users className="w-5 h-5 mr-2" />
                      View Applicants ({job.application_count})
                    </PrimaryButton>
                  ) : (
                    // Not logged in - Show login prompt
                    <PrimaryButton onClick={handleApply} size="lg" className="w-full sm:w-auto">
                      Apply Now
                    </PrimaryButton>
                  )}
                </div>
              </div>

              {/* Edit/Delete Buttons for Employer */}
              {profile?.role === "employer" && job.employer_id === profile.id && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setEditingJob({ ...job })}
                      className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 rounded-xl font-semibold border-2 border-amber-200 hover:from-amber-100 hover:to-yellow-100 hover:border-amber-300 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <Edit3 className="w-5 h-5" />
                      <span>Edit Job Details</span>
                    </button>
                    
                    <button
                      onClick={() => handleDeleteJob(job.id)}
                      disabled={isDeleting}
                      className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-red-50 to-rose-50 text-red-700 rounded-xl font-semibold border-2 border-red-200 hover:from-red-100 hover:to-rose-100 hover:border-red-300 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-5 h-5" />
                      <span>{isDeleting ? 'Deleting...' : 'Delete Job'}</span>
                    </button>
                  </div>
                  
                  <p className="text-sm text-gray-500 mt-3 font-body">
                    💡 <span className="font-medium">Tip:</span> You can edit job details or remove this listing if it's no longer available.
                  </p>
                </div>
              )}
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Application Modal */}
      {showApplicationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <GlassCard className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              {applicationSuccess ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-dark font-heading mb-3">
                    Application Submitted!
                  </h2>
                  <p className="text-lg text-gray-600 font-body">
                    Your application has been sent to the employer.
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-dark font-heading mb-2">
                    Apply for {job.title}
                  </h2>
                  <p className="text-gray-600 font-body mb-6">
                    at {job.company_name}
                  </p>

                  <div className="space-y-5 mb-6">
                    {/* Personal Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={profile?.full_name || ''}
                          readOnly
                          className="w-full border-2 border-gray-300 rounded-lg p-3 bg-gray-50 text-gray-700 font-body"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={user?.email || ''}
                          readOnly
                          className="w-full border-2 border-gray-300 rounded-lg p-3 bg-gray-50 text-gray-700 font-body"
                        />
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="Enter your phone number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full border-2 border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-primary font-body transition-all"
                        required
                      />
                    </div>

                    {/* Resume Upload or Link */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Upload or Link Resume <span className="text-red-500">*</span>
                        </div>
                      </label>

                      {/* File upload */}
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={async (e) => {
                          const selectedFile = e.target.files?.[0];
                          if (!selectedFile) return;

                          setResumeFile(selectedFile);
                          setUploading(true);

                          try {
                            const uploadedUrl = await uploadResume(selectedFile, profile.id);

                            if (uploadedUrl) {
                              setUploadedResumeUrl(uploadedUrl);
                              setDisplayResumeName(selectedFile.name);
                              alert("✅ Resume uploaded successfully!");
                            }
                          } catch (error) {
                            console.error("Upload error:", error);
                            alert("❌ Failed to upload resume. Please try again.");
                          } finally {
                            setUploading(false);
                          }
                        }}
                        className="w-full border-2 border-gray-300 rounded-lg p-3 mb-2 focus:ring-2 focus:ring-primary focus:border-primary font-body transition-all"
                      />

                      {/* Upload status */}
                      {uploading && (
                        <p className="text-sm text-gray-500 mb-2 animate-pulse">
                          Uploading resume...
                        </p>
                      )}

                      {/* Show uploaded resume info */}
                      {!uploading && uploadedResumeUrl && (
                        <p className="text-sm text-green-600 mb-2">
                          ✅ Uploaded:{" "}
                          <a
                            href={uploadedResumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline text-primary hover:text-primary-700"
                          >
                            {displayResumeName || "View Resume"}
                          </a>
                        </p>
                      )}

                      <p className="text-xs text-gray-500 mb-2">
                        Upload a PDF/DOCX file (recommended) or paste your Drive/Dropbox link below.
                      </p>

                      {/* Resume link fallback */}
                      <input
                        type="url"
                        placeholder="https://drive.google.com/your-resume"
                        value={resumeLink}
                        onChange={(e) => setResumeLink(e.target.value)}
                        className="w-full border-2 border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-primary font-body transition-all"
                      />
                    </div>

                    {/* Portfolio Link */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <div className="flex items-center gap-2">
                          <LinkIcon className="w-4 h-4" />
                          Portfolio Link <span className="text-gray-400">(Optional)</span>
                        </div>
                      </label>
                      <input
                        type="url"
                        placeholder="https://yourportfolio.com"
                        value={portfolioLink}
                        onChange={(e) => setPortfolioLink(e.target.value)}
                        className="w-full border-2 border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-primary font-body transition-all"
                      />
                      <p className="text-xs text-gray-500 mt-1.5">
                        Add your portfolio, GitHub, LinkedIn, or personal website
                      </p>
                    </div>

                    {/* Cover Letter */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Cover Letter <span className="text-gray-400">(Optional but recommended)</span>
                      </label>
                      <TextArea
                        placeholder="Tell the employer why you're a great fit for this role..."
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        rows={6}
                        className="border-2"
                      />
                    </div>
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

      {/* Edit Job Modal */}
      {editingJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <GlassCard className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <div>
                  <h2 className="text-2xl font-bold text-dark font-heading">Edit Job Details</h2>
                  <p className="text-sm text-gray-600 mt-1">Update your job posting information</p>
                </div>
                <button
                  onClick={() => setEditingJob(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              {/* Edit Form */}
              <div className="space-y-5">
                {/* Job Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingJob.title}
                    onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })}
                    placeholder="e.g. Senior Software Engineer"
                    className="w-full border-2 border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-primary font-body transition-all"
                  />
                </div>

                {/* Job Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Job Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={editingJob.description}
                    onChange={(e) => setEditingJob({ ...editingJob, description: e.target.value })}
                    placeholder="Describe the role, responsibilities, and what you're looking for..."
                    rows={6}
                    className="w-full border-2 border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-primary font-body transition-all resize-none"
                  />
                </div>

                {/* Requirements */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Requirements <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={editingJob.requirements}
                    onChange={(e) => setEditingJob({ ...editingJob, requirements: e.target.value })}
                    placeholder="List the qualifications, skills, and experience needed..."
                    rows={5}
                    className="w-full border-2 border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-primary font-body transition-all resize-none"
                  />
                </div>
                {/* Location */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingJob.location}
                    onChange={(e) => setEditingJob({ ...editingJob, location: e.target.value })}
                    placeholder="e.g. San Francisco, CA or Remote"
                    className="w-full border-2 border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-primary font-body transition-all"
                  />
                </div>

                {/* Salary Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Minimum Salary
                    </label>
                    <input
                      type="number"
                      value={editingJob.salary_min}
                      onChange={(e) => setEditingJob({ ...editingJob, salary_min: parseInt(e.target.value) })}
                      placeholder="50000"
                      className="w-full border-2 border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-primary font-body transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Maximum Salary
                    </label>
                    <input
                      type="number"
                      value={editingJob.salary_max}
                      onChange={(e) => setEditingJob({ ...editingJob, salary_max: parseInt(e.target.value) })}
                      placeholder="80000"
                      className="w-full border-2 border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-primary font-body transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
                <PrimaryButton
                  onClick={() => handleUpdateJob(editingJob.id, editingJob)}
                  className="flex-1"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Save Changes
                </PrimaryButton>
                <PrimaryButton
                  variant="outline"
                  onClick={() => setEditingJob(null)}
                  className="flex-1"
                >
                  Cancel
                </PrimaryButton>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}