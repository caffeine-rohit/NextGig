import { MapPin, Briefcase, Clock, DollarSign, Building2 } from 'lucide-react';
import { Job } from '../../types';
import { formatSalary, formatDate } from '../../utils/formatters';
import { GlassCard } from '../common/GlassCard';
import { useNavigate } from 'react-router-dom';

interface OpportunityCardProps {
  job: Job;
}

export function OpportunityCard({ job }: OpportunityCardProps) {
  const navigate = useNavigate();

  return (
    <GlassCard hover onClick={() => navigate(`/jobs/${job.id}`)}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-dark font-heading mb-2">
              {job.title}
            </h3>
            <div className="flex items-center gap-2 text-gray-600 font-body">
              <Building2 className="w-4 h-4" />
              <span>{job.company_name}</span>
            </div>
          </div>
          {job.is_featured && (
            <div className="bg-accent-100 text-accent-700 px-3 py-1 rounded-full text-xs font-semibold">
              Featured
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3 mb-5 text-sm text-gray-600 font-body">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Briefcase className="w-4 h-4" />
            <span>{job.job_type}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{job.experience_level}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center gap-1.5 text-primary font-semibold font-body">
            <DollarSign className="w-5 h-5" />
            <span>{formatSalary(job.salary_min, job.salary_max, job.salary_currency)}</span>
          </div>
          <span className="text-sm text-gray-500 font-body">
            {formatDate(job.created_at)}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium">
            {job.category}
          </span>
          {job.is_remote && (
            <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
              Remote
            </span>
          )}
        </div>
      </div>
    </GlassCard>
  );
}
