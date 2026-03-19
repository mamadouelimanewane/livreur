# livreur

Application front hybride pour un back-office de mobilite/livraison, avec :

- une interface web d'administration en React + Vite ;
- deux experiences mobiles (`user` et `driver`) rendues via WebView ;
- un packaging Android via Capacitor et Expo/EAS.

Le depot contient surtout un socle UI riche. Plusieurs ecrans utilisent encore des donnees mockees et une authentification locale simulee.

## Stack

- React 19
- Vite 8
- React Router 6
- Capacitor 8
- Expo 55
- React Native WebView

## Architecture

### Web admin

- Point d'entree : `src/main.jsx`
- Routage principal : `src/App.jsx`
- Layout admin : `src/layouts/AdminLayout.jsx`
- Auth locale mockee : `src/context/AuthContext.jsx`

Le back-office est protege par un wrapper `RequireAuth`. Les routes `/mobile/user` et `/mobile/driver` sont exposees hors layout admin.

### Mobile

Le point d'entree natif est `App.native.jsx`.

L'application native ne reconstruit pas une interface mobile complete : elle charge une route web dans un `WebView` selon `APP_TARGET` :

- `user` -> `/mobile/user`
- `driver` -> `/mobile/driver`

### Donnees et services

Le refactor en cours deplace progressivement les donnees ecran vers une couche `src/services/api/` avec des mocks partages dans `src/data/mockApiData.js`.

Aujourd'hui :

- l'auth admin reste simulee via `localStorage` ;
- plusieurs listings (utilisateurs, conducteurs, courses, support, mobile) reposent encore sur des mocks ;
- il n'y a pas encore de backend branche dans ce depot.

## Installation

Prerequis :

- Node.js 20+ recommande
- npm
- Android Studio si vous ciblez Android
- EAS CLI si vous utilisez Expo build

Installation :

```bash
npm install
```

## Scripts utiles

### Web

```bash
npm run dev
npm run lint
npm run build
npm run preview
```

### Android / mobile

```bash
npm run expo:user
npm run expo:driver
npm run mobile:user
npm run mobile:driver
npm run cap:sync
npm run cap:open
```

### GitHub Actions APK

Le workflow GitHub `Build Android APKs` peut generer :

- les deux variantes en une fois (`all`) ;
- seulement le client (`user`) ;
- seulement le livreur (`driver`) ;
- en `debug` ou en `release`.

Pour un APK `release` signe, ajoutez ces secrets dans GitHub :

- `ANDROID_KEYSTORE_BASE64`
- `ANDROID_KEYSTORE_PASSWORD`
- `ANDROID_KEY_ALIAS`
- `ANDROID_KEY_PASSWORD`

`ANDROID_KEYSTORE_BASE64` doit contenir le fichier keystore encode en base64.
Une fois les secrets ajoutes, lancez le workflow depuis l'onglet `Actions`.

#### Preparation du keystore release

Sur Windows, vous pouvez generer un keystore local avec :

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\create-android-keystore.ps1 `
  -OutputPath .\android-release.keystore `
  -Alias livigo `
  -StorePassword "votre-mot-de-passe-store" `
  -KeyPassword "votre-mot-de-passe-cle"
```

Puis encodez-le en base64 pour GitHub :

```bash
npm run keystore:encode -- android-release.keystore keystore.base64.txt
```

Ensuite, creez ces secrets GitHub :

- `ANDROID_KEYSTORE_BASE64` : contenu de `keystore.base64.txt`
- `ANDROID_KEYSTORE_PASSWORD` : mot de passe du keystore
- `ANDROID_KEY_ALIAS` : alias utilise pendant la creation
- `ANDROID_KEY_PASSWORD` : mot de passe de la cle

Une fois les secrets ajoutes, lancez le workflow avec :

- `target = all`
- `build_type = release`

Les artefacts attendus seront :

- `LiviGo-client-release`
- `LiviGo-driver-release`

### EAS

```bash
npm run eas:user
npm run eas:driver
```

### Assets

```bash
npm run icons
```

## Cibles mobiles

Le script `scripts/mobileify.js` prepare les builds Android selon la cible :

- `user` : application client
- `driver` : application conducteur

Il genere la configuration Capacitor adaptee avant le `sync`.
Le script `scripts/configure-android-signing.js` injecte la signature release
dans le projet Android genere a la volee par GitHub Actions.
Le script `scripts/encode-keystore.js` prepare la valeur base64 a coller dans
`ANDROID_KEYSTORE_BASE64`.

Pour le dev Expo/WebView, l'application utilise par defaut `http://10.0.2.2:5173`.
Si vous devez viser une autre machine ou un autre port, vous pouvez definir `APP_WEB_DEV_URL`
avant `expo start`.

## Etat actuel

Ce projet est adapte pour :

- iterer rapidement sur les ecrans ;
- demonstrer des parcours admin et mobile ;
- servir de base de refactor vers une vraie couche metier.

Ce projet n'est pas encore industrialise sur les sujets suivants :

- authentification reelle ;
- permissions serveur ;
- persistance backend ;
- tests automatises ;
- strategie mobile native avancee.

## Documentation complementaire

- Audit technique : `docs/rapport-audit-technique-livreur.md`

## Verification locale

Les verifications minimales a lancer avant livraison :

```bash
npm run lint
npm run build
```
