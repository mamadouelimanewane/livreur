export const DRIVER_STATUS_STYLES = {
  'Approuvé': { color: '#2ed8a3', bg: '#e6faf4' },
  'En attente': { color: '#ffb64d', bg: '#fff8ee' },
  'Rejeté': { color: '#ff5370', bg: '#fff0f3' },
  'Actif': { color: '#2ed8a3', bg: '#e6faf4' },
  'Inactif': { color: '#ff5370', bg: '#fff0f3' },
}

export const USER_STATUS_STYLES = {
  'Actif': { color: '#2ed8a3', bg: '#e6faf4' },
  'Inactif': { color: '#ff5370', bg: '#fff0f3' },
}

export const SUPPORT_TICKET_PRIORITY_STYLES = {
  'Haute': { color: '#ff5370', bg: '#fff0f3' },
  'Moyenne': { color: '#ffb64d', bg: '#fff8ee' },
  'Basse': { color: '#2ed8a3', bg: '#e6faf4' },
}

export const SUPPORT_TICKET_STATUS_STYLES = {
  'Ouvert': { color: '#ff5370', bg: '#fff0f3' },
  'En traitement': { color: '#ffb64d', bg: '#fff8ee' },
  'Résolu': { color: '#2ed8a3', bg: '#e6faf4' },
}

export const RIDE_STATUS_CONFIG = {
  'Terminée': { color: '#2ed8a3', bg: '#e6faf4' },
  'En cours': { color: '#4680ff', bg: '#ebf4ff' },
  'Annulée': { color: '#ff5370', bg: '#fff0f3' },
  'Échouée': { color: '#6f42c1', bg: '#f3eeff' },
  'Auto-annulée': { color: '#ffb64d', bg: '#fff8ee' },
}

export const RIDE_TYPE_FILTER = {
  active: ['En cours'],
  completed: ['Terminée'],
  cancelled: ['Annulée'],
  failed: ['Échouée'],
  'auto-cancelled': ['Auto-annulée'],
  all: Object.keys(RIDE_STATUS_CONFIG),
}

export const DELIVERY_RIDE_TITLES = {
  active: 'Courses en cours',
  completed: 'Courses terminées',
  cancelled: 'Courses annulées',
  failed: 'Courses échouées',
  'auto-cancelled': 'Courses auto-annulées',
  all: 'Toutes les courses (Livraison)',
}

export const TAXI_RIDE_TITLES = {
  active: 'Courses taxi en cours',
  completed: 'Courses taxi terminées',
  cancelled: 'Courses taxi annulées',
  failed: 'Courses taxi échouées',
  'auto-cancelled': 'Courses taxi auto-annulées',
  all: 'Toutes les courses (Taxi)',
}

export const MOCK_DRIVERS = [
  { id: 'DRV-001', name: 'Oumar Sall', phone: '+221 77 100 22 33', email: 'oumar.sall@gmail.com', zone: 'Dakar Centre', vehicle: 'Moto', vehicleType: 'Moto', brand: 'Yamaha', plate: 'DK-1234-AB', year: 2021, rides: 48, amount: '24 500 FCFA', registered: '05/01/2024', status: 'Approuvé' },
  { id: 'DRV-002', name: 'Cheikh Fall', phone: '+221 76 200 33 44', email: 'cheikh.fall@yahoo.fr', zone: 'Plateau', vehicle: 'Voiture', vehicleType: 'Voiture', brand: 'Toyota', plate: 'DK-5678-CD', year: 2019, rides: 32, amount: '16 200 FCFA', registered: '10/01/2024', status: 'En attente' },
  { id: 'DRV-003', name: 'Ibrahima Ba', phone: '+221 70 300 44 55', email: 'ibrahima.ba@gmail.com', zone: 'Parcelles Assainies', vehicle: 'Moto', vehicleType: 'Moto', brand: 'Honda', plate: 'DK-9012-EF', year: 2022, rides: 61, amount: '30 750 FCFA', registered: '15/01/2024', status: 'Approuvé' },
  { id: 'DRV-004', name: 'Seydou Diop', phone: '+221 77 400 55 66', email: 'seydou.diop@gmail.com', zone: 'Guédiawaye', vehicle: 'Vélo', vehicleType: 'Vélo', brand: '-', plate: '-', year: 2023, rides: 14, amount: '5 600 FCFA', registered: '20/01/2024', status: 'Rejeté' },
  { id: 'DRV-005', name: 'Abdoulaye Mbaye', phone: '+221 76 500 66 77', email: 'abdoulaye.mbaye@outlook.com', zone: 'Dakar Sud', vehicle: 'Voiture', vehicleType: 'Voiture', brand: 'Renault', plate: 'DK-3456-GH', year: 2020, rides: 27, amount: '13 500 FCFA', registered: '28/01/2024', status: 'Approuvé' },
]

export const MOCK_BASIC_SIGNUP_DRIVERS = [
  { id: 'DRV-010', name: 'Ndeye Sarr', phone: '+221 77 111 22 33', email: 'ndeye.sarr@gmail.com', zone: 'Dakar Centre', signupDate: '10/03/2024' },
  { id: 'DRV-011', name: 'Mamadou Coulibaly', phone: '+221 76 222 33 44', email: 'm.coulibaly@yahoo.fr', zone: 'Plateau', signupDate: '11/03/2024' },
  { id: 'DRV-012', name: 'Aissatou Bah', phone: '+221 70 333 44 55', email: 'aissatou.bah@gmail.com', zone: 'Parcelles', signupDate: '12/03/2024' },
  { id: 'DRV-013', name: 'Moustapha Gaye', phone: '+221 77 444 55 66', email: 'm.gaye@outlook.com', zone: 'Guédiawaye', signupDate: '13/03/2024' },
]

export const MOCK_PENDING_DRIVERS = [
  { id: 'DRV-020', name: 'Khadija Ndiaye', phone: '+221 77 555 11 22', email: 'khadija.ndiaye@gmail.com', zone: 'Dakar Centre', vehicle: 'Moto', submittedDate: '14/03/2024', docs: 3 },
  { id: 'DRV-021', name: 'Lamine Traoré', phone: '+221 76 666 22 33', email: 'lamine.traore@yahoo.fr', zone: 'Plateau', vehicle: 'Voiture', submittedDate: '14/03/2024', docs: 5 },
  { id: 'DRV-022', name: 'Rokhaya Faye', phone: '+221 70 777 33 44', email: 'rokhaya.faye@gmail.com', zone: 'Thiès', vehicle: 'Moto', submittedDate: '15/03/2024', docs: 4 },
]

export const MOCK_REJECTED_DRIVERS = [
  { id: 'DRV-030', name: 'Demba Sow', phone: '+221 77 888 11 22', email: 'demba.sow@gmail.com', zone: 'Dakar', reason: 'Documents invalides', rejectedDate: '08/03/2024' },
  { id: 'DRV-031', name: 'Astou Dieye', phone: '+221 76 999 22 33', email: 'astou.dieye@yahoo.fr', zone: 'Thiès', reason: 'Antécédents négatifs', rejectedDate: '09/03/2024' },
]

export const MOCK_TEMP_REJECTED_DRIVERS = [
  { id: 'DRV-040', name: 'Yaye Mbodj', phone: '+221 77 010 11 22', zone: 'Dakar', reason: 'Document expiré', until: '30/03/2024', rejectedDate: '01/03/2024' },
  { id: 'DRV-041', name: 'Alioune Dione', phone: '+221 76 020 22 33', zone: 'Saint-Louis', reason: 'Vérification en cours', until: '25/03/2024', rejectedDate: '05/03/2024' },
]

export const MOCK_USERS = [
  { id: 'USR-001', name: 'Fatou Diallo', phone: '+221 77 123 45 67', email: 'fatou.diallo@gmail.com', services: 12, wallet: '5 200 FCFA', country: 'Sénégal', zone: 'Dakar', registered: '12/01/2024', status: 'Actif' },
  { id: 'USR-002', name: 'Moussa Ndiaye', phone: '+221 76 234 56 78', email: 'moussa.ndiaye@outlook.com', services: 7, wallet: '1 800 FCFA', country: 'Sénégal', zone: 'Thiès', registered: '03/02/2024', status: 'Actif' },
  { id: 'USR-003', name: 'Aminata Koné', phone: '+221 70 345 67 89', email: 'aminata.kone@yahoo.fr', services: 3, wallet: '0 FCFA', country: 'Sénégal', zone: 'Dakar', registered: '18/02/2024', status: 'Inactif' },
  { id: 'USR-004', name: 'Ibrahim Touré', phone: '+221 77 456 78 90', email: 'ibrahim.toure@gmail.com', services: 21, wallet: '12 500 FCFA', country: 'Sénégal', zone: 'Saint-Louis', registered: '25/02/2024', status: 'Actif' },
  { id: 'USR-005', name: 'Mariama Balde', phone: '+221 76 567 89 01', email: 'mariama.balde@gmail.com', services: 5, wallet: '3 100 FCFA', country: 'Sénégal', zone: 'Dakar', registered: '01/03/2024', status: 'Actif' },
]

export const MOCK_SUPPORT_TICKETS = [
  { id: 'TKT-001', subject: 'Conducteur non trouvé', user: 'Fatou Diallo', phone: '+221 77 123 45 67', category: 'Course', priority: 'Haute', date: '15/03/2024 10:32', status: 'Ouvert' },
  { id: 'TKT-002', subject: 'Remboursement demandé', user: 'Moussa Ndiaye', phone: '+221 76 234 56 78', category: 'Paiement', priority: 'Moyenne', date: '15/03/2024 09:15', status: 'En traitement' },
  { id: 'TKT-003', subject: 'Application ne se connecte pas', user: 'Aminata Koné', phone: '+221 70 345 67 89', category: 'Technique', priority: 'Basse', date: '14/03/2024 18:00', status: 'Résolu' },
  { id: 'TKT-004', subject: 'Prix incorrect facturé', user: 'Ibrahim Touré', phone: '+221 77 456 78 90', category: 'Paiement', priority: 'Haute', date: '14/03/2024 14:20', status: 'Ouvert' },
  { id: 'TKT-005', subject: 'Conducteur impoli', user: 'Mariama Balde', phone: '+221 76 567 89 01', category: 'Comportement', priority: 'Haute', date: '13/03/2024 20:45', status: 'En traitement' },
]

export const MOCK_DELIVERY_RIDES = [
  { id: 'RD-8820', client: 'Fatou Diallo', driver: 'Oumar Sall', from: 'Plateau, Dakar', to: 'Parcelles Assainies', product: 'Colis Standard', amount: '500 FCFA', date: '15/03/2024 14:32', status: 'Terminée' },
  { id: 'RD-8821', client: 'Moussa Ndiaye', driver: 'Ibrahima Ba', from: 'Dakar Centre', to: 'Guédiawaye', product: 'Colis Express', amount: '800 FCFA', date: '15/03/2024 15:10', status: 'En cours' },
  { id: 'RD-8822', client: 'Aminata Koné', driver: '-', from: 'Dakar Sud', to: 'Thiès', product: 'Courrier Document', amount: '300 FCFA', date: '15/03/2024 13:00', status: 'Annulée' },
  { id: 'RD-8823', client: 'Ibrahim Touré', driver: 'Abdoulaye Mbaye', from: 'Plateau', to: 'Rufisque', product: 'Grand Colis', amount: '1500 FCFA', date: '14/03/2024 09:45', status: 'Terminée' },
  { id: 'RD-8824', client: 'Mariama Balde', driver: 'Cheikh Fall', from: 'Dakar Centre', to: 'Dakar Sud', product: 'Alimentaire', amount: '600 FCFA', date: '14/03/2024 12:00', status: 'Échouée' },
  { id: 'RD-8825', client: 'Seydou Diouf', driver: '-', from: 'Parcelles', to: 'Plateau', product: 'Colis Standard', amount: '500 FCFA', date: '14/03/2024 08:30', status: 'Auto-annulée' },
]

export const MOCK_TAXI_RIDES = [
  { id: 'TX-4410', client: 'Ndeye Sarr', driver: 'Oumar Sall', from: 'Aéroport LSS', to: 'Dakar Centre', distance: '12.3 km', amount: '3200 FCFA', date: '15/03/2024 11:20', status: 'Terminée', rating: 5 },
  { id: 'TX-4411', client: 'Lamine Traoré', driver: 'Ibrahima Ba', from: 'Plateau', to: 'Parcelles Assainies', distance: '5.8 km', amount: '1500 FCFA', date: '15/03/2024 12:05', status: 'En cours', rating: null },
  { id: 'TX-4412', client: 'Rokhaya Faye', driver: '-', from: 'Guédiawaye', to: 'Dakar Centre', distance: '8.1 km', amount: '2100 FCFA', date: '15/03/2024 10:30', status: 'Annulée', rating: null },
  { id: 'TX-4413', client: 'Alioune Dione', driver: 'Abdoulaye Mbaye', from: 'Dakar Sud', to: 'Thiès', distance: '72.5 km', amount: '15000 FCFA', date: '14/03/2024 07:00', status: 'Terminée', rating: 4 },
  { id: 'TX-4414', client: 'Pape Diallo', driver: 'Cheikh Fall', from: 'Plateau', to: 'Rufisque', distance: '18.2 km', amount: '4500 FCFA', date: '14/03/2024 16:45', status: 'Échouée', rating: null },
  { id: 'TX-4415', client: 'Binta Sylla', driver: '-', from: 'Parcelles', to: 'Dakar Centre', distance: '3.4 km', amount: '900 FCFA', date: '14/03/2024 19:00', status: 'Auto-annulée', rating: null },
]

export const MOBILE_USER_HOME_CONTENT = {
  brand: 'SÛR',
  city: 'Dakar, Sénégal',
  welcomeTitle: 'Bienvenue sur',
  welcomeDescription: 'Réservez un taxi ou commandez une livraison en quelques secondes',
  services: [
    { id: 'taxi', icon: 'taxi', title: 'Moto Taxi', desc: 'Course rapide en moto à travers la ville', gradient: 'linear-gradient(135deg, #f59e0b, #d97706)' },
    { id: 'delivery', icon: 'delivery', title: 'Livraison', desc: 'Envoyez ou recevez des colis partout', gradient: 'linear-gradient(135deg, #22c55e, #16a34a)' },
    { id: 'express', icon: 'package', title: 'Colis Express', desc: "Livraison express en moins d'1 heure", gradient: 'linear-gradient(135deg, #4680ff, #6366f1)' },
  ],
  quickActions: [
    { id: 'book', icon: 'navigation', label: 'Réserver', color: '#4680ff' },
    { id: 'history', icon: 'clock', label: 'Historique', color: '#f59e0b' },
    { id: 'sos', icon: 'phone', label: 'SOS', color: '#ef4444' },
  ],
}

export const MOBILE_USER_RIDES = [
  { id: 'SUR-2849', type: 'Moto Taxi', from: 'Dakar Plateau', to: 'Ouakam', status: 'completed', price: '1 500 FCFA', date: '15 Mars 2026' },
  { id: 'SUR-2832', type: 'Livraison', from: 'Almadies', to: 'Parcelles Assainies', status: 'completed', price: '2 200 FCFA', date: '14 Mars 2026' },
  { id: 'SUR-2815', type: 'Moto Taxi', from: 'Médina', to: 'HLM Grand Yoff', status: 'cancelled', price: '800 FCFA', date: '13 Mars 2026' },
  { id: 'SUR-2801', type: 'Colis Express', from: 'Liberté 6', to: 'Sicap Foire', status: 'completed', price: '3 500 FCFA', date: '12 Mars 2026' },
]

export const MOBILE_USER_PROFILE = {
  initials: 'AM',
  name: 'Amadou Mbaye',
  phone: '+221 77 123 45 67',
  email: 'amadou.mbaye@gmail.com',
  stats: [
    { value: '24', label: 'Courses', color: '#4680ff' },
    { value: '4.8', label: 'Note', color: '#f59e0b' },
    { value: '8', label: 'Mois', color: '#22c55e' },
  ],
  menu: [
    { id: 'profile', icon: 'user', label: 'Modifier mon profil' },
    { id: 'reviews', icon: 'star', label: 'Mes avis' },
    { id: 'addresses', icon: 'map-pin', label: 'Adresses enregistrées' },
    { id: 'support', icon: 'phone', label: 'Contacter le support' },
  ],
}

export const MOBILE_DRIVER_HOME_CONTENT = {
  brand: 'SÛR Conducteur',
  statusLabel: 'Statut actuel',
  onlineLabel: 'En ligne',
  offlineLabel: 'Hors ligne',
  onlineDescription: 'Vous recevez des demandes de course',
  offlineDescription: 'Activez pour recevoir des courses',
  todayStats: [
    { value: '7', label: 'Courses', color: '#4680ff' },
    { value: '12 500', label: 'Gains (FCFA)', color: '#22c55e' },
    { value: '4.9', label: 'Note', color: '#f59e0b' },
  ],
  incomingRequest: {
    title: 'Nouvelle demande',
    price: '1 500 FCFA',
    pickup: 'Dakar Plateau - Rue Félix Eboué',
    destination: 'Ouakam - Cité Avion',
  },
  recentRides: [
    { id: 'SUR-2849', from: 'Médina', to: 'HLM', price: '1 200 FCFA', time: '14:30', status: 'done' },
    { id: 'SUR-2845', from: 'Parcelles', to: 'Almadies', price: '2 000 FCFA', time: '13:15', status: 'done' },
    { id: 'SUR-2840', from: 'Sicap', to: 'Liberté 6', price: '800 FCFA', time: '11:45', status: 'cancel' },
  ],
}

export const MOBILE_DRIVER_EARNINGS = {
  weeklyTitle: 'Gains cette semaine',
  weeklyAmount: '45 750 FCFA',
  highlights: [
    { value: '32', label: 'Courses' },
    { value: '4.8', label: 'Note moy.' },
    { value: '28h', label: 'En ligne' },
  ],
  daily: [
    { day: 'Lundi', amount: '8 200', rides: 5 },
    { day: 'Mardi', amount: '6 500', rides: 4 },
    { day: 'Mercredi', amount: '9 100', rides: 6 },
    { day: 'Jeudi', amount: '7 450', rides: 5 },
    { day: 'Vendredi', amount: '10 300', rides: 7 },
    { day: 'Samedi', amount: '4 200', rides: 3 },
    { day: 'Dimanche', amount: '0', rides: 0 },
  ],
}

export const MOBILE_DRIVER_PROFILE = {
  initials: 'IB',
  name: 'Ibrahima Ba',
  phone: '+221 78 456 78 90',
  badge: 'Conducteur vérifié',
  vehicle: [
    { label: 'Type', value: 'Moto' },
    { label: 'Marque', value: 'Honda CG 125' },
    { label: 'Plaque', value: 'DK-2847-AF' },
    { label: 'Couleur', value: 'Noir' },
  ],
  menu: [
    { id: 'profile', icon: 'user', label: 'Modifier mon profil' },
    { id: 'documents', icon: 'file-text', label: 'Mes documents' },
    { id: 'reviews', icon: 'star', label: 'Mes avis (4.8/5)' },
    { id: 'support', icon: 'phone', label: 'Contacter le support' },
    { id: 'sos', icon: 'alert-circle', label: 'SOS Urgence' },
  ],
}
