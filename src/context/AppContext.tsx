import type { PropsWithChildren } from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';

import { supabase } from '../lib/supabase';
import { ensureProfile, fetchPets, upsertProfile, insertPetFromReward } from '../services/gameService';
import type { EggDefinition, FocusMode, Pet, Profile, SessionReward } from '../types/domain';
import { freeEggIds } from '../types/domain';

type AppContextValue = {
  ready: boolean;
  loading: boolean;
  error: string | null;
  session: Session | null;
  profile: Profile | null;
  pets: Pet[];
  unlockedEggIds: Set<string>;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, username: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  refreshData: () => Promise<void>;
  clearError: () => void;
  completeSession: (reward: SessionReward) => Promise<void>;
  applyPenalty: (mode: FocusMode) => Promise<void>;
  unlockEgg: (egg: EggDefinition) => Promise<boolean>;
  buyCoinsItem: (cost: number) => Promise<boolean>;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

const toMessage = (error: unknown): string => {
  if (typeof error === 'string') {
    return error;
  }
  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message;
  }
  return 'Unexpected error';
};

export function AppProvider({ children }: PropsWithChildren) {
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      try {
        const { data, error: authError } = await supabase.auth.getSession();
        if (authError) {
          throw authError;
        }
        if (!mounted) {
          return;
        }
        setSession(data.session ?? null);
      } catch (e) {
        if (mounted) {
          setError(toMessage(e));
        }
      } finally {
        if (mounted) {
          setReady(true);
        }
      }
    };

    void bootstrap();

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession ?? null);
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session?.user) {
      setProfile(null);
      setPets([]);
      return;
    }
    void hydrateUser(session.user);
  }, [session?.user?.id]);

  const hydrateUser = async (user: User, usernameHint?: string) => {
    setLoading(true);
    setError(null);
    try {
      const ensured = await ensureProfile(user, usernameHint);
      const patched =
        ensured.unlockedEggs.length === 0
          ? {
              ...ensured,
              unlockedEggs: [...freeEggIds],
            }
          : ensured;

      if (patched !== ensured) {
        await upsertProfile(patched);
      }

      const petRows = await fetchPets(user.id);
      setProfile(patched);
      setPets(petRows);
    } catch (e) {
      setError(toMessage(e));
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) {
        throw authError;
      }

      if (!data.session) {
        throw new Error('Sign in failed: missing session.');
      }

      setSession(data.session);
      return true;
    } catch (e) {
      setError(toMessage(e));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, username: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        throw authError;
      }

      if (data.session) {
        await ensureProfile(data.session.user, username.trim() || undefined);
        setSession(data.session);
        return true;
      }

      const { data: current, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        throw sessionError;
      }

      if (current.session) {
        await ensureProfile(current.session.user, username.trim() || undefined);
        setSession(current.session);
        return true;
      }

      setError("Compte cree. Si l'email de confirmation est active, valide puis connecte-toi.");
      return false;
    } catch (e) {
      setError(toMessage(e));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setSession(null);
      setProfile(null);
      setPets([]);
    } catch (e) {
      setError(toMessage(e));
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async (): Promise<void> => {
    if (!session?.user) {
      return;
    }
    await hydrateUser(session.user);
  };

  const completeSession = async (reward: SessionReward): Promise<void> => {
    if (!session?.user || !profile) {
      return;
    }

    setError(null);
    try {
      const updated: Profile = {
        ...profile,
        coins: profile.coins + reward.rewardCoins,
        streak: profile.streak + 1,
        bestStreak: Math.max(profile.bestStreak, profile.streak + 1),
        totalFocusMinutes: profile.totalFocusMinutes + reward.focusMinutes,
        squadSessions: reward.mode === 'squad' ? profile.squadSessions + 1 : profile.squadSessions,
        unlockedEggs: profile.unlockedEggs.length ? profile.unlockedEggs : [...freeEggIds],
      };

      await upsertProfile(updated);
      await insertPetFromReward(session.user.id, reward);

      setProfile(updated);
      const petRows = await fetchPets(session.user.id);
      setPets(petRows);
    } catch (e) {
      setError(toMessage(e));
    }
  };

  const applyPenalty = async (mode: FocusMode): Promise<void> => {
    if (!profile || !session?.user) {
      return;
    }
    try {
      const updated: Profile = {
        ...profile,
        streak: Math.max(0, profile.streak - 1),
        squadSessions: mode === 'squad' ? profile.squadSessions + 1 : profile.squadSessions,
      };
      await upsertProfile(updated);
      setProfile(updated);
    } catch (e) {
      setError(toMessage(e));
    }
  };

  const unlockEgg = async (egg: EggDefinition): Promise<boolean> => {
    if (!profile) {
      return false;
    }
    if (profile.unlockedEggs.includes(egg.id)) {
      return true;
    }
    if (profile.coins < egg.price) {
      setError('Pas assez de pieces.');
      return false;
    }

    try {
      const updated: Profile = {
        ...profile,
        coins: profile.coins - egg.price,
        unlockedEggs: [...new Set([...profile.unlockedEggs, egg.id])],
      };
      await upsertProfile(updated);
      setProfile(updated);
      return true;
    } catch (e) {
      setError(toMessage(e));
      return false;
    }
  };

  const buyCoinsItem = async (cost: number): Promise<boolean> => {
    if (!profile) {
      return false;
    }
    if (profile.coins < cost) {
      setError('Pas assez de pieces.');
      return false;
    }
    try {
      const updated: Profile = {
        ...profile,
        coins: profile.coins - cost,
      };
      await upsertProfile(updated);
      setProfile(updated);
      return true;
    } catch (e) {
      setError(toMessage(e));
      return false;
    }
  };

  const value = useMemo<AppContextValue>(
    () => ({
      ready,
      loading,
      error,
      session,
      profile,
      pets,
      unlockedEggIds: new Set(profile?.unlockedEggs ?? freeEggIds),
      signIn,
      signUp,
      signOut,
      refreshData,
      clearError: () => setError(null),
      completeSession,
      applyPenalty,
      unlockEgg,
      buyCoinsItem,
    }),
    [ready, loading, error, session, profile, pets],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = (): AppContextValue => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used inside AppProvider');
  }
  return context;
};
