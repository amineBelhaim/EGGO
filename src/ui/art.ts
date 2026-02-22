import type { ImageSourcePropType } from 'react-native';

export const art = {
  egg_official: require('../../assets/art/egg_official.png'),
  egg_forest: require('../../assets/art/egg_forest.png'),
  egg_ocean: require('../../assets/art/egg_ocean.png'),
  egg_volcano: require('../../assets/art/egg_volcano.png'),
  egg_cosmic: require('../../assets/art/egg_cosmic.png'),
  egg_mythic: require('../../assets/art/egg_mythic.png'),

  pet_flamby_egg: require('../../assets/art/pet_flamby_egg.png'),
  pet_flamby_baby: require('../../assets/art/pet_flamby_baby.png'),
  pet_flamby_teen: require('../../assets/art/pet_flamby_teen.png'),
  pet_flamby_adult: require('../../assets/art/pet_flamby_adult.png'),

  pet_mochi_egg: require('../../assets/art/pet_mochi_egg.png'),
  pet_mochi_baby: require('../../assets/art/pet_mochi_baby.png'),
  pet_mochi_teen: require('../../assets/art/pet_mochi_teen.png'),
  pet_mochi_adult: require('../../assets/art/pet_mochi_adult.png'),

  pet_nebulon_egg: require('../../assets/art/pet_nebulon_egg.png'),
  pet_nebulon_baby: require('../../assets/art/pet_nebulon_baby.png'),
  pet_nebulon_teen: require('../../assets/art/pet_nebulon_teen.png'),
  pet_nebulon_adult: require('../../assets/art/pet_nebulon_adult.png'),

  pet_crysta_egg: require('../../assets/art/pet_crysta_egg.png'),
  pet_crysta_baby: require('../../assets/art/pet_crysta_baby.png'),
  pet_crysta_teen: require('../../assets/art/pet_crysta_teen.png'),
  pet_crysta_adult: require('../../assets/art/pet_crysta_adult.png'),

  pet_pyra_egg: require('../../assets/art/pet_pyra_egg.png'),
  pet_pyra_baby: require('../../assets/art/pet_pyra_baby.png'),
  pet_pyra_teen: require('../../assets/art/pet_pyra_teen.png'),
  pet_pyra_adult: require('../../assets/art/pet_pyra_adult.png'),

  pet_voltix_egg: require('../../assets/art/pet_voltix_egg.png'),
  pet_voltix_baby: require('../../assets/art/pet_voltix_baby.png'),
  pet_voltix_teen: require('../../assets/art/pet_voltix_teen.png'),
  pet_voltix_adult: require('../../assets/art/pet_voltix_adult.png'),

  pet_drakanis_egg: require('../../assets/art/pet_drakanis_egg.png'),
  pet_drakanis_baby: require('../../assets/art/pet_drakanis_baby.png'),
  pet_drakanis_teen: require('../../assets/art/pet_drakanis_teen.png'),
  pet_drakanis_adult: require('../../assets/art/pet_drakanis_adult.png'),

  pet_phoenix_egg: require('../../assets/art/pet_phoenix_egg.png'),
  pet_phoenix_baby: require('../../assets/art/pet_phoenix_baby.png'),
  pet_phoenix_teen: require('../../assets/art/pet_phoenix_teen.png'),
  pet_phoenix_adult: require('../../assets/art/pet_phoenix_adult.png'),

  pet_aethon_egg: require('../../assets/art/pet_aethon_egg.png'),
  pet_aethon_baby: require('../../assets/art/pet_aethon_baby.png'),
  pet_aethon_teen: require('../../assets/art/pet_aethon_teen.png'),
  pet_aethon_adult: require('../../assets/art/pet_aethon_adult.png'),

  pet_leviathan_egg: require('../../assets/art/pet_leviathan_egg.png'),
  pet_leviathan_baby: require('../../assets/art/pet_leviathan_baby.png'),
  pet_leviathan_teen: require('../../assets/art/pet_leviathan_teen.png'),
  pet_leviathan_adult: require('../../assets/art/pet_leviathan_adult.png'),
} as const;

export type ArtKey = keyof typeof art;

const legacyFallbackMap: Record<string, ArtKey> = {
  pet_stage_egg: 'pet_flamby_egg',
  pet_stage_baby: 'pet_flamby_baby',
  pet_stage_teen: 'pet_flamby_teen',
  pet_stage_adult: 'pet_flamby_adult',
  '🐣': 'pet_flamby_baby',
  '🐥': 'pet_flamby_teen',
  '🐔': 'pet_flamby_adult',
  '🦚': 'pet_flamby_adult',
  '🐱': 'pet_mochi_baby',
  '🐈': 'pet_mochi_teen',
  '😺': 'pet_mochi_adult',
  '🦁': 'pet_mochi_adult',
  '🐙': 'pet_nebulon_baby',
  '🦑': 'pet_nebulon_teen',
  '🐬': 'pet_nebulon_adult',
  '🐋': 'pet_nebulon_adult',
  '🦋': 'pet_crysta_baby',
  '🪼': 'pet_crysta_teen',
  '🦅': 'pet_crysta_adult',
  '🌊': 'pet_crysta_adult',
  '🦊': 'pet_pyra_baby',
  '🐺': 'pet_pyra_teen',
  '🔥': 'pet_pyra_adult',
  '🐉': 'pet_drakanis_adult',
};

export const resolveArt = (key?: string): ImageSourcePropType => {
  if (!key) {
    return art.pet_flamby_adult;
  }

  if (key in art) {
    return art[key as ArtKey];
  }

  if (key in legacyFallbackMap) {
    return art[legacyFallbackMap[key]];
  }

  return art.pet_flamby_adult;
};
