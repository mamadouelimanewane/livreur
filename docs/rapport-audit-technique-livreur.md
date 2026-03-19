# Rapport d'audit technique profond de l'application `livreur`

Date: 2026-03-19
Audience: equipe developpement
Angle: audit technique

## 1. Architecture

### Vue d'ensemble

L'application est un socle front hybride qui assemble trois cibles:

- un back-office web React/Vite;
- deux experiences mobiles Expo encapsulees dans un `WebView`;
- un packaging Android via Capacitor et EAS.

Les preuves principales:

- Le point d'entree web initialise `BrowserRouter` et `AuthProvider` dans `src/main.jsx` (`createRoot`, `BrowserRouter`, `AuthProvider`) et monte l'application routee. Voir `src/main.jsx:2-14`.
- Le routeur principal declare un grand nombre de routes d'administration et expose aussi deux routes mobiles web, `/mobile/user` et `/mobile/driver`. Voir `src/App.jsx:96-185`, en particulier `src/App.jsx:104`, `src/App.jsx:116`, `src/App.jsx:185`.
- Le point d'entree mobile React Native/Expo ne reconstruit pas une UI native: il calcule une route web selon `appTarget`, puis charge cette route dans un `WebView`. Voir `App.native.jsx:6-7`, `App.native.jsx:29`, `App.native.jsx:50-52`.
- Metro est configure pour bloquer tout `src/` et `dist/`, ce qui confirme que la cible mobile embarque surtout `App.native.jsx` comme wrapper autour du web bundle. Voir `metro.config.cjs:7-14`.
- Le packaging multi-cible est explicite dans `package.json` avec `mobile:user`, `mobile:driver`, `eas:user`, `eas:driver`, et la dependance `react-native-webview`. Voir `package.json:6-17`, `package.json:24`, `package.json:31`, `package.json:44`.

### Lecture technique

Le projet est donc structure comme une application web riche, reutilisee ensuite dans des conteneurs mobiles. Ce choix peut etre pertinent pour accelerer une demo ou un MVP, mais il n'offre pas les garanties attendues d'une application mobile vraiment native sur les sujets offline, performances, UX tactile fine, navigation systeme et integrations natives.

## 2. Maturite fonctionnelle

### Cartographie fonctionnelle

La couverture ecran est large. Le depot contient 59 pages exportees sous `src/pages`, couvrant notamment:

- dashboard;
- utilisateurs;
- conducteurs;
- dispatch manuel;
- livraison;
- taxi;
- setup;
- support;
- contenu;
- transactions;
- parametres;
- mobile utilisateur et mobile conducteur.

Cette largeur donne l'impression d'un produit presque complet, mais l'inspection du code montre que la profondeur metier reste limitee.

### Ce qui est reellement implemente

L'application est tres avancee du point de vue UI:

- structure de navigation admin importante dans `src/layouts/AdminLayout.jsx`;
- composants partages de page/table/formulaire dans `src/components/PageLayout.jsx:2`, `src/components/PageLayout.jsx:118`, `src/components/PageLayout.jsx:204`;
- ecrans de dashboard, listings, formulaires et vues mobiles relativement soignes.

En revanche, la plupart des ecrans metier reposent sur des donnees locales ou des formulaires non persistants:

- `src/pages/drivers/DriversPage.jsx:5` declare `sampleDrivers`, puis filtre ces donnees localement a `src/pages/drivers/DriversPage.jsx:93`.
- `src/pages/users/UsersPage.jsx:5` declare `sampleUsers`, puis applique le filtrage en memoire a `src/pages/users/UsersPage.jsx:78`.
- `src/pages/delivery/RidesPage.jsx:5` declare `allRides`, puis derive les vues selon `typeFilter` a `src/pages/delivery/RidesPage.jsx:22-40`.
- `src/pages/dispatch/ManualDispatchPage.jsx:24` declare `availableDrivers`; l'envoi est simule et le message de succes est efface via `setTimeout` a `src/pages/dispatch/ManualDispatchPage.jsx:41`.
- `src/pages/settings/GeneralSettingsPage.jsx:57-115` utilise massivement `defaultValue`, ce qui indique un ecran de configuration pre-rempli mais non branche a une persistence reelle.
- `src/pages/dashboard/DashboardPage.jsx:197-198` et le reste du fichier injectent directement des KPIs numeriques dans le rendu.
- `src/pages/dashboard/DashboardPage.jsx:269` utilise un lien `href={q.link}` pour la navigation rapide, signe d'une composition essentiellement front.
- `src/pages/mobile/MobileUserApp.jsx` et `src/pages/mobile/MobileDriverApp.jsx` pilotent leurs ecrans via state local et tableaux hardcodes, sans couche de synchronisation metier visible.

### Authentification et securite fonctionnelle

L'authentification admin est simulee:

- la clef `sur_admin_user` est stockee localement dans `localStorage` (`src/context/AuthContext.jsx:5`);
- le chargement utilisateur lit `localStorage` (`src/context/AuthContext.jsx:9`);
- `login` cree un objet utilisateur local avec role fixe `superadmin` (`src/context/AuthContext.jsx:19-29`);
- `logout` supprime simplement la clef locale (`src/context/AuthContext.jsx:34-35`);
- la page de connexion accepte n'importe quel couple email/mot de passe non vide, puis simule un reseau avec un `setTimeout` (`src/pages/auth/LoginPage.jsx:17-28`).

Conclusion: il n'y a pas de preuve d'API d'authentification, de roles reels, de permissions serveur ou de session securisee.

## 3. Dette technique et risques

### Constat technique majeur

Le code ressemble a un prototype UI de bonne qualite visuelle, mais pas encore a un back-office branche a un socle metier.

Les signaux principaux:

- aucune couche `services/api` ou client de donnees n'est visible dans le depot;
- aucune occurrence metier exploitable de `fetch()` ou `axios` n'a ete trouvee dans `src/` lors de l'exploration;
- pas de modele de domaine centralise;
- pas d'etat global metier hors contexte d'auth simulé;
- beaucoup d'ecrans gerent localement leurs listes, filtres et pseudo-actions.

### Monolithes et duplication

La maintenabilite est degradee par la taille et la duplication:

- `src/layouts/AdminLayout.jsx` fait 925 lignes et concentre menu, sidebar, navbar, comportements de dropdown et layout racine.
- Le menu est defini dans le meme fichier a `src/layouts/AdminLayout.jsx:40`, la sidebar demarre a `src/layouts/AdminLayout.jsx:430`, la navbar a `src/layouts/AdminLayout.jsx:582`, et l'export racine a `src/layouts/AdminLayout.jsx:939`.
- Beaucoup de pages reconstruisent leurs tableaux, filtres, badges et boutons avec des patterns proches, meme si `PageLayout.jsx` amorce deja une mutualisation.

### Styles et systeme de design

Le projet repose fortement sur les styles inline:

- `src/App.css` indique explicitement que les styles de composants sont volontairement minimaux et geres inline.
- `src/index.css` ne contient qu'un socle global, pas un vrai systeme de design centralise.

Effet de bord: le visuel est rapide a maquettiser, mais l'evolution est plus couteuse, les variantes sont difficiles a harmoniser, et le theming global reste faible.

### Documentation et transmission

La documentation est insuffisante pour une reprise sereine:

- `README.md:1-3` est encore celui du template React + Vite;
- aucune doc d'architecture, de modules, de conventions, ni de flux de build produit n'est presente dans le depot;
- les scripts existent, mais leur rationale n'est pas documente.

### Tests et qualite automatisee

Le depot ne contient aucune suite de test detectee sur les zones inspectees (`src`, `scripts`, `.github`): 0 fichier `*.test.*` ou `*.spec.*`.

Cela signifie:

- pas de filet de securite pour les regressions;
- pas de preuve de validation automatique des comportements critiques;
- faible confiance pour brancher ensuite une vraie logique metier sans casser l'UI existante.

### Risques de mise en production

#### Risque fonctionnel

L'interface donne une impression de produit complet, mais une grande partie des flux est simulee. Le danger est double: surestimation de l'etat reel du produit et decalage fort entre demo et exploitation.

#### Risque securite

Le login local et le role fixe `superadmin` exposent un niveau de maturite securite tres faible pour un back-office.

#### Risque maintenance

La duplication des patterns d'ecran, l'usage massif de styles inline et la taille de `AdminLayout.jsx` ralentiront les evolutions.

#### Risque qualite

Sans tests ni CI de qualite visible, chaque branchement backend augmentera le risque de regressions silencieuses.

#### Risque mobile

Le wrapper `WebView` reste acceptable pour un MVP, mais il limite fortement la robustesse mobile long terme. C'est un bon vehicule de demonstration, pas encore une strategie mobile mature.

### Encodage et locale

L'inspection terminal a montre plusieurs signes de mojibake sur certains fichiers, par exemple autour des labels et commentaires de `src/App.jsx` et `src/layouts/AdminLayout.jsx` (`SÃ›R`, `DÃ©connexion`, etc. dans certaines sorties). Ce point doit etre verifie: il peut s'agir d'un probleme d'encodage fichier, d'un melange UTF-8/ANSI, ou simplement d'une divergence d'affichage terminal. Dans tous les cas, il faut normaliser l'encodage du depot avant industrialisation.

## 4. Verification outillee et plan d'action

### Etat des verifications

#### Build web

Commande executee:

```bash
cmd /c npm run build
```

Resultat:

- echec en sandbox a cause d'un `spawn EPERM` lie a l'environnement;
- succes hors sandbox apres rerun: build Vite production valide.

Conclusion: le front web est compilable en production dans l'etat actuel.

#### Lint

Commande executee:

```bash
cmd /c npm run lint
```

Resultat:

- `eslint .` echoue avec 20 erreurs reelles.

Points saillants:

- `App.native.jsx`: `__DEV__` non defini pour ESLint; listener Android branche pendant le render; lecture de `ref` signalee comme incorrecte.
- `app.config.js`: `process` non defini car la config ESLint declare seulement `globals.browser`. Voir `eslint.config.js:10-26` et `app.config.js:1`.
- `scripts/mobileify.js`: usages de `process` et `writeFileSync` sur un fichier linter comme s'il etait browser-only. Voir `scripts/mobileify.js:20`, `scripts/mobileify.js:43`, `scripts/mobileify.js:68`.
- `scripts/generate-icons.js`: usages de `Buffer` non reconnus par la config actuelle. Voir `scripts/generate-icons.js:33-74`.
- `src/context/AuthContext.jsx`: export mixte qui perturbe fast refresh.
- `src/layouts/AdminLayout.jsx`: import inutilise et fichier trop dense.

### Plan d'action priorise

#### Court terme

1. Corriger le lint critique.
   - Declarer des scopes ESLint distincts pour browser, Expo/React Native et scripts Node.
   - Sortir le listener Android de la phase de render dans `App.native.jsx`.
   - Assainir `AuthContext.jsx` pour fast refresh.

2. Stabiliser la structure.
   - Extraire `AdminLayout.jsx` en sous-modules: menu config, sidebar, navbar, primitives de layout.
   - Introduire une arborescence `services/` ou `api/` meme si elle commence en mock.

3. Remplacer les mocks prioritaires.
   - Prioriser login, conducteurs, utilisateurs, courses et dispatch manuel.
   - Definir des contrats d'E/S clairs avant brancher les ecrans.

4. Remettre la doc a niveau.
   - Reecrire `README.md`.
   - Documenter architecture, scripts de build, cibles mobile, et conventions de contribution.

#### Moyen terme

1. Centraliser le design system.
   - Tokens de couleur/espace/typographie.
   - Composants communs de table, formulaire, badge, bouton d'action.

2. Normaliser les patterns d'ecran.
   - Filtres, pagination, actions de ligne, loaders, etats vides, messages d'erreur.

3. Introduire une navigation config-driven.
   - Deplacer le gros tableau `menu` vers une configuration dediee.
   - Faire converger routes, labels, icones et droits.

4. Ajouter des tests.
   - unitaires sur composants critiques;
   - smoke tests sur routes principales;
   - verification CI minimale build + lint + tests.

#### Long terme

1. Reevaluer la strategie mobile.
   - Soit assumer une logique hybride WebView limitee mais encadree;
   - soit migrer progressivement vers une vraie app mobile plus native.

2. Renforcer la securite.
   - auth reelle, gestion des roles, permissions, stockage de session adapte, protection serveur.

3. Ajouter observabilite et release discipline.
   - CI/CD, telemetry, reporting d'erreurs, checks de qualite obligatoires.

## Conclusion

`livreur` est un socle UI multiplateforme prometteur et deja riche visuellement. Pour une equipe de reprise, la bonne lecture n'est pas "produit presque termine", mais "prototype front de bonne qualite a industrialiser". La priorite n'est pas d'ajouter encore des ecrans: c'est de transformer cette couche de presentation en application metier branchee, testable, maintenable et securisee.
