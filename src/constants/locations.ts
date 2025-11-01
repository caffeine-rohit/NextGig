export const INDIA_LOCATIONS = [
  'Bengaluru',
  'Mumbai',
  'Delhi NCR',
  'Hyderabad',
  'Pune',
  'Chennai',
  'Kolkata',
  'Ahmedabad',
  'Jaipur',
  'Chandigarh',
  'Remote',
] as const;

export const JOB_TYPES = [
  'Full-time',
  'Part-time',
  'Contract',
  'Freelance',
  'Internship',
] as const;

export const EXPERIENCE_LEVELS = [
  'Entry',
  'Mid',
  'Senior',
  'Lead',
  'Executive',
] as const;

export const APPLICATION_STATUS = [
  'pending',
  'reviewing',
  'shortlisted',
  'rejected',
  'accepted',
] as const;

export type Location = typeof INDIA_LOCATIONS[number];
export type JobType = typeof JOB_TYPES[number];
export type ExperienceLevel = typeof EXPERIENCE_LEVELS[number];
export type ApplicationStatus = typeof APPLICATION_STATUS[number];
