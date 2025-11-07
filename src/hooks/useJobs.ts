import { useState, useEffect } from 'react';
import { jobService } from '../services/jobService';
import { Job, JobFilters } from '../types';
import { supabase } from '../lib/supabase';

export function useJobs(initialFilters?: JobFilters) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<JobFilters>(initialFilters || {});

  useEffect(() => {
    fetchJobs();

    // Real-time updates — ("jobs" table)
    const channel = supabase
      .channel('jobs-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'jobs' },
        (payload) => {
          console.log('🟢 Job change detected:', payload);
          fetchJobs(); // re-fetch automatically
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [filters]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await jobService.getJobs(filters);
      setJobs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch jobs');
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (newFilters: JobFilters) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
  };

  return {
    jobs,
    loading,
    error,
    filters,
    updateFilters,
    clearFilters,
    refetch: fetchJobs,
  };
}

// real time for Featured Jobs
export function useFeaturedJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFeaturedJobs();

    const channel = supabase
      .channel('featured-jobs-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'jobs' },
        (payload: any) => {
          const isFeaturedNew = payload?.new && payload.new.featured === true;
          const isFeaturedOld = payload?.old && payload.old.featured === true;

          if (isFeaturedNew || isFeaturedOld) {
            console.log('🟢 Featured jobs change detected');
            fetchFeaturedJobs();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchFeaturedJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await jobService.getFeaturedJobs();
      setJobs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch featured jobs');
      console.error('Error fetching featured jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  return { jobs, loading, error, refetch: fetchFeaturedJobs };
}

export function useJob(id: string) {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchJob();
    }
  }, [id]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await jobService.getJobById(id);
      setJob(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch job');
      console.error('Error fetching job:', err);
    } finally {
      setLoading(false);
    }
  };

  return { job, loading, error, refetch: fetchJob };
}
