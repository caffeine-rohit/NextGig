import { supabase } from '../lib/supabase';
import { Job, JobFilters } from '../types';

export const jobService = {
  async getJobs(filters?: JobFilters) {
    let query = supabase
      .from('jobs')
      .select('*, employer:profiles!jobs_employer_id_fkey(*)')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,company_name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }

    if (filters?.location) {
      query = query.eq('location', filters.location);
    }

    if (filters?.job_type) {
      query = query.eq('job_type', filters.job_type);
    }

    if (filters?.experience_level) {
      query = query.eq('experience_level', filters.experience_level);
    }

    if (filters?.is_remote !== undefined) {
      query = query.eq('is_remote', filters.is_remote);
    }

    if (filters?.salary_min) {
      query = query.gte('salary_max', filters.salary_min);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data as Job[];
  },

  async getFeaturedJobs() {
    const { data, error } = await supabase
      .from('jobs')
      .select('*, employer:profiles!jobs_employer_id_fkey(*)')
      .eq('status', 'active')
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(6);

    if (error) throw error;
    return data as Job[];
  },

  async getJobById(id: string) {
    const { data, error } = await supabase
      .from('jobs')
      .select('*, employer:profiles!jobs_employer_id_fkey(*)')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data as Job | null;
  },

  async createJob(jobData: Partial<Job>) {
    const { data, error } = await supabase
      .from('jobs')
      .insert(jobData)
      .select()
      .single();

    if (error) throw error;
    return data as Job;
  },

  async updateJob(id: string, updates: Partial<Job>) {
    const { data, error } = await supabase
      .from('jobs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Job;
  },

  async deleteJob(id: string) {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getEmployerJobs(employerId: string) {
    const { data, error } = await supabase
      .from('jobs')
      .select('*, employer:profiles!jobs_employer_id_fkey(*)')
      .eq('employer_id', employerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Job[];
  },

  async incrementViewCount(id: string) {
    const { error } = await supabase.rpc('increment', {
      row_id: id,
      x: 1,
      table_name: 'jobs',
      column_name: 'views_count'
    });

    if (error) console.error('Failed to increment view count:', error);
  },
};
