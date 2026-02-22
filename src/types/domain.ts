export type FocusMode = 'solo' | 'squad';

export type PetRarity = 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';

export type EggPetTemplate = {
  name: string;
  stageArtKeys: string[];
  stageLabels: string[];
};

export type EggDefinition = {
  id: string;
  name: string;
  artKey: string;
  rarity: PetRarity;
  requiredMinutes: number;
  price: number;
  pets: EggPetTemplate[];
};

export type SessionReward = {
  eggId: string;
  name: string;
  // Stored in DB column `emoji` for backward compatibility.
  emoji: string;
  stage: string;
  rarity: PetRarity;
  rewardCoins: number;
  focusMinutes: number;
  mode: FocusMode;
};

export type Profile = {
  id: string;
  username: string;
  coins: number;
  streak: number;
  bestStreak: number;
  totalFocusMinutes: number;
  squadSessions: number;
  unlockedEggs: string[];
  createdAt?: string;
};

export type Pet = {
  id: string;
  userId: string;
  eggId: string;
  name: string;
  // May contain an old emoji string or an art key.
  emoji: string;
  stage: string;
  rarity: PetRarity;
  createdAt?: string;
};

const petStages = (id: string): string[] => [
  `pet_${id}_egg`,
  `pet_${id}_baby`,
  `pet_${id}_teen`,
  `pet_${id}_adult`,
];

export const eggCatalog: EggDefinition[] = [
  {
    id: 'forest',
    name: 'Oeuf Foret',
    artKey: 'egg_official',
    rarity: 'common',
    requiredMinutes: 25,
    price: 0,
    pets: [
      { name: 'Flamby', stageArtKeys: petStages('flamby'), stageLabels: ['Bebe', 'Junior', 'Ado', 'Adulte'] },
      { name: 'Mochi', stageArtKeys: petStages('mochi'), stageLabels: ['Bebe', 'Junior', 'Ado', 'Adulte'] },
    ],
  },
  {
    id: 'ocean',
    name: 'Oeuf Ocean',
    artKey: 'egg_ocean',
    rarity: 'rare',
    requiredMinutes: 45,
    price: 0,
    pets: [
      { name: 'Nebulon', stageArtKeys: petStages('nebulon'), stageLabels: ['Larve', 'Junior', 'Ado', 'Adulte'] },
      { name: 'Crysta', stageArtKeys: petStages('crysta'), stageLabels: ['Chrysalide', 'Junior', 'Ado', 'Adulte'] },
    ],
  },
  {
    id: 'volcano',
    name: 'Oeuf Volcan',
    artKey: 'egg_volcano',
    rarity: 'epic',
    requiredMinutes: 60,
    price: 300,
    pets: [
      { name: 'Pyra', stageArtKeys: petStages('pyra'), stageLabels: ['Louveteau', 'Junior', 'Ado', 'Dragon'] },
      { name: 'Voltix', stageArtKeys: petStages('voltix'), stageLabels: ['Etincelle', 'Eclair', 'Foudre', 'Inferno'] },
    ],
  },
  {
    id: 'cosmic',
    name: 'Oeuf Cosmique',
    artKey: 'egg_cosmic',
    rarity: 'legendary',
    requiredMinutes: 90,
    price: 600,
    pets: [
      { name: 'Drakanis', stageArtKeys: petStages('drakanis'), stageLabels: ['Dragon', 'Grand Dragon', 'Celeste', 'Divin'] },
      { name: 'Phoenix', stageArtKeys: petStages('phoenix'), stageLabels: ['Flamme', 'Rapace', 'Astral', 'Eternel'] },
    ],
  },
  {
    id: 'mythic',
    name: 'Oeuf Mythique',
    artKey: 'egg_mythic',
    rarity: 'mythic',
    requiredMinutes: 120,
    price: 1200,
    pets: [
      { name: 'Aethon', stageArtKeys: petStages('aethon'), stageLabels: ['Fragment', 'Licorne', 'Celeste', 'Cosmos'] },
      { name: 'Leviathan', stageArtKeys: petStages('leviathan'), stageLabels: ['Serpent', 'Hydre', 'Titan', 'Eternel'] },
    ],
  },
];

export const freeEggIds = eggCatalog.filter((egg) => egg.price === 0).map((egg) => egg.id);
