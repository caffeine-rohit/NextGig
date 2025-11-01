/*
  # Job Board Platform Database Schema

  ## Overview
  Complete database schema for a job board platform with profiles, job listings, and applications.

  ## New Tables
  
  ### `profiles`
  User profile information extending Supabase auth.users
  - `id` (uuid, primary key) - References auth.users
  - `email` (text) - User email address
  - `full_name` (text) - User's full name
  - `role` (text) - Either 'candidate' or 'employer'
  - `company_name` (text, nullable) - For employer profiles
  - `location` (text, nullable) - User location
  - `bio` (text, nullable) - User bio/description
  - `avatar_url` (text, nullable) - Profile picture URL
  - `resume_url` (text, nullable) - Resume URL for candidates
  - `website` (text, nullable) - Company website for employers
  - `created_at` (timestamptz) - Profile creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `jobs`
  Job listings posted by employers
  - `id` (uuid, primary key) - Auto-generated job ID
  - `employer_id` (uuid) - References profiles(id)
  - `title` (text) - Job title
  - `company_name` (text) - Company name
  - `description` (text) - Full job description
  - `category` (text) - Job category (Engineering, Design, Marketing, etc.)
  - `location` (text) - Job location
  - `job_type` (text) - Full-time, Part-time, Contract, etc.
  - `experience_level` (text) - Entry, Mid, Senior, Lead
  - `salary_min` (integer, nullable) - Minimum salary
  - `salary_max` (integer, nullable) - Maximum salary
  - `salary_currency` (text) - Currency code (INR, USD, etc.)
  - `is_remote` (boolean) - Remote work option
  - `is_featured` (boolean) - Featured listing flag
  - `status` (text) - active, closed, draft
  - `application_count` (integer) - Number of applications
  - `views_count` (integer) - Number of views
  - `created_at` (timestamptz) - Job posting timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `applications`
  Job applications submitted by candidates
  - `id` (uuid, primary key) - Auto-generated application ID
  - `job_id` (uuid) - References jobs(id)
  - `candidate_id` (uuid) - References profiles(id)
  - `status` (text) - pending, reviewing, shortlisted, rejected, accepted
  - `cover_letter` (text, nullable) - Application cover letter
  - `resume_url` (text) - Resume URL for this application
  - `created_at` (timestamptz) - Application submission timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - RLS enabled on all tables
  - Profiles: Users can view all, but only update their own
  - Jobs: Anyone can view active jobs, only employers can create/update their own
  - Applications: Candidates can view their own, employers can view applications for their jobs

  ## Important Notes
  1. Application count is automatically updated via trigger
  2. All timestamps use timezone-aware timestamps
  3. Status fields use predefined values for consistency
  4. Foreign key constraints ensure referential integrity
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('candidate', 'employer')),
  company_name text,
  location text,
  bio text,
  avatar_url text,
  resume_url text,
  website text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  company_name text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  location text NOT NULL,
  job_type text NOT NULL CHECK (job_type IN ('Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship')),
  experience_level text NOT NULL CHECK (experience_level IN ('Entry', 'Mid', 'Senior', 'Lead', 'Executive')),
  salary_min integer,
  salary_max integer,
  salary_currency text DEFAULT 'INR',
  is_remote boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  status text DEFAULT 'active' CHECK (status IN ('active', 'closed', 'draft')),
  application_count integer DEFAULT 0,
  views_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  candidate_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'shortlisted', 'rejected', 'accepted')),
  cover_letter text,
  resume_url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(job_id, candidate_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_jobs_employer_id ON jobs(employer_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_category ON jobs(category);
CREATE INDEX IF NOT EXISTS idx_jobs_is_featured ON jobs(is_featured);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_candidate_id ON applications(candidate_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);

-- Function to update application count
CREATE OR REPLACE FUNCTION update_job_application_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE jobs SET application_count = application_count + 1 WHERE id = NEW.job_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE jobs SET application_count = application_count - 1 WHERE id = OLD.job_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update application count
DROP TRIGGER IF EXISTS trigger_update_application_count ON applications;
CREATE TRIGGER trigger_update_application_count
AFTER INSERT OR DELETE ON applications
FOR EACH ROW EXECUTE FUNCTION update_job_application_count();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at on all tables
DROP TRIGGER IF EXISTS trigger_profiles_updated_at ON profiles;
CREATE TRIGGER trigger_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trigger_jobs_updated_at ON jobs;
CREATE TRIGGER trigger_jobs_updated_at
BEFORE UPDATE ON jobs
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trigger_applications_updated_at ON applications;
CREATE TRIGGER trigger_applications_updated_at
BEFORE UPDATE ON applications
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles table
CREATE POLICY "Anyone can view profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for jobs table
CREATE POLICY "Anyone can view active jobs"
  ON jobs FOR SELECT
  TO authenticated
  USING (status = 'active');

CREATE POLICY "Employers can view all their jobs"
  ON jobs FOR SELECT
  TO authenticated
  USING (employer_id = auth.uid());

CREATE POLICY "Employers can insert jobs"
  ON jobs FOR INSERT
  TO authenticated
  WITH CHECK (employer_id = auth.uid());

CREATE POLICY "Employers can update their own jobs"
  ON jobs FOR UPDATE
  TO authenticated
  USING (employer_id = auth.uid())
  WITH CHECK (employer_id = auth.uid());

CREATE POLICY "Employers can delete their own jobs"
  ON jobs FOR DELETE
  TO authenticated
  USING (employer_id = auth.uid());

-- RLS Policies for applications table
CREATE POLICY "Candidates can view their own applications"
  ON applications FOR SELECT
  TO authenticated
  USING (candidate_id = auth.uid());

CREATE POLICY "Employers can view applications for their jobs"
  ON applications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = applications.job_id
      AND jobs.employer_id = auth.uid()
    )
  );

CREATE POLICY "Candidates can insert applications"
  ON applications FOR INSERT
  TO authenticated
  WITH CHECK (candidate_id = auth.uid());

CREATE POLICY "Candidates can update their own applications"
  ON applications FOR UPDATE
  TO authenticated
  USING (candidate_id = auth.uid())
  WITH CHECK (candidate_id = auth.uid());

CREATE POLICY "Employers can update applications for their jobs"
  ON applications FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = applications.job_id
      AND jobs.employer_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = applications.job_id
      AND jobs.employer_id = auth.uid()
    )
  );
