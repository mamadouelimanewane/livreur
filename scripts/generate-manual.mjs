/**
 * Génération du Manuel Utilisateur LiviGo - Format Word (.docx)
 * Utilise la bibliothèque `docx` (déjà installée)
 */

import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  Table, TableRow, TableCell, WidthType, AlignmentType,
  BorderStyle, ShadingType, PageBreak, TableOfContents,
  Header, Footer, PageNumber, PageNumberElement, NumberFormat, LevelFormat,
  convertInchesToTwip, convertMillimetersToTwip,
  ImageRun, HorizontalPositionAlign, VerticalPositionAlign,
} from 'docx'
import { writeFileSync } from 'fs'

// Couleurs LiviGo
const COLORS = {
  primary:    '4680ff',
  dark:       '1a1d2e',
  success:    '22c55e',
  warning:    'f59e0b',
  danger:     'ef4444',
  purple:     'a855f7',
  light:      'f8fafc',
  gray:       '64748b',
  border:     'e2e8f0',
  white:      'ffffff',
}

// Helpers
const h1 = (text) => new Paragraph({
  text, heading: HeadingLevel.HEADING_1,
  spacing: { before: 400, after: 200 },
  run: { color: COLORS.dark, bold: true },
})

const h2 = (text) => new Paragraph({
  text, heading: HeadingLevel.HEADING_2,
  spacing: { before: 300, after: 150 },
  run: { color: COLORS.primary },
})

const h3 = (text) => new Paragraph({
  text, heading: HeadingLevel.HEADING_3,
  spacing: { before: 200, after: 100 },
})

const para = (text, opts = {}) => new Paragraph({
  children: [new TextRun({ text, size: 22, color: '334155', ...opts })],
  spacing: { after: 120 },
})

const bullet = (text, level = 0) => new Paragraph({
  children: [new TextRun({ text, size: 21, color: '475569' })],
  bullet: { level },
  spacing: { after: 80 },
})

const badge = (text, color = COLORS.primary) => new TextRun({
  text: ` ${text} `,
  bold: true, size: 18,
  color: COLORS.white,
  highlight: 'cyan',
})

const separator = () => new Paragraph({
  border: { bottom: { color: COLORS.border, style: BorderStyle.SINGLE, size: 1 } },
  spacing: { before: 200, after: 200 },
  children: [],
})

const pageBreak = () => new Paragraph({ children: [new PageBreak()] })

const coloredPara = (text, color = COLORS.primary, bold = false) => new Paragraph({
  children: [new TextRun({ text, color, bold, size: 22 })],
  spacing: { after: 100 },
})

const featureRow = (feature, description, status = '✅') => new TableRow({
  children: [
    new TableCell({
      children: [new Paragraph({ children: [new TextRun({ text: feature, bold: true, size: 20, color: COLORS.dark })] })],
      shading: { type: ShadingType.SOLID, color: 'f1f5f9' },
      width: { size: 35, type: WidthType.PERCENTAGE },
    }),
    new TableCell({
      children: [new Paragraph({ children: [new TextRun({ text: description, size: 19, color: '475569' })] })],
      width: { size: 55, type: WidthType.PERCENTAGE },
    }),
    new TableCell({
      children: [new Paragraph({ children: [new TextRun({ text: status, size: 20 })] })],
      width: { size: 10, type: WidthType.PERCENTAGE },
    }),
  ],
})

const tableHeader = (...cols) => new TableRow({
  tableHeader: true,
  children: cols.map((col, i) => new TableCell({
    children: [new Paragraph({ children: [new TextRun({ text: col, bold: true, size: 20, color: COLORS.white })] })],
    shading: { type: ShadingType.SOLID, color: COLORS.primary },
    width: { size: Math.floor(100 / cols.length), type: WidthType.PERCENTAGE },
  })),
})

// ─────────────────────────────────────────────────────────────────────────────
// DOCUMENT PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────

const doc = new Document({
  title: 'Manuel Utilisateur LiviGo',
  description: 'Documentation complète de la plateforme LiviGo',
  creator: 'Mamadou Elimane Wane',
  keywords: 'LiviGo, mobilité, Dakar, admin, chauffeur, client',

  numbering: {
    config: [{
      reference: 'bullets',
      levels: [
        { level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
        { level: 1, format: LevelFormat.BULLET, text: '–', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 1080, hanging: 360 } } } },
      ],
    }],
  },

  styles: {
    default: {
      document: {
        run: { font: 'Calibri', size: 22, color: '334155' },
        paragraph: { spacing: { line: 276 } },
      },
    },
    paragraphStyles: [
      {
        id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal',
        run: { font: 'Calibri', size: 36, bold: true, color: COLORS.dark },
        paragraph: { spacing: { before: 480, after: 240 }, border: { bottom: { color: COLORS.primary, style: BorderStyle.SINGLE, size: 4 } } },
      },
      {
        id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal',
        run: { font: 'Calibri', size: 28, bold: true, color: COLORS.primary },
        paragraph: { spacing: { before: 360, after: 180 } },
      },
      {
        id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal',
        run: { font: 'Calibri', size: 24, bold: true, color: '1e293b' },
        paragraph: { spacing: { before: 240, after: 120 } },
      },
    ],
  },

  sections: [{
    properties: {
      page: {
        margin: {
          top: convertMillimetersToTwip(25),
          bottom: convertMillimetersToTwip(25),
          left: convertMillimetersToTwip(25),
          right: convertMillimetersToTwip(20),
        },
      },
    },

    headers: {
      default: new Header({
        children: [new Paragraph({
          children: [
            new TextRun({ text: '🚀 LiviGo — Manuel Utilisateur Complet', bold: true, size: 18, color: COLORS.primary }),
            new TextRun({ text: '     v2.0 — Mai 2026', size: 16, color: COLORS.gray }),
          ],
          border: { bottom: { color: COLORS.border, style: BorderStyle.SINGLE, size: 1 } },
        })],
      }),
    },

    footers: {
      default: new Footer({
        children: [new Paragraph({
          children: [
            new TextRun({ text: 'LiviGo — Plateforme de mobilité urbaine — Dakar, Sénégal  |  Page ', size: 18, color: COLORS.gray }),
            new PageNumberElement(),
          ],
          alignment: AlignmentType.CENTER,
          border: { top: { color: COLORS.border, style: BorderStyle.SINGLE, size: 1 } },
        })],
      }),
    },

    children: [

      // ═══════════════════════════════════════════════════════
      // PAGE DE COUVERTURE
      // ═══════════════════════════════════════════════════════
      new Paragraph({
        children: [new TextRun({ text: '', size: 10 })],
        spacing: { before: 2000 },
      }),
      new Paragraph({
        children: [new TextRun({ text: '🚀 LiviGo', size: 80, bold: true, color: COLORS.primary })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      }),
      new Paragraph({
        children: [new TextRun({ text: 'Manuel Utilisateur Complet', size: 48, bold: true, color: COLORS.dark })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 160 },
      }),
      new Paragraph({
        children: [new TextRun({ text: 'Plateforme de mobilité urbaine — Dakar, Sénégal', size: 28, color: COLORS.gray })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      }),
      new Paragraph({
        children: [new TextRun({ text: '─────────────────────────────────────────────', size: 24, color: COLORS.border })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 300 },
      }),
      ...[
        ['Version', 'v2.0 — Mai 2026'],
        ['Plateforme', 'Web Admin + Applications Mobiles Android'],
        ['Auteur', 'Mamadou Elimane Wane'],
        ['Email', 'support@livigo.sn'],
        ['Statut', '✅ Production Ready'],
      ].map(([k, v]) => new Paragraph({
        children: [
          new TextRun({ text: `${k} : `, bold: true, size: 22, color: COLORS.gray }),
          new TextRun({ text: v, size: 22, color: COLORS.dark }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
      })),

      pageBreak(),

      // ═══════════════════════════════════════════════════════
      // TABLE DES MATIÈRES (automatique)
      // ═══════════════════════════════════════════════════════
      new Paragraph({
        children: [new TextRun({ text: 'Table des Matières', size: 36, bold: true, color: COLORS.dark })],
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 300 },
      }),
      new TableOfContents('Table des Matières', {
        hyperlink: true,
        headingStyleRange: '1-3',
        stylesWithLevels: [
          { styleId: 'Heading1', level: 1 },
          { styleId: 'Heading2', level: 2 },
          { styleId: 'Heading3', level: 3 },
        ],
      }),

      pageBreak(),

      // ═══════════════════════════════════════════════════════
      // 1. PRÉSENTATION DE LA PLATEFORME
      // ═══════════════════════════════════════════════════════
      h1('1. Présentation de la Plateforme LiviGo'),

      para('LiviGo est une plateforme complète de mobilité urbaine développée pour le marché sénégalais. Elle connecte les passagers/clients avec des conducteurs de moto-taxi, taxis, et services de livraison via une interface web d\'administration et des applications mobiles Android natives.'),

      h2('1.1 Architecture Technique'),
      para('La plateforme repose sur une architecture moderne multi-couches :'),
      bullet('Frontend Web Admin : React 19 + Vite 8 + React Router 6'),
      bullet('Backend : Supabase (PostgreSQL + Realtime + Auth)'),
      bullet('Applications Mobiles : Capacitor + Android (APK natif)'),
      bullet('Cartographie : Leaflet / OpenStreetMap'),
      bullet('Paiements : Orange Money, Wave, Free Money'),
      bullet('Push Notifications : Firebase Cloud Messaging (FCM)'),

      h2('1.2 Trois Applications Distinctes'),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          tableHeader('Application', 'Utilisateurs', 'Plateforme', 'Fonctions clés'),
          featureRow('LiviGo Admin', 'Administrateurs', 'Web + Mobile', 'Gestion complète de la plateforme'),
          featureRow('LiviGo Utilisateur', 'Clients', 'Android', 'Commander des courses et livraisons'),
          featureRow('LiviGo Conducteur', 'Chauffeurs', 'Android', 'Gérer les courses et les revenus'),
        ],
      }),

      separator(),

      // ═══════════════════════════════════════════════════════
      // 2. BACKOFFICE ADMINISTRATEUR
      // ═══════════════════════════════════════════════════════
      pageBreak(),
      h1('2. Backoffice Administrateur Web'),
      para('L\'interface d\'administration est accessible via navigateur web. Elle offre une vue complète de la plateforme avec des outils de gestion avancés.'),

      h2('2.1 Connexion et Authentification'),
      para('Accès : https://livigo.sn/login ou sur localhost:5173 en développement'),
      bullet('Email : admin@livigo.com'),
      bullet('Mot de passe : admin123 (environnement de démonstration)'),
      bullet('Authentification Supabase avec fallback mock pour la démo'),
      bullet('Session persistante via localStorage'),
      bullet('Déconnexion automatique après inactivité'),

      h2('2.2 Tableau de Bord (Dashboard)'),
      para('Page principale affichant les indicateurs clés en temps réel :'),
      bullet('Statistiques de courses actives, complétées, annulées'),
      bullet('Nombre de conducteurs en ligne et disponibles'),
      bullet('Revenus de la journée, de la semaine, du mois'),
      bullet('Graphiques de tendances (courses par heure/jour)'),
      bullet('Carte temps réel des conducteurs actifs'),
      bullet('Flux d\'activité récente'),
      bullet('Indicateur "Live" si la base de données est connectée'),

      h2('2.3 Gestion des Conducteurs'),
      para('Section complète pour gérer les chauffeurs inscrits sur la plateforme :'),

      h3('2.3.1 Liste des Conducteurs'),
      bullet('Tous les conducteurs avec pagination fonctionnelle (50 par page)'),
      bullet('Filtres : zone, statut, véhicule, recherche par nom/téléphone'),
      bullet('Export CSV des données'),
      bullet('Actions rapides : voir profil, approuver, rejeter'),

      h3('2.3.2 Statuts des Conducteurs'),
      bullet('Conducteurs en ligne / hors ligne en temps réel'),
      bullet('Statut de disponibilité (disponible / en course)'),
      bullet('Dernière position GPS'),
      bullet('Temps de connexion de la journée'),

      h3('2.3.3 Validation et KYC'),
      para('Le système de vérification d\'identité LiviProtect comprend :'),
      bullet('Documents requis : CNI, Permis de conduire, Photo du véhicule, Selfie'),
      bullet('Score IA de correspondance du selfie (0-100%)'),
      bullet('Score de risque LiviProtect (0-100)'),
      bullet('Actions : Approuver / Rejeter en un clic'),
      bullet('Filtres : En attente / Approuvés / Rejetés'),

      h3('2.3.4 Documents'),
      bullet('Documents proches d\'expiration (alerte 30 jours avant)'),
      bullet('Documents expirés avec blocage automatique'),
      bullet('Historique des renouvellements'),

      h3('2.3.5 Bonus Conducteurs'),
      bullet('Objectifs de performance (courses/semaine, note min.)'),
      bullet('Bonus automatiques selon les seuils atteints'),
      bullet('Classement des meilleurs conducteurs'),
      bullet('Historique des bonus versés'),

      h2('2.4 Gestion des Utilisateurs'),
      bullet('Liste complète des clients inscrits'),
      bullet('Historique des courses par utilisateur'),
      bullet('Solde LiviWallet et transactions'),
      bullet('Points LiviStars et niveau de fidélité'),
      bullet('Signalement et blocage de comptes'),

      h2('2.5 Gestion des Courses'),
      para('Accessible pour deux types de service : Livraison et Taxi'),

      h3('2.5.1 Types de Courses'),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          tableHeader('Statut', 'Description', 'Actions disponibles'),
          featureRow('En cours', 'Courses actives en ce moment', 'Voir sur carte, intervenir'),
          featureRow('Terminées', 'Courses complétées', 'Voir reçu PDF, noter'),
          featureRow('Annulées', 'Courses annulées', 'Voir raison, rembourser'),
          featureRow('Échouées', 'Non assignées ou erreur technique', 'Relancer, analyser'),
          featureRow('Auto-annulées', 'Annulées par timeout système', 'Analyser cause'),
          featureRow('Toutes', 'Vue complète toutes catégories', 'Filtrer, exporter'),
        ],
      }),

      h3('2.5.2 Reçu PDF'),
      bullet('Bouton d\'impression disponible sur les courses terminées'),
      bullet('Reçu formaté avec logo LiviGo'),
      bullet('Informations : ID, date, trajet, conducteur, montant, mode de paiement'),
      bullet('Impression directe depuis le navigateur'),

      h2('2.6 Dispatch Manuel'),
      para('L\'opérateur peut assigner des courses manuellement depuis cette page :'),
      bullet('Formulaire de course : type, client, départ, arrivée, notes'),
      bullet('Estimation automatique du prix (Nominatim OSM)'),
      bullet('Liste des conducteurs disponibles filtrés par zone'),
      bullet('Bouton "Auto-Dispatch IA" : algorithme Haversine + scoring'),
      bullet('Sélection manuelle d\'un conducteur avec sa note et distance'),
      bullet('Score auto-dispatch : Distance (50%) + Note (30%) + Taux acceptation (20%)'),

      h2('2.7 Surge Pricing Dynamique'),
      para('Gestion des multiplicateurs de tarif selon la demande :'),
      bullet('Zones de Dakar avec niveau de demande en temps réel'),
      bullet('Multiplicateurs disponibles : ×1.0 à ×3.0'),
      bullet('Activation manuelle par zone avec durée (15 min à 4h)'),
      bullet('Règles automatiques : Heure de pointe matin (×1.5), Soir (×1.7), Nuit (×1.3)'),
      bullet('Aperçu du prix : "1 500 FCFA devient X FCFA"'),
      bullet('Tableau de bord : zones actives, surge max, revenu estimé'),

      h2('2.8 LiviWallet — Portefeuille Numérique'),
      para('Système de portefeuille intégré pour les utilisateurs :'),
      bullet('Solde en temps réel'),
      bullet('Recharge via Orange Money, Wave, Free Money'),
      bullet('Flux en 3 étapes : Choix opérateur → Montant → Confirmation → Succès'),
      bullet('Historique des transactions (recharges, paiements, bonus)'),
      bullet('Profil de fidélité intégré avec progression LiviStars'),

      h2('2.9 LiviStars — Programme de Fidélité'),
      para('Programme de fidélité à 5 niveaux pour récompenser les clients réguliers :'),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          tableHeader('Niveau', 'Points requis', 'Réduction', 'Avantages'),
          featureRow('🥉 Bronze', '0 pts', '0%', 'Accès au programme'),
          featureRow('🥈 Argent', '500 pts', '5%', 'Réduction sur chaque course'),
          featureRow('🥇 Or', '1 500 pts', '10%', 'Priorité dispatch + réduction'),
          featureRow('💎 Platine', '4 000 pts', '15%', 'Support prioritaire + réductions'),
          featureRow('👑 Diamant', '10 000 pts', '20%', 'Tous avantages + accès VIP'),
        ],
      }),
      bullet('Classement Top 10 clients (leaderboard)'),
      bullet('Distribution par niveau (graphique barres)'),
      bullet('Points gagnés : 1 FCFA = 1 point'),

      h2('2.10 Parrainage & Referral'),
      bullet('Lien de parrainage unique par utilisateur'),
      bullet('Bonus parrain : 1 000 FCFA à l\'inscription du filleul'),
      bullet('Bonus filleul : 500 FCFA sur première course'),
      bullet('Suivi : historique, statut (complété/en attente/expiré)'),
      bullet('Configuration éditable : montants, courses min., validité (30 jours)'),
      bullet('Top 5 parrains avec classement'),

      h2('2.11 Alertes SOS Actives'),
      para('Système de sécurité temps réel LiviProtect :'),
      bullet('Bannière d\'urgence rouge si alertes actives'),
      bullet('Carte SOS avec : type d\'urgence, utilisateur, course, localisation GPS'),
      bullet('Lien "Voir sur carte" (OpenStreetMap) pour intervention rapide'),
      bullet('Chronomètre "il y a X min" depuis le déclenchement'),
      bullet('Actions : Appeler l\'utilisateur / Marquer comme résolu'),
      bullet('Types : Urgence, Accident, Comportement suspect, Autre'),

      h2('2.12 Carte Thermique Prédictive'),
      para('Analyse de la demande géographique avec IA LiviBrain :'),
      bullet('Carte Leaflet temps réel centrée sur Dakar'),
      bullet('Cercles colorés selon l\'intensité (rouge ≥80%, orange 60-79%, jaune 40-59%, vert <40%)'),
      bullet('Tooltips permanents sur zones actives'),
      bullet('Filtres : Aujourd\'hui / Cette semaine / Ce mois'),
      bullet('Prédictions LiviBrain : 5 prévisions horodatées avec % de confiance'),
      bullet('Classement des 12 zones par ordre d\'activité'),

      h2('2.13 Rapports et Analytics'),
      para('4 types de rapports disponibles :'),
      bullet('Rapport Financier : revenus, commissions, remboursements'),
      bullet('Rapport Opérationnel : courses par période, taux annulation, temps moyen'),
      bullet('Rapport Conducteurs : performance, gains, notes moyennes'),
      bullet('Tableau de bord Live : carte temps réel + flux d\'événements'),

      h2('2.14 Configuration et Paramètres'),
      para('Paramétrage complet de la plateforme :'),
      bullet('Pays, zones de service, documents requis'),
      bullet('Cartes de prix par service et véhicule'),
      bullet('Codes promo avec date d\'expiration et plafond'),
      bullet('Courses planifiées (récurrences hebdomadaires)'),
      bullet('Configuration email, SMS, notifications push (FCM)'),
      bullet('Raisons d\'annulation personnalisables'),
      bullet('Méthodes de paiement activées'),
      bullet('Gestion des administrateurs et rôles'),

      separator(),

      // ═══════════════════════════════════════════════════════
      // 3. APPLICATION MOBILE CLIENT
      // ═══════════════════════════════════════════════════════
      pageBreak(),
      h1('3. Application Mobile — LiviGo Utilisateur'),
      para('L\'application Android pour les clients permet de commander des courses et des livraisons facilement depuis un smartphone.'),

      h2('3.1 Installation'),
      bullet('Télécharger le fichier LiviGo-Utilisateur.apk depuis le lien fourni'),
      bullet('Activer "Sources inconnues" dans Paramètres → Sécurité'),
      bullet('Ouvrir le fichier APK et suivre les instructions d\'installation'),
      bullet('Connexion avec numéro de téléphone ou email'),

      h2('3.2 Écran d\'Accueil'),
      bullet('Carte interactive avec position actuelle'),
      bullet('Conducteurs disponibles à proximité (marqueurs sur la carte)'),
      bullet('Bouton "Commander maintenant" central'),
      bullet('Historique des derniers trajets rapides'),
      bullet('Solde LiviWallet affiché en haut'),
      bullet('Niveau LiviStars et points accumulés'),

      h2('3.3 Commander une Course'),
      bullet('Saisir le point de départ (GPS automatique ou manuel)'),
      bullet('Saisir la destination (autocomplétion Nominatim)'),
      bullet('Choisir le type de service : Moto Taxi, Taxi Premium, Livraison Express, Livraison Alimentaire'),
      bullet('Voir l\'estimation du prix avant confirmation'),
      bullet('Prix incluant le surge pricing si actif'),
      bullet('Confirmer la commande → Assignation automatique du conducteur'),
      bullet('Suivi en temps réel du conducteur sur la carte'),
      bullet('ETA (temps d\'arrivée estimé)'),

      h2('3.4 Suivi de Course'),
      bullet('Carte temps réel avec position du conducteur'),
      bullet('Chat intégré avec le conducteur'),
      bullet('Bouton d\'appel direct'),
      bullet('Bouton SOS d\'urgence'),
      bullet('Partage de trajet (Safety Share) avec un contact'),
      bullet('Statut : Conducteur en route → Arrivé → En course → Terminé'),

      h2('3.5 Paiement'),
      bullet('Modes disponibles : Cash, LiviWallet, Orange Money, Wave'),
      bullet('Application automatique de la réduction LiviStars'),
      bullet('Code promo applicable avant paiement'),
      bullet('Reçu envoyé par notification push'),

      h2('3.6 Évaluation Post-Course'),
      bullet('Note de 1 à 5 étoiles pour le conducteur'),
      bullet('Commentaire optionnel'),
      bullet('Points LiviStars crédités automatiquement'),
      bullet('Option de signalement de comportement inapproprié'),

      h2('3.7 Mon Profil'),
      bullet('Informations personnelles'),
      bullet('Historique complet des courses'),
      bullet('LiviWallet : solde, recharges, transactions'),
      bullet('Programme LiviStars : niveau, points, avantages'),
      bullet('Code de parrainage personnel'),
      bullet('Notifications push personnalisables'),

      separator(),

      // ═══════════════════════════════════════════════════════
      // 4. APPLICATION MOBILE CONDUCTEUR
      // ═══════════════════════════════════════════════════════
      pageBreak(),
      h1('4. Application Mobile — LiviGo Conducteur'),
      para('L\'application dédiée aux chauffeurs pour accepter les courses, gérer leurs revenus et optimiser leur temps de travail.'),

      h2('4.1 Installation'),
      bullet('Télécharger le fichier LiviGo-Conducteur.apk depuis le lien fourni'),
      bullet('Activer "Sources inconnues" dans Paramètres → Sécurité'),
      bullet('Ouvrir le fichier APK et suivre les instructions'),
      bullet('Connexion avec les identifiants fournis par l\'administrateur'),

      h2('4.2 Inscription et Validation KYC'),
      bullet('Formulaire d\'inscription : nom, téléphone, véhicule, zone'),
      bullet('Upload des documents requis : CNI, Permis, Photo véhicule, Selfie'),
      bullet('Analyse IA du selfie pour correspondance avec la CNI'),
      bullet('Délai de validation : 24h maximum'),
      bullet('Notification push à l\'approbation'),

      h2('4.3 Tableau de Bord Conducteur'),
      bullet('Basculer en ligne / hors ligne (toggle principal)'),
      bullet('Gains du jour, de la semaine, du mois'),
      bullet('Nombre de courses effectuées'),
      bullet('Note moyenne (sur 5 étoiles)'),
      bullet('Taux d\'acceptation des courses'),
      bullet('Prochains objectifs bonus à atteindre'),

      h2('4.4 Réception et Gestion des Courses'),
      bullet('Notification push pour chaque nouvelle demande'),
      bullet('Son d\'alerte configurable'),
      bullet('Détails de la course : départ, arrivée, prix estimé, distance'),
      bullet('Temps limite de réponse : 30 secondes'),
      bullet('Accepter / Refuser avec raison'),
      bullet('Navigation GPS intégrée vers le client'),
      bullet('Bouton "Arrivé" pour signaler la présence'),
      bullet('Bouton "Démarrer la course" et "Terminer"'),

      h2('4.5 Revenus et Retraits'),
      bullet('Solde disponible pour retrait'),
      bullet('Historique des gains par course'),
      bullet('Demande de retrait : Orange Money, Wave, Virement'),
      bullet('Délai de traitement : 24-48h ouvrées'),
      bullet('Commission LiviGo : configurable (défaut 15%)'),
      bullet('Bonus de performance crédités automatiquement'),

      h2('4.6 Carte et Navigation'),
      bullet('Carte temps réel avec position GPS'),
      bullet('Zones à forte demande (heatmap visible)'),
      bullet('Zones de surge pricing actives (alertes)'),
      bullet('Itinéraire optimisé vers le client'),
      bullet('Historique des zones les plus rentables'),

      h2('4.7 Profil et Documents'),
      bullet('Informations personnelles et du véhicule'),
      bullet('Date d\'expiration des documents (alertes automatiques)'),
      bullet('Renouvellement de documents depuis l\'app'),
      bullet('Note globale et commentaires des clients'),
      bullet('Statut de certification LiviProtect'),

      separator(),

      // ═══════════════════════════════════════════════════════
      // 5. FONCTIONNALITÉS UBER-GRADE
      // ═══════════════════════════════════════════════════════
      pageBreak(),
      h1('5. Fonctionnalités Uber-Grade Avancées'),
      para('LiviGo intègre des fonctionnalités de niveau entreprise comparables aux meilleures plateformes mondiales.'),

      h2('5.1 LiviBrain — Intelligence Artificielle'),
      bullet('Prédiction de la demande par zone et par heure'),
      bullet('Algorithme de dispatch automatique (scoring multicritères)'),
      bullet('Analyse des patterns de trafic pour optimisation'),
      bullet('Détection d\'anomalies (fraude, comportements suspects)'),
      bullet('Recommandations de zones pour les conducteurs'),

      h2('5.2 LiviProtect — Sécurité Intégrée'),
      bullet('Bouton SOS d\'urgence disponible 24h/24'),
      bullet('Déclenchement d\'alerte avec envoi automatique de la position GPS'),
      bullet('Safety Share : partager le trajet en temps réel avec un proche'),
      bullet('Vérification d\'identité KYC avec analyse IA du selfie'),
      bullet('Score de risque calculé à l\'inscription'),
      bullet('Signalement de comportement dangereux'),
      bullet('Tableau de bord admin des alertes SOS actives'),

      h2('5.3 LiviVoice — Interface Vocale Multilingue'),
      bullet('Support Wolof et Français dans l\'interface'),
      bullet('Commandes vocales pour la navigation'),
      bullet('Notifications audio dans la langue choisie'),
      bullet('Adapté au contexte sénégalais'),

      h2('5.4 LiviGreen — Éco-Responsabilité'),
      bullet('Score carbone par trajet (CO₂ économisé vs voiture solo)'),
      bullet('Préférence pour les véhicules électriques et motos'),
      bullet('Rapport mensuel d\'impact environnemental'),
      bullet('Badge "Utilisateur Éco" pour les trajets partagés'),

      h2('5.5 LiviShare — Covoiturage'),
      bullet('Partage de course entre plusieurs passagers'),
      bullet('Réduction du coût jusqu\'à 40%'),
      bullet('Matching intelligent par itinéraire'),
      bullet('Évaluation séparée pour chaque passager'),

      h2('5.6 LiviFlex — Crédit de Mobilité'),
      bullet('Avance sur course pour utilisateurs vérifiés'),
      bullet('Remboursement automatique à la prochaine transaction'),
      bullet('Limite de crédit évolutive selon l\'historique'),
      bullet('Intégration avec les opérateurs de microfinance'),

      h2('5.7 LiviCommunity — Analytics Communautaires'),
      bullet('Statistiques d\'utilisation par quartier et par commune'),
      bullet('Rapport de mobilité urbaine mensuel'),
      bullet('Données anonymisées pour les collectivités'),
      bullet('Dashboard partenaires (mairies, entreprises)'),

      separator(),

      // ═══════════════════════════════════════════════════════
      // 6. GUIDE TECHNIQUE — BUILD APK
      // ═══════════════════════════════════════════════════════
      pageBreak(),
      h1('6. Guide Technique — Build des APK'),

      h2('6.1 Prérequis'),
      bullet('Node.js v22+ et npm v10+'),
      bullet('JDK 21 (OpenJDK ou Oracle)'),
      bullet('Android SDK (API Level 36)'),
      bullet('Capacitor CLI v8+'),
      bullet('Compte GitHub avec accès au repository mamadouelimanewane/livreur'),

      h2('6.2 Build via GitHub Actions (Recommandé)'),
      para('La méthode la plus simple : déclencher le workflow depuis GitHub.'),
      bullet('Aller sur : https://github.com/mamadouelimanewane/livreur/actions'),
      bullet('Sélectionner "Android APK Build"'),
      bullet('Cliquer "Run workflow"'),
      bullet('Paramètres : target=all, build_type=debug (ou release)'),
      bullet('Télécharger les APK dans les artefacts après ~5 minutes'),

      h2('6.3 Build en Ligne de Commande'),
      para('Depuis le répertoire du projet :'),

      new Paragraph({
        children: [new TextRun({
          text: '# APK Utilisateur\nnpm run mobile:user\n\n# APK Conducteur\nnpm run mobile:driver',
          size: 18, font: 'Courier New', color: '1e293b',
        })],
        shading: { type: ShadingType.SOLID, color: 'f1f5f9' },
        border: { left: { color: COLORS.primary, style: BorderStyle.SINGLE, size: 6 } },
        indent: { left: 360 },
        spacing: { before: 120, after: 120 },
      }),

      h2('6.4 Build via GitHub CLI'),
      new Paragraph({
        children: [new TextRun({
          text: 'gh workflow run android-build.yml \\\n  --repo mamadouelimanewane/livreur \\\n  -f target=all \\\n  -f build_type=debug',
          size: 18, font: 'Courier New', color: '1e293b',
        })],
        shading: { type: ShadingType.SOLID, color: 'f1f5f9' },
        border: { left: { color: COLORS.primary, style: BorderStyle.SINGLE, size: 6 } },
        indent: { left: 360 },
        spacing: { before: 120, after: 120 },
      }),

      h2('6.5 Localisation des APK Générés'),
      bullet('GitHub Actions → Onglet Artifacts → LiviGo-user-debug.apk'),
      bullet('GitHub Actions → Onglet Artifacts → LiviGo-driver-debug.apk'),
      bullet('En local : android/app/build/outputs/apk/release/app-release.apk'),

      separator(),

      // ═══════════════════════════════════════════════════════
      // 7. CONFIGURATION SUPABASE
      // ═══════════════════════════════════════════════════════
      pageBreak(),
      h1('7. Configuration et Déploiement'),

      h2('7.1 Variables d\'Environnement'),
      para('Créer un fichier .env à la racine du projet :'),
      new Paragraph({
        children: [new TextRun({
          text: 'VITE_SUPABASE_URL=https://VOTRE_PROJECT.supabase.co\nVITE_SUPABASE_ANON_KEY=votre_anon_key\nVITE_FIREBASE_API_KEY=votre_firebase_key\nVITE_FIREBASE_PROJECT_ID=votre_project_id\nVITE_FIREBASE_VAPID_KEY=votre_vapid_key',
          size: 18, font: 'Courier New', color: '1e293b',
        })],
        shading: { type: ShadingType.SOLID, color: 'f1f5f9' },
        border: { left: { color: COLORS.warning, style: BorderStyle.SINGLE, size: 6 } },
        indent: { left: 360 },
        spacing: { before: 120, after: 120 },
      }),

      h2('7.2 Tables Supabase Requises'),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          tableHeader('Table', 'Description', 'Colonnes principales'),
          featureRow('drivers', 'Profils des conducteurs', 'id, name, phone, status, rating, zone'),
          featureRow('rides', 'Historique des courses', 'id, driver_id, status, price, pickup, dropoff'),
          featureRow('users', 'Profils des clients', 'id, name, phone, wallet_balance, loyalty_points'),
          featureRow('ratings', 'Évaluations bidirectionnelles', 'id, ride_id, from_user, to_driver, rating'),
          featureRow('wallets', 'Portefeuilles numériques', 'id, user_id, balance, currency'),
          featureRow('wallet_transactions', 'Historique transactions', 'id, wallet_id, amount, type, status'),
          featureRow('loyalty_points', 'Points de fidélité', 'id, user_id, points, event_type'),
          featureRow('referrals', 'Parrainages', 'id, referrer_id, referred_id, status, bonus'),
          featureRow('sos_alerts', 'Alertes SOS', 'id, user_id, ride_id, type, location_lat/lon'),
          featureRow('kyc_verifications', 'Vérifications identité', 'id, driver_id, status, selfie_match, risk_score'),
          featureRow('surge_pricing', 'Tarification dynamique', 'id, zone, multiplier, label, expires_at'),
          featureRow('device_tokens', 'Tokens FCM', 'id, user_id, token, device_type'),
        ],
      }),

      h2('7.3 Déploiement Web (Vercel)'),
      bullet('URL de production : https://livreur-*.vercel.app'),
      bullet('Variables d\'environnement à configurer dans le dashboard Vercel'),
      bullet('Déploiement automatique à chaque push sur main'),
      bullet('vercel.json configure les redirections SPA'),

      separator(),

      // ═══════════════════════════════════════════════════════
      // 8. LISTE COMPLÈTE DES FONCTIONNALITÉS
      // ═══════════════════════════════════════════════════════
      pageBreak(),
      h1('8. Inventaire Complet des Fonctionnalités'),

      h2('8.1 Administration Web — 45+ Fonctionnalités'),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          tableHeader('Module', 'Fonctionnalité', 'Statut'),
          featureRow('Dashboard', 'KPIs temps réel (courses, revenus, conducteurs)', '✅'),
          featureRow('Dashboard', 'Graphiques de tendances (7 jours)', '✅'),
          featureRow('Dashboard', 'Indicateur connexion DB live', '✅'),
          featureRow('Conducteurs', 'Liste avec pagination (50/page)', '✅'),
          featureRow('Conducteurs', 'Filtres multi-critères + recherche', '✅'),
          featureRow('Conducteurs', 'Profil détaillé avec stats et sécurité', '✅'),
          featureRow('Conducteurs', 'Approbation / Rejet avec DB Supabase', '✅'),
          featureRow('KYC', 'Vérification documents + score IA selfie', '✅'),
          featureRow('KYC', 'Score de risque LiviProtect', '✅'),
          featureRow('Bonus', 'Objectifs et bonus de performance', '✅'),
          featureRow('Courses', '6 statuts × 2 services (Delivery + Taxi)', '✅'),
          featureRow('Courses', 'Reçu PDF imprimable', '✅'),
          featureRow('Courses', 'Filtres et recherche', '✅'),
          featureRow('Dispatch', 'Formulaire manuel avec estimation', '✅'),
          featureRow('Dispatch', 'Auto-Dispatch IA (Haversine + scoring)', '✅'),
          featureRow('Surge', 'Activation manuelle par zone', '✅'),
          featureRow('Surge', 'Règles automatiques heure de pointe', '✅'),
          featureRow('Wallet', 'Recharge Orange Money / Wave / Free', '✅'),
          featureRow('Wallet', 'Historique transactions', '✅'),
          featureRow('Fidélité', 'Programme 5 niveaux LiviStars', '✅'),
          featureRow('Fidélité', 'Leaderboard + distribution niveaux', '✅'),
          featureRow('Parrainage', 'Suivi filleuls et bonus', '✅'),
          featureRow('Parrainage', 'Configuration éditable', '✅'),
          featureRow('SOS', 'Alertes actives avec intervalle temps réel', '✅'),
          featureRow('SOS', 'Résolution en un clic', '✅'),
          featureRow('Heatmap', 'Carte Leaflet avec cercles intensité', '✅'),
          featureRow('Heatmap', 'Prédictions LiviBrain IA', '✅'),
          featureRow('Analytics', 'Rapports financiers et opérationnels', '✅'),
          featureRow('Analytics', 'Tableau de bord live', '✅'),
          featureRow('Paramètres', 'Configuration complète plateforme', '✅'),
          featureRow('Contenu', 'Pages CMS, chaînes d\'application', '✅'),
          featureRow('Notifications', 'FCM avec types et templates', '✅'),
        ],
      }),

      h2('8.2 App Mobile Client — 20+ Fonctionnalités'),
      bullet('Connexion par numéro de téléphone / email'),
      bullet('Commande de course avec estimation de prix'),
      bullet('4 types de service (Moto, Taxi, Livraison express, Alimentaire)'),
      bullet('Suivi GPS en temps réel du conducteur'),
      bullet('Chat conducteur intégré'),
      bullet('Paiement multi-méthodes (Cash, Wallet, Mobile Money)'),
      bullet('Bouton SOS d\'urgence'),
      bullet('Safety Share — partage de trajet'),
      bullet('Évaluation post-course (1-5 étoiles)'),
      bullet('LiviWallet avec historique'),
      bullet('Programme LiviStars avec progression'),
      bullet('Code de parrainage personnel'),
      bullet('Historique courses + reçus'),
      bullet('Notifications push personnalisées'),
      bullet('Interface Wolof / Français'),
      bullet('Score carbone LiviGreen'),
      bullet('LiviShare covoiturage'),

      h2('8.3 App Mobile Conducteur — 20+ Fonctionnalités'),
      bullet('Toggle en ligne / hors ligne'),
      bullet('Réception de courses avec son d\'alerte'),
      bullet('Navigation GPS intégrée'),
      bullet('Gains en temps réel (jour/semaine/mois)'),
      bullet('Historique courses avec détails'),
      bullet('Demande de retrait'),
      bullet('Upload et suivi des documents KYC'),
      bullet('Alertes expiration documents'),
      bullet('Carte heatmap zones rentables'),
      bullet('Alertes zones surge pricing'),
      bullet('Note globale et commentaires clients'),
      bullet('Bonus et objectifs de performance'),
      bullet('Statut de certification LiviProtect'),
      bullet('Chat client intégré'),
      bullet('Rapport de performance hebdomadaire'),

      separator(),

      // ═══════════════════════════════════════════════════════
      // 9. SUPPORT ET CONTACT
      // ═══════════════════════════════════════════════════════
      pageBreak(),
      h1('9. Support et Contact'),

      h2('9.1 Informations de Contact'),
      bullet('Email support : support@livigo.sn'),
      bullet('Téléphone : +221 33 000 00 00'),
      bullet('Site web : https://livigo.sn'),
      bullet('Repository GitHub : https://github.com/mamadouelimanewane/livreur'),
      bullet('Déploiement Vercel : https://livreur-*.vercel.app'),

      h2('9.2 Identifiants de Démonstration'),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          tableHeader('Rôle', 'Email', 'Mot de passe'),
          featureRow('Administrateur', 'admin@livigo.com', 'admin123'),
          featureRow('Conducteur', 'driver@livigo.com', 'driver123'),
          featureRow('Client', 'user@livigo.com', 'user123'),
        ],
      }),

      h2('9.3 Compatibilité'),
      bullet('Navigateurs web : Chrome 100+, Firefox 100+, Edge 100+, Safari 16+'),
      bullet('Android : Version 8.0 (API 26) minimum, recommandé Android 12+'),
      bullet('Résolution mobile : 360×800px minimum'),
      bullet('Connexion : 3G minimum, recommandé 4G/WiFi'),

      new Paragraph({ children: [new TextRun({ text: '' })], spacing: { before: 800 } }),
      new Paragraph({
        children: [new TextRun({ text: '© 2026 LiviGo — Tous droits réservés | Mamadou Elimane Wane', size: 18, color: COLORS.gray })],
        alignment: AlignmentType.CENTER,
        border: { top: { color: COLORS.border, style: BorderStyle.SINGLE, size: 1 } },
        spacing: { before: 200 },
      }),
    ],
  }],
})

// ─────────────────────────────────────────────────────────────────────────────
// GÉNÉRATION DU FICHIER
// ─────────────────────────────────────────────────────────────────────────────

console.log('📄 Génération du manuel Word LiviGo...')

const buffer = await Packer.toBuffer(doc)
writeFileSync('Manuel_LiviGo_Complet.docx', buffer)

console.log('✅ Manuel généré avec succès : Manuel_LiviGo_Complet.docx')
console.log(`   Taille : ${(buffer.length / 1024).toFixed(1)} KB`)
console.log('')
console.log('   Sections couvertes :')
console.log('   1. Présentation de la plateforme')
console.log('   2. Backoffice Administrateur (14 modules)')
console.log('   3. Application Mobile Client (20+ fonctionnalités)')
console.log('   4. Application Mobile Conducteur (20+ fonctionnalités)')
console.log('   5. Fonctionnalités Uber-Grade (7 innovations)')
console.log('   6. Guide Technique Build APK')
console.log('   7. Configuration et Déploiement')
console.log('   8. Inventaire complet (45+ fonctionnalités admin)')
console.log('   9. Support et Contact')
