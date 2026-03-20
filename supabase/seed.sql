-- ═══════════════════════════════════════════════════════════════
-- LIVIGO ADMIN — SCRIPT SQL COMPLET POUR SUPABASE
-- À exécuter dans : Supabase Dashboard > SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────
-- 0. Nettoyage (ordre sans violations FK)
-- ─────────────────────────────────────────
DROP TABLE IF EXISTS audit_logs     CASCADE;
DROP TABLE IF EXISTS sos_alerts     CASCADE;
DROP TABLE IF EXISTS messages       CASCADE;
DROP TABLE IF EXISTS ratings        CASCADE;
DROP TABLE IF EXISTS cashout_requests CASCADE;
DROP TABLE IF EXISTS wallet_transactions CASCADE;
DROP TABLE IF EXISTS wallets        CASCADE;
DROP TABLE IF EXISTS rides          CASCADE;
DROP TABLE IF EXISTS users          CASCADE;
DROP TABLE IF EXISTS drivers        CASCADE;

-- ─────────────────────────────────────────
-- 1. TABLE : drivers
-- ─────────────────────────────────────────
CREATE TABLE drivers (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  phone         TEXT,
  email         TEXT,
  zone          TEXT,
  vehicle       TEXT,
  vehicle_type  TEXT,
  brand         TEXT,
  plate         TEXT,
  year          INT,
  status        TEXT DEFAULT 'En attente',   -- 'Approuvé' | 'En attente' | 'Rejeté'
  signup_step   TEXT DEFAULT 'complete',
  is_online     BOOLEAN DEFAULT FALSE,
  last_lat      FLOAT,
  last_lng      FLOAT,
  docs          INT DEFAULT 0,
  submitted_date TEXT,
  rejected_date TEXT,
  rejection_reason TEXT,
  rejected_until TEXT,
  rides_count   INT DEFAULT 0,
  total_earnings FLOAT DEFAULT 0,
  rating        FLOAT DEFAULT 5.0,
  acceptance_rate FLOAT DEFAULT 90,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- 2. TABLE : users
-- ─────────────────────────────────────────
CREATE TABLE users (
  id           TEXT PRIMARY KEY,
  name         TEXT NOT NULL,
  phone        TEXT,
  email        TEXT,
  country      TEXT DEFAULT 'Sénégal',
  zone         TEXT,
  wallet_balance FLOAT DEFAULT 0,
  services_count INT DEFAULT 0,
  status       TEXT DEFAULT 'Actif',
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- 3. TABLE : rides
-- ─────────────────────────────────────────
CREATE TABLE rides (
  id               TEXT PRIMARY KEY,
  client_name      TEXT,
  user_id          TEXT REFERENCES users(id),
  driver_id        TEXT REFERENCES drivers(id),
  pickup_address   TEXT,
  destination_address TEXT,
  category         TEXT DEFAULT 'taxi',    -- 'taxi' | 'delivery'
  type             TEXT,
  status           TEXT DEFAULT 'En cours', -- 'En cours' | 'Terminée' | 'Annulée' | 'Échouée' | 'Auto-annulée'
  price            FLOAT DEFAULT 0,
  distance_meters  FLOAT DEFAULT 0,
  duration_seconds FLOAT DEFAULT 0,
  payment_status   TEXT DEFAULT 'pending',
  notes            TEXT,
  dispatched_by    TEXT,
  rating           INT,
  product          TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- 4. TABLE : wallets
-- ─────────────────────────────────────────
CREATE TABLE wallets (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id  TEXT REFERENCES drivers(id),
  balance    FLOAT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- 5. TABLE : cashout_requests
-- ─────────────────────────────────────────
CREATE TABLE cashout_requests (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id   TEXT REFERENCES drivers(id),
  amount      FLOAT NOT NULL,
  method      TEXT DEFAULT 'Wave',
  status      TEXT DEFAULT 'En attente',   -- 'En attente' | 'Approuvé' | 'Payé' | 'Rejeté'
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- 6. TABLE : wallet_transactions
-- ─────────────────────────────────────────
CREATE TABLE wallet_transactions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id  TEXT REFERENCES drivers(id),
  ride_id    TEXT REFERENCES rides(id),
  type       TEXT,   -- 'credit' | 'debit' | 'commission'
  amount     FLOAT,
  balance_after FLOAT,
  note       TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- 7. TABLE : ratings
-- ─────────────────────────────────────────
CREATE TABLE ratings (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ride_id    TEXT REFERENCES rides(id),
  driver_id  TEXT REFERENCES drivers(id),
  user_id    TEXT REFERENCES users(id),
  score      INT CHECK (score BETWEEN 1 AND 5),
  comment    TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- 8. TABLE : messages (chat)
-- ─────────────────────────────────────────
CREATE TABLE messages (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ride_id    TEXT REFERENCES rides(id),
  sender_id  TEXT,
  sender_role TEXT,  -- 'user' | 'driver'
  content    TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- 9. TABLE : sos_alerts
-- ─────────────────────────────────────────
CREATE TABLE sos_alerts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     TEXT REFERENCES users(id),
  driver_id   TEXT REFERENCES drivers(id),
  ride_id     TEXT REFERENCES rides(id),
  lat         FLOAT,
  lng         FLOAT,
  zone        TEXT,
  resolved    BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- 10. TABLE : audit_logs
-- ─────────────────────────────────────────
CREATE TABLE audit_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id    TEXT,
  action      TEXT,
  entity      TEXT,
  entity_id   TEXT,
  details     TEXT,
  ip          TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════
-- DONNÉES RÉELLES DE DÉMONSTRATION
-- ═══════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────
-- CONDUCTEURS (15 conducteurs réels Dakar)
-- ─────────────────────────────────────────
INSERT INTO drivers (id, name, phone, email, zone, vehicle, vehicle_type, brand, plate, year, status, is_online, last_lat, last_lng, docs, rides_count, total_earnings, rating, acceptance_rate, created_at) VALUES
('DRV-001', 'Oumar Sall',       '+221 77 100 22 33', 'oumar.sall@gmail.com',       'Dakar Centre',       'Moto',    'Moto',    'Yamaha',  'DK-1234-AB', 2021, 'Approuvé',   true,  14.6937, -17.4441, 5, 48, 24500, 4.8, 88, NOW() - INTERVAL '45 days'),
('DRV-002', 'Cheikh Fall',      '+221 76 200 33 44', 'cheikh.fall@yahoo.fr',        'Plateau',            'Voiture', 'Voiture', 'Toyota',  'DK-5678-CD', 2019, 'En attente', false, 14.6892, -17.4384, 4, 32, 16200, 4.5, 72, NOW() - INTERVAL '40 days'),
('DRV-003', 'Ibrahima Ba',      '+221 70 300 44 55', 'ibrahima.ba@gmail.com',       'Parcelles Assainies','Moto',    'Moto',    'Honda',   'DK-9012-EF', 2022, 'Approuvé',   true,  14.7012, -17.4556, 5, 61, 30750, 4.9, 95, NOW() - INTERVAL '35 days'),
('DRV-004', 'Seydou Diop',      '+221 77 400 55 66', 'seydou.diop@gmail.com',       'Guédiawaye',         'Vélo',    'Vélo',    '-',       '-',          2023, 'Rejeté',     false, 14.7156, -17.4473, 2, 14,  5600, 4.2, 65, NOW() - INTERVAL '30 days'),
('DRV-005', 'Abdoulaye Mbaye',  '+221 76 500 66 77', 'abdoulaye.mbaye@outlook.com', 'Dakar Sud',          'Voiture', 'Voiture', 'Renault', 'DK-3456-GH', 2020, 'Approuvé',   true,  14.6821, -17.4625, 5, 27, 13500, 4.6, 79, NOW() - INTERVAL '28 days'),
('DRV-006', 'Aminata Faye',     '+221 70 600 77 88', 'aminata.faye@gmail.com',      'Almadies',           'Moto',    'Moto',    'Suzuki',  'DK-7890-IJ', 2021, 'Approuvé',   false, 14.7289, -17.5067, 5, 39, 19800, 4.7, 91, NOW() - INTERVAL '25 days'),
('DRV-007', 'Mamadou Diallo',   '+221 77 700 88 99', 'm.diallo@gmail.com',          'Parcelles',          'Moto',    'Moto',    'Yamaha',  'DK-2345-KL', 2022, 'Approuvé',   true,  14.7089, -17.4487, 5, 35, 17500, 4.7, 87, NOW() - INTERVAL '22 days'),
('DRV-008', 'Fatou Diop',       '+221 76 800 99 00', 'fatou.diop@yahoo.fr',         'Dakar Centre',       'Voiture', 'Voiture', 'Peugeot', 'DK-6789-MN', 2018, 'En attente', false, 14.6956, -17.4486, 3, 0,     0, 5.0, 100, NOW() - INTERVAL '20 days'),
('DRV-009', 'Pape Ndiaye',      '+221 70 900 00 11', 'pape.ndiaye@gmail.com',       'Rufisque',           'Moto',    'Moto',    'Honda',   'DK-0123-OP', 2020, 'Approuvé',   false, 14.7141, -17.2764, 5, 22, 11000, 4.4, 76, NOW() - INTERVAL '18 days'),
('DRV-010', 'Khadija Ndiaye',   '+221 77 555 11 22', 'khadija.ndiaye@gmail.com',    'Dakar Centre',       'Moto',    'Moto',    'Bajaj',   'DK-4567-QR', 2021, 'En attente', false, 14.6921, -17.4445, 3, 0,     0, 5.0, 100, NOW() - INTERVAL '10 days'),
('DRV-011', 'Lamine Traoré',    '+221 76 666 22 33', 'lamine.traore@yahoo.fr',      'Plateau',            'Voiture', 'Voiture', 'Hyundai', 'DK-8901-ST', 2021, 'En attente', false, 14.6895, -17.4408, 5, 0,     0, 5.0, 100, NOW() - INTERVAL '8 days'),
('DRV-012', 'Rokhaya Faye',     '+221 70 777 33 44', 'rokhaya.faye@gmail.com',      'Thiès',              'Moto',    'Moto',    'TVS',     'DK-2345-UV', 2022, 'En attente', false, 14.7897, -16.9256, 4, 0,     0, 5.0, 100, NOW() - INTERVAL '5 days'),
('DRV-013', 'Demba Sow',        '+221 77 888 11 22', 'demba.sow@gmail.com',         'Dakar',              'Moto',    'Moto',    'Yamaha',  'DK-6789-WX', 2019, 'Rejeté',     false, 14.6928, -17.4467, 2, 8,  4000, 3.8, 55, NOW() - INTERVAL '25 days'),
('DRV-014', 'Yaye Mbodj',       '+221 77 010 11 22', 'm.bodj@gmail.com',            'Dakar',              'Moto',    'Moto',    'Honda',   'DK-0123-YZ', 2020, 'Rejeté',     false, 14.6928, -17.4467, 3, 5,  2500, 4.0, 60, NOW() - INTERVAL '20 days'),
('DRV-015', 'Alioune Dione',    '+221 76 020 22 33', 'alioune.dione@yahoo.fr',      'Saint-Louis',        'Voiture', 'Voiture', 'Dacia',   'DK-4567-AB', 2021, 'Rejeté',     false, 16.0179, -16.4896, 2, 3,  1500, 3.5, 50, NOW() - INTERVAL '15 days');

-- ─────────────────────────────────────────
-- UTILISATEURS (10 utilisateurs)
-- ─────────────────────────────────────────
INSERT INTO users (id, name, phone, email, country, zone, wallet_balance, services_count, status, created_at) VALUES
('USR-001', 'Fatou Diallo',   '+221 77 123 45 67', 'fatou.diallo@gmail.com',    'Sénégal', 'Dakar',       5200, 12, 'Actif',   NOW() - INTERVAL '90 days'),
('USR-002', 'Moussa Ndiaye',  '+221 76 234 56 78', 'moussa.ndiaye@outlook.com', 'Sénégal', 'Thiès',       1800,  7, 'Actif',   NOW() - INTERVAL '75 days'),
('USR-003', 'Aminata Koné',   '+221 70 345 67 89', 'aminata.kone@yahoo.fr',     'Sénégal', 'Dakar',          0,  3, 'Inactif', NOW() - INTERVAL '60 days'),
('USR-004', 'Ibrahim Touré',  '+221 77 456 78 90', 'ibrahim.toure@gmail.com',   'Sénégal', 'Saint-Louis', 12500, 21, 'Actif',   NOW() - INTERVAL '45 days'),
('USR-005', 'Mariama Balde',  '+221 76 567 89 01', 'mariama.balde@gmail.com',   'Sénégal', 'Dakar',       3100,  5, 'Actif',   NOW() - INTERVAL '30 days'),
('USR-006', 'Ndeye Sarr',     '+221 77 678 90 12', 'ndeye.sarr@gmail.com',      'Sénégal', 'Dakar Centre',4200,  8, 'Actif',   NOW() - INTERVAL '25 days'),
('USR-007', 'Pape Diallo',    '+221 70 789 01 23', 'pape.diallo@gmail.com',     'Sénégal', 'Plateau',      700,  4, 'Actif',   NOW() - INTERVAL '20 days'),
('USR-008', 'Binta Sylla',    '+221 77 890 12 34', 'binta.sylla@yahoo.fr',      'Sénégal', 'Almadies',    2400,  6, 'Actif',   NOW() - INTERVAL '15 days'),
('USR-009', 'Cheikh Sarr',    '+221 76 901 23 45', 'cheikh.sarr@gmail.com',     'Sénégal', 'Guédiawaye',   350,  2, 'Actif',   NOW() - INTERVAL '10 days'),
('USR-010', 'Astou Dieye',    '+221 70 012 34 56', 'astou.dieye@gmail.com',     'Sénégal', 'Parcelles',   8900, 15, 'Actif',   NOW() - INTERVAL '5 days');

-- ─────────────────────────────────────────
-- COURSES TAXI (24 courses)
-- ─────────────────────────────────────────
INSERT INTO rides (id, client_name, user_id, driver_id, pickup_address, destination_address, category, type, status, price, distance_meters, payment_status, rating, created_at) VALUES
('TX-4401', 'Fatou Diallo',   'USR-001', 'DRV-001', 'Dakar Plateau, Rue Félix Eboué', 'Ouakam, Cité Avion',         'taxi', 'Moto Taxi', 'Terminée',     1500, 5200, 'paid', 5, NOW() - INTERVAL '5 days'),
('TX-4402', 'Moussa Ndiaye',  'USR-002', 'DRV-003', 'Aéroport LSS',                   'Dakar Centre',                'taxi', 'Moto Taxi', 'Terminée',     3200, 12300,'paid', 4, NOW() - INTERVAL '5 days'),
('TX-4403', 'Aminata Koné',   'USR-003', NULL,       'Guédiawaye',                     'Dakar Centre',                'taxi', 'Moto Taxi', 'Annulée',      2100, 8100, 'refunded', NULL, NOW() - INTERVAL '5 days'),
('TX-4404', 'Ibrahim Touré',  'USR-004', 'DRV-005', 'Dakar Sud',                      'Thiès Centre',                'taxi', 'Taxi Premium', 'Terminée',   15000, 72500,'paid', 4, NOW() - INTERVAL '4 days'),
('TX-4405', 'Mariama Balde',  'USR-005', 'DRV-001', 'Plateau, Rue Vincent',           'Rufisque, Rond-point',        'taxi', 'Moto Taxi', 'Terminée',     4500, 18200,'paid', 5, NOW() - INTERVAL '4 days'),
('TX-4406', 'Ndeye Sarr',     'USR-006', NULL,       'Parcelles, Marché',              'Dakar Centre, Sandaga',       'taxi', 'Moto Taxi', 'Auto-annulée', 900,  3400, 'refunded', NULL, NOW() - INTERVAL '4 days'),
('TX-4407', 'Pape Diallo',    'USR-007', 'DRV-003', 'Almadies, ACI',                  'Plateau, Palais',             'taxi', 'Taxi Premium', 'Terminée',   2800, 9500, 'paid', 5, NOW() - INTERVAL '3 days'),
('TX-4408', 'Binta Sylla',    'USR-008', 'DRV-007', 'Medina, Marché HLM',             'Grand Yoff, Mairie',          'taxi', 'Moto Taxi', 'En cours',     1200, 4800, 'pending', NULL, NOW() - INTERVAL '1 hour'),
('TX-4409', 'Fatou Diallo',   'USR-001', 'DRV-001', 'Ouakam, Cité Millionnaire',      'Dakar, UCAD',                 'taxi', 'Moto Taxi', 'En cours',     1800, 6200, 'pending', NULL, NOW() - INTERVAL '30 min'),
('TX-4410', 'Moussa Ndiaye',  'USR-002', 'DRV-005', 'Plateau, Rue El Hadj Mbaye',     'Parcelles, Cité Avion',       'taxi', 'Moto Taxi', 'Terminée',     1100, 4100, 'paid', 4, NOW() - INTERVAL '2 days'),
('TX-4411', 'Ibrahim Touré',  'USR-004', 'DRV-003', 'Saint-Louis, Pont Faidherbe',    'Dakar Aéroport',              'taxi', 'Taxi Premium', 'Terminée',   22000, 95000,'paid', 5, NOW() - INTERVAL '2 days'),
('TX-4412', 'Mariama Balde',  'USR-005', NULL,       'Dakar Sud, Fann',                'Pikine, Marché',              'taxi', 'Moto Taxi', 'Annulée',      1400, 5300, 'refunded', NULL, NOW() - INTERVAL '3 days'),
('TX-4413', 'Cheikh Sarr',    'USR-009', 'DRV-006', 'Almadies, Ngor',                 'Plateau, Indépendance',       'taxi', 'Moto Taxi', 'Terminée',     2200, 8300, 'paid', 4, NOW() - INTERVAL '1 day'),
('TX-4414', 'Astou Dieye',    'USR-010', 'DRV-001', 'Parcelles, Rue 10',              'Ouakam, Av. Cheikh Anta',     'taxi', 'Moto Taxi', 'Terminée',     1600, 5800, 'paid', 5, NOW() - INTERVAL '1 day'),
-- Courses plus anciennes (1-2 semaines)
('TX-4415', 'Ndeye Sarr',     'USR-006', 'DRV-003', 'Dakar Centre, Sandaga',          'Guédiawaye, Marché Zinc',     'taxi', 'Moto Taxi', 'Terminée',     2000, 7500, 'paid', 5, NOW() - INTERVAL '7 days'),
('TX-4416', 'Pape Diallo',    'USR-007', 'DRV-005', 'Rufisque, Gare',                 'Plateau, Kärcher',            'taxi', 'Moto Taxi', 'Terminée',     5000, 20000,'paid', 3, NOW() - INTERVAL '7 days'),
('TX-4417', 'Binta Sylla',    'USR-008', NULL,       'Medina, HLM',                   'Plateau, Pointe E',           'taxi', 'Moto Taxi', 'Échouée',      1300, 4900, 'failed', NULL, NOW() - INTERVAL '8 days'),
('TX-4418', 'Fatou Diallo',   'USR-001', 'DRV-007', 'UCAD, Fann',                    'Almadies, Résidence',         'taxi', 'Moto Taxi', 'Terminée',     2100, 8000, 'paid', 4, NOW() - INTERVAL '10 days'),
('TX-4419', 'Moussa Ndiaye',  'USR-002', 'DRV-001', 'Plateau, Rue Vincens',           'Ouakam, Villa',               'taxi', 'Moto Taxi', 'Terminée',     1500, 5100, 'paid', 5, NOW() - INTERVAL '10 days'),
('TX-4420', 'Ibrahim Touré',  'USR-004', 'DRV-003', 'Dakar, Stade LSS',               'Pikine, Terminus',            'taxi', 'Moto Taxi', 'Annulée',      1800, 6500, 'refunded', NULL, NOW() - INTERVAL '12 days'),
-- Courses récentes (aujourd'hui)
('TX-4421', 'Astou Dieye',    'USR-010', 'DRV-005', 'Almadies, Ngor Plage',           'Plateau, BRVM',               'taxi', 'Moto Taxi', 'Terminée',     2500, 9100, 'paid', 5, NOW() - INTERVAL '3 hours'),
('TX-4422', 'Cheikh Sarr',    'USR-009', 'DRV-003', 'Parcelles, Cité Aliou Sow',      'Dakar Centre, Derklé',        'taxi', 'Moto Taxi', 'Terminée',     1300, 4700, 'paid', 4, NOW() - INTERVAL '2 hours'),
('TX-4423', 'Ndeye Sarr',     'USR-006', 'DRV-001', 'Dakar Centre, Rue El Hadj M.',   'Grand Yoff, Résidence',       'taxi', 'Moto Taxi', 'En cours',     1700, 6100, 'pending', NULL, NOW() - INTERVAL '15 min'),
('TX-4424', 'Mariama Balde',  'USR-005', 'DRV-007', 'Guédiawaye, SODIDA',             'Plateau, Direction Générale', 'taxi', 'Moto Taxi', 'En cours',     2300, 8700, 'pending', NULL, NOW() - INTERVAL '5 min');

-- ─────────────────────────────────────────
-- COURSES LIVRAISON (13 courses)
-- ─────────────────────────────────────────
INSERT INTO rides (id, client_name, user_id, driver_id, pickup_address, destination_address, category, type, status, price, distance_meters, payment_status, product, created_at) VALUES
('RD-8820', 'Fatou Diallo',  'USR-001', 'DRV-001', 'Plateau, Dakar',      'Parcelles Assainies',  'delivery', 'Livraison Express',    'Terminée',    500,  5500, 'paid',     'Colis Standard', NOW() - INTERVAL '5 days'),
('RD-8821', 'Moussa Ndiaye', 'USR-002', 'DRV-003', 'Dakar Centre',        'Guédiawaye',           'delivery', 'Livraison Express',    'En cours',    800,  8000, 'pending',  'Colis Express',  NOW() - INTERVAL '2 hours'),
('RD-8822', 'Aminata Koné',  'USR-003', NULL,       'Dakar Sud',           'Thiès',                'delivery', 'Livraison Express',    'Annulée',     300, 55000, 'refunded', 'Courrier',       NOW() - INTERVAL '5 days'),
('RD-8823', 'Ibrahim Touré', 'USR-004', 'DRV-005', 'Plateau',             'Rufisque',             'delivery', 'Livraison Express',    'Terminée',   1500, 20000, 'paid',     'Grand Colis',    NOW() - INTERVAL '4 days'),
('RD-8824', 'Mariama Balde', 'USR-005', 'DRV-001', 'Dakar Centre',        'Dakar Sud',            'delivery', 'Livraison Alimentaire','Échouée',     600,  8500, 'failed',   'Alimentaire',    NOW() - INTERVAL '4 days'),
('RD-8825', 'Ndeye Sarr',    'USR-006', NULL,       'Parcelles',           'Plateau',              'delivery', 'Livraison Express',    'Auto-annulée',500,  5000, 'refunded', 'Colis Standard', NOW() - INTERVAL '4 days'),
('RD-8826', 'Pape Diallo',   'USR-007', 'DRV-003', 'Almadies',            'Médina',               'delivery', 'Livraison Express',    'Terminée',   1200, 12000, 'paid',     'Électronique',   NOW() - INTERVAL '3 days'),
('RD-8827', 'Binta Sylla',   'USR-008', 'DRV-007', 'Grand Yoff',          'Ouakam',               'delivery', 'Livraison Express',    'Terminée',    700,  7500, 'paid',     'Textile',        NOW() - INTERVAL '3 days'),
('RD-8828', 'Fatou Diallo',  'USR-001', 'DRV-005', 'Dakar',               'Thiès',                'delivery', 'Colis Express',        'En cours',   2000, 65000, 'pending',  'Gros colis',     NOW() - INTERVAL '1 hour'),
('RD-8829', 'Astou Dieye',   'USR-010', 'DRV-001', 'Plateau',             'Liberté 6',            'delivery', 'Livraison Express',    'Terminée',    600,  6000, 'paid',     'Documents',      NOW() - INTERVAL '2 days'),
('RD-8830', 'Cheikh Sarr',   'USR-009', 'DRV-003', 'Parcelles',           'Dakar Centre',         'delivery', 'Livraison Express',    'Terminée',    500,  5000, 'paid',     'Colis Standard', NOW() - INTERVAL '1 day'),
('RD-8831', 'Moussa Ndiaye', 'USR-002', NULL,       'Guédiawaye',          'Plateau',              'delivery', 'Livraison Express',    'Annulée',     800,  8000, 'refunded', 'Colis Express',  NOW() - INTERVAL '2 days'),
('RD-8832', 'Ibrahim Touré', 'USR-004', 'DRV-007', 'Saint-Louis',         'Dakar Centre',         'delivery', 'Colis Express',        'En cours',   5000, 95000, 'pending',  'Marchandises',   NOW() - INTERVAL '30 min');

-- ─────────────────────────────────────────
-- WALLETS des conducteurs approuvés
-- ─────────────────────────────────────────
INSERT INTO wallets (driver_id, balance) VALUES
('DRV-001', 24500),
('DRV-003', 30750),
('DRV-005', 13500),
('DRV-006', 19800),
('DRV-007', 17500),
('DRV-009', 11000);

-- ─────────────────────────────────────────
-- DEMANDES DE RETRAIT
-- ─────────────────────────────────────────
INSERT INTO cashout_requests (driver_id, amount, method, status, notes, created_at) VALUES
('DRV-001', 15000, 'Wave',         'En attente', NULL,                          NOW() - INTERVAL '2 hours'),
('DRV-003', 20000, 'Orange Money', 'En attente', NULL,                          NOW() - INTERVAL '1 day'),
('DRV-005', 8000,  'Wave',         'Payé',       'Transféré le 18/03',          NOW() - INTERVAL '5 days'),
('DRV-006', 12000, 'Wave',         'Approuvé',   NULL,                          NOW() - INTERVAL '3 days'),
('DRV-007', 5000,  'Orange Money', 'Rejeté',     'Solde insuffisant au moment', NOW() - INTERVAL '7 days'),
('DRV-001', 10000, 'Wave',         'Payé',       'Transféré le 10/03',          NOW() - INTERVAL '10 days'),
('DRV-003', 15000, 'Orange Money', 'Payé',       'Transféré le 08/03',          NOW() - INTERVAL '12 days');

-- ─────────────────────────────────────────
-- NOTES / ÉVALUATIONS
-- ─────────────────────────────────────────
INSERT INTO ratings (ride_id, driver_id, user_id, score, comment) VALUES
('TX-4401', 'DRV-001', 'USR-001', 5, 'Excellent chauffeur, très ponctuel !'),
('TX-4402', 'DRV-003', 'USR-002', 4, 'Bien, conduite sûre'),
('TX-4404', 'DRV-005', 'USR-004', 4, 'Service correct, ponctuel'),
('TX-4405', 'DRV-001', 'USR-005', 5, 'Parfait ! Je recommande'),
('TX-4407', 'DRV-003', 'USR-007', 5, 'Très professionnel'),
('TX-4410', 'DRV-005', 'USR-002', 4, 'Bien, route connue'),
('TX-4411', 'DRV-003', 'USR-004', 5, 'Impeccable pour le longue distance'),
('TX-4413', 'DRV-006', 'USR-009', 4, 'Correct'),
('TX-4414', 'DRV-001', 'USR-010', 5, 'Super service !'),
('TX-4415', 'DRV-003', 'USR-006', 5, 'Toujours au top !'),
('TX-4416', 'DRV-005', 'USR-007', 3, 'Trajet ok mais conducteur peu loquace'),
('TX-4418', 'DRV-007', 'USR-001', 4, 'Bien, merci'),
('TX-4419', 'DRV-001', 'USR-002', 5, 'Parfait encore une fois !'),
('TX-4421', 'DRV-005', 'USR-010', 5, 'Très satisfaite'),
('TX-4422', 'DRV-003', 'USR-009', 4, 'Bien');

-- ─────────────────────────────────────────
-- ALERTES SOS
-- ─────────────────────────────────────────
INSERT INTO sos_alerts (user_id, driver_id, ride_id, lat, lng, zone, resolved) VALUES
('USR-003', NULL,      NULL,      14.6928, -17.4467, 'Dakar Centre',  true),
('USR-007', 'DRV-001', 'TX-4405', 14.7141, -17.2764, 'Rufisque',      true),
('USR-005', NULL,      NULL,      14.6892, -17.4384, 'Plateau',       false);

-- ─────────────────────────────────────────
-- MESSAGES CHAT (courses actives)
-- ─────────────────────────────────────────
INSERT INTO messages (ride_id, sender_id, sender_role, content, created_at) VALUES
('TX-4408', 'USR-008',  'user',   'Je suis devant le marché, portail bleu', NOW() - INTERVAL '45 min'),
('TX-4408', 'DRV-007',  'driver', 'OK je vous rejoins dans 2 minutes', NOW() - INTERVAL '44 min'),
('TX-4408', 'USR-008',  'user',   'Merci !', NOW() - INTERVAL '43 min'),
('TX-4409', 'DRV-001',  'driver', 'Je suis là en bas', NOW() - INTERVAL '25 min'),
('TX-4409', 'USR-001',  'user',   'Je descends', NOW() - INTERVAL '24 min');

-- ─────────────────────────────────────────
-- AUDIT LOGS initiaux
-- ─────────────────────────────────────────
INSERT INTO audit_logs (admin_id, action, entity, entity_id, details) VALUES
('admin@livigo.sn', 'APPROVE_DRIVER',  'drivers', 'DRV-001', 'Approbation conducteur Oumar Sall'),
('admin@livigo.sn', 'APPROVE_DRIVER',  'drivers', 'DRV-003', 'Approbation conducteur Ibrahima Ba'),
('admin@livigo.sn', 'REJECT_DRIVER',   'drivers', 'DRV-004', 'Rejet conducteur Seydou Diop - Documents invalides'),
('admin@livigo.sn', 'MANUAL_DISPATCH', 'rides',   'TX-4407', 'Dispatch manuel vers DRV-003'),
('admin@livigo.sn', 'APPROVE_CASHOUT', 'cashout', 'cashout-4', 'Validation retrait 12 000 FCFA - DRV-006');

-- ═══════════════════════════════════════════════════════════════
-- POLITIQUES RLS (Row Level Security) - Accès public pour démo
-- ═══════════════════════════════════════════════════════════════
ALTER TABLE drivers   ENABLE ROW LEVEL SECURITY;
ALTER TABLE users     ENABLE ROW LEVEL SECURITY;
ALTER TABLE rides     ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets   ENABLE ROW LEVEL SECURITY;
ALTER TABLE cashout_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings   ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages  ENABLE ROW LEVEL SECURITY;
ALTER TABLE sos_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;

-- Politique permissive pour la clé anonyme (démo)
CREATE POLICY "allow_all_anon" ON drivers          FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_anon" ON users            FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_anon" ON rides            FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_anon" ON wallets          FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_anon" ON cashout_requests FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_anon" ON ratings          FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_anon" ON messages         FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_anon" ON sos_alerts       FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_anon" ON audit_logs       FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_anon" ON wallet_transactions FOR ALL TO anon USING (true) WITH CHECK (true);

-- ═══════════════════════════════════════════════════════════════
-- REALTIME : activer sur les tables dynamiques
-- ═══════════════════════════════════════════════════════════════
ALTER PUBLICATION supabase_realtime ADD TABLE rides;
ALTER PUBLICATION supabase_realtime ADD TABLE drivers;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE sos_alerts;

-- ═══════════════════════════════════════════════════════════════
-- VÉRIFICATION FINALE
-- ═══════════════════════════════════════════════════════════════
SELECT 'drivers'  AS table_name, COUNT(*) FROM drivers  UNION ALL
SELECT 'users',                  COUNT(*) FROM users     UNION ALL
SELECT 'rides',                  COUNT(*) FROM rides     UNION ALL
SELECT 'wallets',                COUNT(*) FROM wallets   UNION ALL
SELECT 'cashout_requests',       COUNT(*) FROM cashout_requests UNION ALL
SELECT 'ratings',                COUNT(*) FROM ratings   UNION ALL
SELECT 'messages',               COUNT(*) FROM messages  UNION ALL
SELECT 'sos_alerts',             COUNT(*) FROM sos_alerts UNION ALL
SELECT 'audit_logs',             COUNT(*) FROM audit_logs;
