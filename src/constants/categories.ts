export const JOB_CATEGORIES = [
  'Engineering',
  'Product',
  'Design',
  'Marketing',
  'Sales',
  'Customer Success',
  'Data Science',
  'Finance',
  'Operations',
  'Human Resources',
  'Legal',
  'Other'
] as const;

export type JobCategory = typeof JOB_CATEGORIES[number];
