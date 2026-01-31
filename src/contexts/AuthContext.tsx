import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { User as AuthUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import type { Profile, User } from '@/types/database';

interface AuthContextType {
  authUser: AuthUser | null;
  session: Session | null;
  profile: Profile | null;
  userData: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (userId: string) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profileError) console.error('Error fetching profile:', profileError);
      if (userError) console.error('Error fetching user data:', userError);

      return {
        profile: profileData as Profile | null,
        user: userData as User | null,
      };
    } catch (err) {
      console.error('Unexpected fetchUserData error:', err);
      return { profile: null, user: null };
    }
  };

  const refreshUserData = async () => {
    if (!authUser) return;
    const { profile, user } = await fetchUserData(authUser.id);
    setProfile(profile);
    setUserData(user);
  };

  useEffect(() => {
    setLoading(true);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setAuthUser(session?.user ?? null);

      if (session?.user) {
        fetchUserData(session.user.id).then(({ profile, user }) => {
          setProfile(profile);
          setUserData(user);
        });
      } else {
        setProfile(null);
        setUserData(null);
      }

      setLoading(false);
    });

    // Fetch current session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthUser(session?.user ?? null);

      if (session?.user) {
        fetchUserData(session.user.id).then(({ profile, user }) => {
          setProfile(profile);
          setUserData(user);
        });
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error: error ?? null };
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    return { error: error ?? null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setAuthUser(null);
    setSession(null);
    setProfile(null);
    setUserData(null);
  };

  return (
    <AuthContext.Provider
      value={{
        authUser,
        session,
        profile,
        userData,
        loading,
        signIn,
        signUp,
        signOut,
        refreshUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
