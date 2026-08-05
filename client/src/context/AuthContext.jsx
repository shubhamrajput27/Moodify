import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';

const AuthContext = createContext();

const NOT_CONFIGURED_MESSAGE =
  'Accounts are not set up for this deployment yet (missing Supabase configuration).';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const signUp = async (email, password) => {
    if (!isSupabaseConfigured) throw new Error(NOT_CONFIGURED_MESSAGE);
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  };

  const signIn = async (email, password) => {
    if (!isSupabaseConfigured) throw new Error(NOT_CONFIGURED_MESSAGE);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signInWithSpotify = async () => {
    if (!isSupabaseConfigured) throw new Error(NOT_CONFIGURED_MESSAGE);
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'spotify' });
    if (error) throw error;
  };

  const signOut = async () => {
    if (!isSupabaseConfigured) return;
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, isSupabaseConfigured, signUp, signIn, signInWithSpotify, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
