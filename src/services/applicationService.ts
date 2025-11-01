import { supabase } from '../lib/supabase';
import { Application } from '../types';

export const applicationService = {
  async createApplication(applicationData: {
    job_id: string;
    candidate_id: string;
    cover_letter?: string;
    resume_url: string;
  }) {
    const { data, error } = await supabase
      .from('applications')
      .insert(applicationData)
      .select()
      .single();

    if (error) throw error;
    return data as Application;
  },

  async getCandidateApplications(candidateId: string) {
    const { data, error } = await supabase
      .from('applications')
      .select('*, job:jobs(*, employer:profiles!jobs_employer_id_fkey(*))')
      .eq('candidate_id', candidateId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Application[];
  },

  async getJobApplications(jobId: string) {
    const { data, error } = await supabase
      .from('applications')
      .select('*, candidate:profiles!applications_candidate_id_fkey(*)')
      .eq('job_id', jobId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Application[];
  },

  async getApplicationById(id: string) {
    const { data, error } = await supabase
      .from('applications')
      .select('*, job:jobs(*), candidate:profiles!applications_candidate_id_fkey(*)')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data as Application | null;
  },

  async updateApplicationStatus(id: string, status: Application['status']) {
    const { data, error } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Application;
  },

  async checkExistingApplication(jobId: string, candidateId: string) {
    const { data, error } = await supabase
      .from('applications')
      .select('id')
      .eq('job_id', jobId)
      .eq('candidate_id', candidateId)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  },
};
