// src/services/authService.ts
import { supabase } from "../lib/supabase";
import type { Profile } from "../types";

export const authService = {
  //  Sign up user and insert into profiles table
  async signUp(email: string, password: string, fullName: string, role: "candidate" | "employer") {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
        },
      },
    });

    if (authError) throw authError;

    // Insert into profiles table with matching id
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .insert([
        {
          id: authData.user?.id,
          email,
          full_name: fullName,
          role,
        },
      ]);

    if (profileError) throw profileError;

    return { user: authData.user };
  },

  // Sign in existing user
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return { user: data.user };
  },

  // Sign out
  async signOut() {
    await supabase.auth.signOut();
  },

  // Get current logged-in user
  async getCurrentUser() {
    const { data } = await supabase.auth.getUser();
    return data.user;
  },

  // Get user profile from profiles table
  async getCurrentProfile(): Promise<Profile | null> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return null;

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userData.user.id)
      .single();

    if (error) return null;
    return profile as Profile;
  },

  // Update user profile
  async updateProfile(updates: Partial<Profile>) {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userData.user.id)
      .select()
      .single();

    if (error) throw error;
    return data as Profile;
  },

  // Listen to auth state changes
  onAuthStateChange(callback: (user: any) => void) {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  },
};
