import { supabase } from "../lib/supabase";
import { Application, Job, Profile } from "../types";
import { sendEmailNotification } from "../utils/emailService";

//smooth UI
const sleep = (ms = 300) => new Promise((res) => setTimeout(res, ms));

export const applicationService = {
  // Create a new job application
  async createApplication(applicationData: {
    job_id: string;
    candidate_id: string;
    cover_letter?: string;
    resume_url: string;
  }) {
    console.log("🟢 Creating application with data:", JSON.stringify(applicationData, null, 2));

    // Insert into Supabase
    const { data, error } = await supabase
      .from("applications")
      .insert([
        {
          job_id: applicationData.job_id,
          candidate_id: applicationData.candidate_id,
          cover_letter: applicationData.cover_letter || "",
          resume_url: applicationData.resume_url,
          status: "pending",
        },
      ])
      .select();

    if (error) {
      console.error("❌ Error creating application:", error);
      throw error;
    }

    //Increment job application count
    const { data: jobData, error: fetchError } = await supabase
      .from("jobs")
      .select("application_count")
      .eq("id", applicationData.job_id)
      .single();

    if (!fetchError && jobData) {
      const newCount = (jobData.application_count || 0) + 1;
      await supabase
        .from("jobs")
        .update({ application_count: newCount })
        .eq("id", applicationData.job_id);
    }

    await sleep(300);
    console.log("✅ Application saved to Supabase:", data);
    return data?.[0];
  },

 // Fetch all applications of a candidate
async getCandidateApplications(candidateId: string) {
  const { data, error } = await supabase
    .from("applications")
    .select(`
      *,
      job:jobs!applications_job_id_fkey(*)
    `)
    .eq("candidate_id", candidateId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ Error fetching candidate applications:", error);
    return [];
  }

  console.log("✅ Candidate applications with job info:", data);
  return data as (Application & { job: Job })[];
},

// Fetch all applicants for a specific job
async getJobApplications(jobId: string) {
  const { data, error } = await supabase
    .from("applications")
    .select(`
      *,
      candidate:profiles!applications_candidate_id_fkey(*)
    `)
    .eq("job_id", jobId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ Error fetching job applications:", error);
    return [];
  }

  console.log("✅ Applications fetched with profiles:", data);

  return data as (Application & { candidate: Profile })[];
},

  // Check if candidate already applied for the job
  async checkExistingApplication(jobId: string, candidateId: string) {
    const { data, error } = await supabase
      .from("applications")
      .select("id")
      .eq("job_id", jobId)
      .eq("candidate_id", candidateId)
      .maybeSingle();

    if (error && error.code !== "PGRST116") {
      console.error("❌ Error checking existing application:", error);
      throw error;
    }

    return !!data;
  },

  // Update application status
  async updateApplicationStatus(applicationId: string, newStatus: string) {
    const { data, error } = await supabase
      .from("applications")
      .update({ status: newStatus })
      .eq("id", applicationId)
      .select("*, candidate_id, job_id") // for fetching related data
      .single();

    if (error) {
      console.error("❌ Error updating application status:", error);
      throw error;
    }

    // Fetch candidate email and job title for notification
    const [candidateRes, jobRes] = await Promise.all([
      supabase.from("profiles").select("email, full_name").eq("id", data.candidate_id).single(),
      supabase.from("jobs").select("title").eq("id", data.job_id).single(),
    ]);

    const candidateEmail = candidateRes.data?.email;
    const candidateName = candidateRes.data?.full_name;
    const jobTitle = jobRes.data?.title;

    // Testing 
    console.log("📨 Sending email to:", candidateEmail);
    
    if (candidateEmail) {
      await sendEmailNotification({
        to: candidateEmail,
        subject: `Your application status for ${jobTitle} has been updated`,
        message: `
          <p>Hi ${candidateName || "Candidate"},</p>
          <p>Your job application for <strong>${jobTitle}</strong> is now marked as: 
          <strong style="color:#007BFF">${newStatus}</strong>.</p>
          <p>Login to your dashboard to view more details.</p>
          <p>— <b>NextGig</b> Team</p>
        `,
      });
    }

    return data;
  },
};

// Resume Upload Function 
export async function uploadResume(file: File, candidateId: string) {
  const fileExt = file.name.split(".").pop();
  const fileName = `${candidateId}_${Date.now()}.${fileExt}`;
  const filePath = `resumes/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("resumes")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (uploadError) throw uploadError;

  const { data: publicUrlData } = supabase.storage
    .from("resumes")
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}

// Direct helper for quick job application
export async function applyToJob(
  jobId: string,
  candidateId: string,
  resumeUrl: string,
  coverLetter: string
) {
  const { data, error } = await supabase
    .from("applications")
    .insert([
      {
        job_id: jobId,
        candidate_id: candidateId,
        resume_url: resumeUrl,
        cover_letter: coverLetter,
        status: "pending",
        created_at: new Date(),
      },
    ])
    .select();

  if (error) throw error;

    // Send notification email to candidate
  const candidateProfile = await supabase
    .from("profiles")
    .select("email, full_name")
    .eq("id", candidateId)
    .single();

  const job = await supabase
    .from("jobs")
    .select("title")
    .eq("id", jobId)
    .single();

  if (candidateProfile.data && job.data) {
    await sendEmailNotification({
      to: candidateProfile.data.email,
      subject: `Application Submitted for ${job.data.title}`,
      message: `
        <p>Hi ${candidateProfile.data.full_name || "Candidate"},</p>
        <p>✅ Your application for <strong>${job.data.title}</strong> was successfully submitted.</p>
        <p>We'll notify you when the employer reviews your profile.</p>
        <p>— Team NextGig </p>
      `,
    });
  }

  return data;
}


