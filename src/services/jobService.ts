import { supabase } from "../lib/supabase";
import type { Job } from "../types";

export const jobService = {
  //  Create a new job
  async createJob(job: Omit<Job, "id" | "created_at" | "views_count">) {
    // Add system-controlled defaults
    const payload = {
      ...job,
      application_count: (job as any).application_count ?? 0,
      is_featured: (job as any).is_featured ?? false,
      views_count: 0, // we control this, not the input
      status: (job as any).status ?? "active",
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("jobs")
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error("❌ Supabase insert error:", error.message, error.details);
      throw error;
    }

    console.log("✅ Job created successfully:", data);
    return data as Job;
  },

  // Get all jobs (with optional filters)
  async getJobs(filters?: any) {
    let query = supabase
      .from("jobs")
      .select("*")
      .order("created_at", { ascending: false });

    if (filters?.category) query = query.eq("category", filters.category);
    if (filters?.location) query = query.eq("location", filters.location);
    if (filters?.type) query = query.eq("type", filters.type);
    if (filters?.search) {
      query = query.ilike("title", `%${filters.search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as Job[];
  },

  // Get single job by ID
  async getJobById(id: string) {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as Job;
  },

  // Get featured jobs
  async getFeaturedJobs() {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(6);

    if (error) throw error;
    return data as Job[];
  },

  // Get jobs for a specific employer
  async getEmployerJobs(profileId: string) {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("employer_id", profileId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Job[];
  },

  // Update a job
  async updateJob(jobId: string, updatedData: any) {
    const { data, error } = await supabase
      .from("jobs")
      .update(updatedData)
      .eq("id", jobId)
      .select();
    
    if (error) throw error;
    return data;
  },

  // Delete a job
  async deleteJob(jobId: string) {
    const { error } = await supabase
      .from("jobs")
      .delete()
      .eq("id", jobId);
    
    if (error) throw error;
    return true;
  },

  // Increment job view count
  async incrementViewCount(id: string) {
    const { data, error } = await supabase.rpc("increment_job_view", { job_id: id });
    if (error) console.error("Increment view failed:", error);
    return data;
  },
};

const JOBS_KEY = "nextgig_jobs_v1";

export function loadJobs(): Job[] {
  const raw = localStorage.getItem(JOBS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Job[];
  } catch {
    return [];
  }
}

