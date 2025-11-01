import { JobCategory } from '../constants/categories';
import { Location, JobType, ExperienceLevel, ApplicationStatus } from '../constants/locations';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: 'candidate' | 'employer';
  company_name?: string;
  location?: string;
  bio?: string;
  avatar_url?: string;
  resume_url?: string;
  website?: string;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  employer_id: string;
  title: string;
  company_name: string;
  description: string;
  category: JobCategory;
  location: string;
  job_type: JobType;
  experience_level: ExperienceLevel;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string;
  is_remote: boolean;
  is_featured: boolean;
  status: 'active' | 'closed' | 'draft';
  application_count: number;
  views_count: number;
  created_at: string;
  updated_at: string;
  employer?: Profile;
}

export interface Application {
  id: string;
  job_id: string;
  candidate_id: string;
  status: ApplicationStatus;
  cover_letter?: string;
  resume_url: string;
  created_at: string;
  updated_at: string;
  job?: Job;
  candidate?: Profile;
}

export interface JobFilters {
  search?: string;
  category?: string;
  location?: string;
  job_type?: string;
  experience_level?: string;
  is_remote?: boolean;
  salary_min?: number;
  salary_max?: number;
}
