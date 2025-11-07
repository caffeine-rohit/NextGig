import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jobService } from "../../services/jobService";

export default function CreateJob() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "", company: "", location: "", type: "Full-time", experience: "", salary: "", description: ""
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.company) {
      setErr("Please add job title and company");
      return;
    }
    setErr(null);
    setSaving(true);
    try {
      const created = await jobService.createJob(form as any);
      navigate(`/jobs/${created.id}`);
    } catch (e: any) {
      setErr(e.message || "Failed to post");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-[12px] shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
      <h2 className="text-2xl font-semibold mb-4">Post a new opportunity</h2>
      {err && <p className="text-red-600 mb-2">{err}</p>}
      <form onSubmit={onSubmit} className="space-y-4">
        <input name="title" value={form.title} onChange={onChange} placeholder="Job title (e.g. Senior React Developer)" className="w-full p-3 rounded-[8px] border" />
        <input name="company" value={form.company} onChange={onChange} placeholder="Company name" className="w-full p-3 rounded-[8px] border" />
        <input name="location" value={form.location} onChange={onChange} placeholder="Location (City, Country)" className="w-full p-3 rounded-[8px] border" />
        <input name="experience" value={form.experience} onChange={onChange} placeholder="Experience (e.g. 2-4 years)" className="w-full p-3 rounded-[8px] border" />
        <input name="salary" value={form.salary} onChange={onChange} placeholder="Salary range" className="w-full p-3 rounded-[8px] border" />
        <textarea name="description" value={form.description} onChange={onChange} placeholder="Job description" className="w-full p-3 rounded-[8px] border" rows={6} />
        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving} className="px-4 py-2 rounded-[8px] font-medium bg-primary text-white">
            {saving ? "Posting..." : "Post opportunity"}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 rounded-[8px] border">Cancel</button>
        </div>
      </form>
    </div>
  );
}
