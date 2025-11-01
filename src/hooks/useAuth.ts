import { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { Profile } from '../types';

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();

    const { data: authListener } = authService.onAuthStateChange(() => {
      (async () => {
        await checkUser();
      })();
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);

      if (currentUser) {
        const currentProfile = await authService.getCurrentProfile();
        setProfile(currentProfile);
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error('Error checking user:', error);
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    role: 'candidate' | 'employer'
  ) => {
    const data = await authService.signUp(email, password, fullName, role);
    await checkUser();
    return data;
  };

  const signIn = async (email: string, password: string) => {
    const data = await authService.signIn(email, password);
    await checkUser();
    return data;
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
    setProfile(null);
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    const updatedProfile = await authService.updateProfile(updates);
    setProfile(updatedProfile);
    return updatedProfile;
  };

  return {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    refreshProfile: checkUser,
  };
}
