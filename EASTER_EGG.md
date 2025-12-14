# 🥚 Easter Egg - Star Wars Intro

## Comment activer l'Easter Egg

Sur la page d'accueil (`/`), tapez simplement le mot secret : **`moustache`**

Une fois activé, vous verrez :
- ✨ Un générique de style Star Wars
- 🌟 Des étoiles scintillantes en arrière-plan
- 📜 Un texte défilant racontant l'histoire de TraceVault
- 🎬 Des animations fluides inspirées de l'intro des films Star Wars

## Fonctionnalités spéciales

### 🎉 Bonus du 4 mai (May the 4th)

Si vous activez l'Easter Egg le **4 mai**, vous verrez un message spécial :
> "MAY THE 4TH BE WITH YOU!"

Cette date est célèbre chez les fans de Star Wars (jeu de mots avec "May the Force be with you").

## Comment fermer l'Easter Egg

- Cliquez sur le bouton **X** en haut à droite
- L'animation se ferme automatiquement après environ 2 minutes

## Détails techniques

### Fichiers concernés

- **Composant** : `src/components/StarWarsIntro.tsx`
- **Hook** : `src/hooks/useKonamiCode.ts` (détection de séquence de touches)
- **Styles** : `src/styles/starwars.scss`
- **Page** : `src/app/page.tsx` (intégration)

### Technologies utilisées

- **React Hooks** : `useState`, `useEffect`, `useCallback`
- **Animations CSS** : Keyframes pour le scroll et les transitions
- **Responsive Design** : S'adapte aux mobiles et tablettes
- **Toast Notifications** : Confirmation visuelle de l'activation

### Code secret

Le système détecte les touches tapées en temps réel (hors inputs/textareas) et active l'Easter Egg quand la séquence correspond à `moustache`.

```typescript
useSecretCode('moustache', handleSecretCode);
```

## Crédits

Inspiré du générique original de Star Wars et adapté pour célébrer l'équipe TraceVault :

- 👨‍💻 **Développeur** : Pablo MERIDJEN-MANOUKIAN
- 🧑‍🏫 **Consultants** :
  - Eric Izquierdo
  - Marc Rouchvarger
  - Joachim Ménager
  - Gary Wajdenbaum

---

*Que la Force de la blockchain soit avec vous !* ⚡
