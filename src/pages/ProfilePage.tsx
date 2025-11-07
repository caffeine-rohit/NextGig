import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { GlassCard } from "../components/common/GlassCard";
import { PrimaryButton } from "../components/common/PrimaryButton";
import { LoadingSkeleton } from "../components/common/LoadingSkeleton";
import { Upload, Save, User, Mail, Building2, FileText, GraduationCap, Briefcase } from "lucide-react";

export function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth/login");
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("❌ Error loading profile:", error);
    } else {
      setProfile(data);
    }

    setLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setProfile((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    setUploading(true);

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${profile.id}/${fileName}`;

    // Upload file to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error("❌ Error uploading avatar:", uploadError);
      alert("Failed to upload avatar. Please try again.");
      setUploading(false);
      return;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    // Update profile state with new avatar URL
    setProfile((prev: any) => ({ ...prev, avatar_url: publicUrl }));

    // Save to database immediately
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
      .eq("id", profile.id);

    if (updateError) {
      console.error("❌ Error saving avatar URL:", updateError);
      alert("Avatar uploaded but failed to save. Please click Save Changes.");
    } else {
      alert("✅ Avatar uploaded successfully!");
    }

    setUploading(false);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    setUploading(true);

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${profile.id}/${fileName}`;

    // Upload file to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from("logos")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error("❌ Error uploading logo:", uploadError);
      console.error("Upload error details:", uploadError.message);
      alert(`Failed to upload logo: ${uploadError.message}`);
      setUploading(false);
      return;
    }

    // Get public URL - Fixed syntax
    const { data: { publicUrl } } = supabase.storage
      .from("logos")
      .getPublicUrl(filePath);

    // Update profile state with new logo URL
    setProfile((prev: any) => ({ ...prev, logo_url: publicUrl }));

    // Save to database immediately
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ logo_url: publicUrl, updated_at: new Date().toISOString() })
      .eq("id", profile.id);

    if (updateError) {
      console.error("❌ Error saving logo URL:", updateError);
      alert("Logo uploaded but failed to save. Please click Save Changes.");
    } else {
      alert("✅ Logo uploaded successfully!");
    }

    setUploading(false);
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);

    const updates = {
      full_name: profile.full_name || "",
      bio: profile.bio || "",
      skills: profile.skills || "",
      education: profile.education || "",
      resume_url: profile.resume_url || "",
      company_name: profile.company_name || "",
      avatar_url: profile.avatar_url || "",
      logo_url: profile.logo_url || "",
    };

    console.log("🧩 Sending profile updates:", updates);
    console.log("🧩 Profile ID:", profile.id);
    console.log("🧩 Sending updates to Supabase:", JSON.stringify(updates, null, 2));
    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", profile.id);

    if (error) {
      console.error("❌ Error saving profile:", error);
      alert("Failed to save profile. Please try again.");
    } else {
      alert("✅ Profile updated successfully!");
      // Refresh profile data to get latest from database
      await fetchProfile();
    }

    setSaving(false);
  };

  if (loading) return <LoadingSkeleton />;

  if (!profile)
    return (
      <GlassCard className="text-center text-gray-600">
        <p>No profile found.</p>
      </GlassCard>
    );

  const isCandidate = profile.role === "candidate";
  const isEmployer = profile.role === "employer";

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4 pb-10">
      <GlassCard className="p-6 space-y-6">
        <h1 className="text-3xl font-bold text-dark flex items-center gap-2">
          <User className="w-6 h-6" /> Profile
        </h1>

        <div className="flex flex-col gap-4">
          {/* Avatar Upload */}
          <div className="flex items-center gap-4">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="avatar"
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center">
                <User className="w-8 h-8 text-gray-600" />
              </div>
            )}
            <label className="cursor-pointer text-sm text-primary flex items-center gap-2 hover:text-primary/80 transition-colors">
              <Upload className="w-4 h-4" /> 
              {uploading ? "Uploading..." : "Upload Avatar"}
              <input 
                type="file" 
                accept="image/*" 
                hidden 
                onChange={handleAvatarUpload}
                disabled={uploading}
              />
            </label>
          </div>

          {/* Common Fields */}
          <InputField
            label="Full Name"
            value={profile.full_name || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("full_name", e.target.value)}
            icon={<User className="w-4 h-4" />}
          />

          <InputField
            label="Email (read-only)"
            value={profile.email || ""}
            readOnly
            icon={<Mail className="w-4 h-4" />}
          />

          <TextAreaField
            label="Bio"
            value={profile.bio || ""}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange("bio", e.target.value)}
            icon={<FileText className="w-4 h-4" />}
            placeholder="Tell us about yourself..."
          />

          {/* Candidate-Specific */}
          {isCandidate && (
            <>
              <InputField
                label="Skills (comma-separated)"
                value={profile.skills || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("skills", e.target.value)}
                icon={<Briefcase className="w-4 h-4" />}
                placeholder="React, Node.js, Python, etc."
              />
              <InputField
                label="Education"
                value={profile.education || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("education", e.target.value)}
                icon={<GraduationCap className="w-4 h-4" />}
                placeholder="Bachelor's in Computer Science"
              />
              <InputField
                label="Resume URL"
                value={profile.resume_url || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("resume_url", e.target.value)}
                icon={<FileText className="w-4 h-4" />}
                placeholder="https://example.com/resume.pdf"
              />
            </>
          )}

          {/* Employer-Specific */}
          {isEmployer && (
            <>
              <InputField
                label="Company Name"
                value={profile.company_name || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("company_name", e.target.value)}
                icon={<Building2 className="w-4 h-4" />}
                placeholder="Your Company Inc."
              />
              <div className="flex items-center gap-4">
                {profile.logo_url ? (
                  <img
                    src={profile.logo_url}
                    alt="company logo"
                    className="w-16 h-16 rounded-lg object-contain bg-white p-1 border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-gray-500" />
                  </div>
                )}
                <label className="cursor-pointer text-sm text-primary flex items-center gap-2 hover:text-primary/80 transition-colors">
                  <Upload className="w-4 h-4" /> 
                  {uploading ? "Uploading..." : "Upload Logo"}
                  <input 
                    type="file" 
                    accept="image/*" 
                    hidden 
                    onChange={handleLogoUpload}
                    disabled={uploading}
                  />
                </label>
              </div>
            </>
          )}

          <PrimaryButton
            onClick={handleSave}
            disabled={saving || uploading}
            className="w-full mt-4 flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Changes"}
          </PrimaryButton>
        </div>
      </GlassCard>
    </div>
  );
}

// Input Field Component
interface InputFieldProps {
  label: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
  icon?: React.ReactNode;
  placeholder?: string;
}

function InputField({ label, value, onChange, readOnly = false, icon, placeholder }: InputFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-2 bg-white/50 focus-within:ring-2 ring-primary transition-all">
        {icon && <span className="text-gray-500">{icon}</span>}
        <input
          type="text"
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none text-gray-900 placeholder-gray-400"
        />
      </div>
    </div>
  );
}

// TextArea Field Component
interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  icon?: React.ReactNode;
  placeholder?: string;
}

function TextAreaField({ label, value, onChange, icon, placeholder }: TextAreaFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex items-start gap-2 border border-gray-300 rounded-lg p-2 bg-white/50 focus-within:ring-2 ring-primary transition-all">
        {icon && <span className="text-gray-500 mt-1">{icon}</span>}
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={4}
          className="w-full bg-transparent outline-none text-gray-900 placeholder-gray-400 resize-none"
        />
      </div>
    </div>
  );
}