import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ProfileData {
  name?: string;
}

interface UserData {
  location_id?: string;
  household_size?: number;
}

export function useProfile() {
  const { authUser, refreshUserData } = useAuth();
  const queryClient = useQueryClient();

  const createProfile = useMutation({
    mutationFn: async (data: ProfileData) => {
      if (!authUser) throw new Error('Not authenticated');

      const { data: profile, error } = await supabase
        .from('profiles')
        .insert({
          id: authUser.id,
          name: data.name || null,
        })
        .select()
        .single();

      if (error) throw error;
      return profile;
    },
    onSuccess: async () => {
      await refreshUserData();
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profile created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create profile: ' + error.message);
    },
  });

  const updateProfile = useMutation({
    mutationFn: async (data: ProfileData) => {
      if (!authUser) throw new Error('Not authenticated');

      const { data: profile, error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', authUser.id)
        .select()
        .single();

      if (error) throw error;
      return profile;
    },
    onSuccess: async () => {
      await refreshUserData();
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profile updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update profile: ' + error.message);
    },
  });

  const createUser = useMutation({
    mutationFn: async (data: UserData) => {
      if (!authUser) throw new Error('Not authenticated');

      const { data: user, error } = await supabase
        .from('users')
        .insert({
          id: authUser.id,
          location_id: data.location_id || null,
          household_size: data.household_size || 1,
        })
        .select()
        .single();

      if (error) throw error;
      return user;
    },
    onSuccess: async () => {
      await refreshUserData();
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast.success('User settings created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create user settings: ' + error.message);
    },
  });

  const updateUser = useMutation({
    mutationFn: async (data: UserData) => {
      if (!authUser) throw new Error('Not authenticated');

      const { data: user, error } = await supabase
        .from('users')
        .update(data)
        .eq('id', authUser.id)
        .select()
        .single();

      if (error) throw error;
      return user;
    },
    onSuccess: async () => {
      await refreshUserData();
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast.success('User settings updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update user settings: ' + error.message);
    },
  });

  return {
    createProfile,
    updateProfile,
    createUser,
    updateUser,
  };
}
