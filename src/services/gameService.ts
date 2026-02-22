import type { User } from '@supabase/supabase-js';

import { supabase } from '../lib/supabase';
import type { Pet, Profile, SessionReward } from '../types/domain';
import { freeEggIds } from '../types/domain';

type ProfileDb = {
  id: string;
  username: string;
  coins: number;
  streak: number;
  best_streak: number;
  total_focus_minutes: number;
  squad_sessions: number;
  unlocked_eggs: string[];
  created_at?: string;
};

type PetDb = {
  id: string;
  user_id: string;
  egg_id: string;
  name: string;
  emoji: string;
  stage: string;
  rarity: Pet['rarity'];
  created_at?: string;
};

const mapProfile = (row: ProfileDb): Profile => ({
  id: row.id,
  username: row.username,
  coins: row.coins,
  streak: row.streak,
  bestStreak: row.best_streak,
  totalFocusMinutes: row.total_focus_minutes,
  squadSessions: row.squad_sessions,
  unlockedEggs: row.unlocked_eggs?.length ? row.unlocked_eggs : freeEggIds,
  createdAt: row.created_at,
});

const mapProfileToDb = (profile: Profile): ProfileDb => ({
  id: profile.id,
  username: profile.username,
  coins: profile.coins,
  streak: profile.streak,
  best_streak: profile.bestStreak,
  total_focus_minutes: profile.totalFocusMinutes,
  squad_sessions: profile.squadSessions,
  unlocked_eggs: profile.unlockedEggs?.length ? profile.unlockedEggs : freeEggIds,
});

const mapPet = (row: PetDb): Pet => ({
  id: row.id,
  userId: row.user_id,
  eggId: row.egg_id,
  name: row.name,
  emoji: row.emoji,
  stage: row.stage,
  rarity: row.rarity,
  createdAt: row.created_at,
});

const defaultUsername = (user: User): string => {
  const candidate = user.email?.split('@')[0];
  return candidate && candidate.length > 0 ? candidate : 'focus_hatcher';
};

export const fetchProfile = async (userId: string): Promise<Profile | null> => {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapProfile(data as ProfileDb) : null;
};

export const upsertProfile = async (profile: Profile): Promise<void> => {
  const { error } = await supabase.from('profiles').upsert(mapProfileToDb(profile), { onConflict: 'id' });

  if (error) {
    throw error;
  }
};

export const ensureProfile = async (user: User, requestedUsername?: string): Promise<Profile> => {
  const existing = await fetchProfile(user.id);
  if (existing) {
    return existing;
  }

  const starter: Profile = {
    id: user.id,
    username: requestedUsername?.trim() || defaultUsername(user),
    coins: 750,
    streak: 0,
    bestStreak: 0,
    totalFocusMinutes: 0,
    squadSessions: 0,
    unlockedEggs: [...freeEggIds],
  };

  await upsertProfile(starter);
  return starter;
};

export const fetchPets = async (userId: string): Promise<Pet[]> => {
  const { data, error } = await supabase
    .from('pets')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => mapPet(row as PetDb));
};

export const insertPetFromReward = async (userId: string, reward: SessionReward): Promise<void> => {
  const { error } = await supabase.from('pets').insert({
    user_id: userId,
    egg_id: reward.eggId,
    name: reward.name,
    emoji: reward.emoji,
    stage: reward.stage,
    rarity: reward.rarity,
  });

  if (error) {
    throw error;
  }
};
