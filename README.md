# Focus Hatch

Application mobile de productivite gamifiee construite avec **React Native (Expo)** et **Supabase**.

Lance une session focus, fais eclore un oeuf anime et collectionne des creatures uniques.

## Fonctionnalites

- **Sessions Focus** : lance un timer (25 a 120 min) et reste concentre
- **Oeuf anime Lottie** : l'oeuf tremble pendant la session et eclot 3 secondes avant la fin du timer
- **Penalite** : quitter l'app en pleine session reduit le streak et tue le pet
- **Mode Solo / Squad** : joue seul ou en groupe avec des recompenses differentes
- **5 oeufs** : Foret, Ocean, Volcan, Cosmique, Mythique — chacun avec ses creatures
- **Collection** : galerie de toutes les creatures obtenues avec badges de rarete
- **Boutique** : achete de nouveaux oeufs avec les coins gagnes
- **Profil** : stats, streak, progression

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Framework | React Native 0.81 + Expo SDK 54 |
| Langage | TypeScript 5.9 |
| Navigation | React Navigation 7 (bottom tabs + native stack) |
| Animation | Lottie (`lottie-react-native`) |
| Backend | Supabase (Auth + PostgreSQL) |
| Fonts | Sora + Space Grotesk (Google Fonts) |
| UI | Composants custom (GlassCard, AppBackdrop, GradientButton) |

## Structure du projet

```
mobile/
├── assets/
│   └── art/              # PNG des pets/oeufs + egg_lottie.json + fond
├── src/
│   ├── context/          # AppContext (auth, profile, pets, coins)
│   ├── lib/              # Client Supabase
│   ├── navigation/       # MainTabs (Home, Collection, Shop, Settings)
│   ├── screens/
│   │   ├── AuthScreen    # Inscription + Connexion
│   │   ├── FocusScreen   # Timer + oeuf Lottie + gameplay
│   │   ├── CollectionScreen # Bestiaire + stats
│   │   ├── ShopScreen    # Achat d'oeufs
│   │   └── ProfileScreen # Parametres + stats joueur
│   ├── services/         # gameService (logique Supabase)
│   ├── types/            # domain.ts (types + catalogue d'oeufs)
│   └── ui/               # Composants UI (theme, art, GlassCard...)
├── app.json              # Config Expo
├── eas.json              # Config EAS Build
└── package.json
```

## Installation

### Prerequis

- Node.js >= 18
- Expo CLI (`npx expo`)
- Un projet Supabase avec la migration SQL appliquee

### Setup

```bash
# Cloner le repo
git clone https://github.com/amineBelhaim/EGGO.git
cd EGGO

# Installer les dependances
npm install

# Creer le fichier d'environnement
cp .env.example .env
```

Remplir `.env` avec les cles de ton projet Supabase :

```
EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### Base de donnees

Appliquer la migration SQL dans le dashboard Supabase :

```
supabase/migrations/202602130001_focus_hatch.sql
```

> Pour une inscription sans confirmation email :
> Supabase Dashboard > Auth > Email > desactiver "Confirm email"

### Lancer l'app

```bash
npm run start
```

Puis ouvrir sur iPhone via **Expo Go** (scanner le QR code) ou sur navigateur avec `w`.

## Scripts

| Commande | Description |
|----------|-------------|
| `npm run start` | Demarrer le serveur Expo |
| `npm run ios` | Lancer sur simulateur iOS |
| `npm run android` | Lancer sur emulateur Android |
| `npm run web` | Lancer en mode web |
| `npm run typecheck` | Verification TypeScript |
| `npm run generate:art` | Regenerer les assets PNG |

## Gameplay

1. **Choisis un oeuf** dans le selecteur (bouton oeuf)
2. **Lance la session** (bouton play)
3. L'oeuf tremble pendant tout le timer
4. **3 secondes avant la fin**, l'animation Lottie d'eclosion se lance
5. **Session terminee** : tu gagnes des coins et un pet rejoint ta collection
6. **Attention** : quitter l'app en pleine session = penalite (streak reduit, pet perdu)

## Rarete des oeufs

| Oeuf | Rarete | Duree | Prix |
|------|--------|-------|------|
| Foret | Commun | 25 min | Gratuit |
| Ocean | Rare | 45 min | Gratuit |
| Volcan | Epique | 60 min | 300 coins |
| Cosmique | Legendaire | 90 min | 600 coins |
| Mythique | Mythique | 120 min | 1200 coins |

## Licence

Projet prive.
