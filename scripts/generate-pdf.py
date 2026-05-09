"""
Génération du PDF de Référence LiviGo — Documentation Complète
Utilise reportlab pour un rendu professionnel de haute qualité
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm, cm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle,
    HRFlowable, KeepTogether, ListFlowable, ListItem, Flowable
)
from reportlab.platypus.tableofcontents import TableOfContents
from reportlab.pdfgen import canvas
from reportlab.graphics.shapes import Drawing, Rect, String, Circle, Line
from reportlab.graphics import renderPDF
import datetime, os, sys

# ─── Couleurs LiviGo ────────────────────────────────────────────────────────
PRIMARY   = colors.HexColor('#4680ff')
DARK      = colors.HexColor('#1a1d2e')
SUCCESS   = colors.HexColor('#22c55e')
WARNING   = colors.HexColor('#f59e0b')
DANGER    = colors.HexColor('#ef4444')
PURPLE    = colors.HexColor('#a855f7')
INDIGO    = colors.HexColor('#6366f1')
LIGHT     = colors.HexColor('#f8fafc')
GRAY      = colors.HexColor('#64748b')
GRAY_LIGHT= colors.HexColor('#e2e8f0')
WHITE     = colors.white
BLUE_PALE = colors.HexColor('#eff6ff')
DARK2     = colors.HexColor('#0f172a')
SLATE     = colors.HexColor('#475569')
TEAL      = colors.HexColor('#0ea5e9')

W, H = A4
MARGIN_L, MARGIN_R = 20*mm, 20*mm
MARGIN_T, MARGIN_B = 25*mm, 20*mm

OUTPUT_FILE = os.path.join(os.path.dirname(__file__), '..', 'Reference_LiviGo.pdf')

# ─── Numérotation pages + en-tête/pied ──────────────────────────────────────
class DocCanvas:
    def __init__(self):
        self.page_num = 0

    def on_page(self, canv, doc):
        self.page_num += 1
        canv.saveState()
        # En-tête
        canv.setFillColor(DARK)
        canv.rect(0, H - 14*mm, W, 14*mm, fill=1, stroke=0)
        canv.setFillColor(PRIMARY)
        canv.setFont('Helvetica-Bold', 9)
        canv.drawString(MARGIN_L, H - 8*mm, '🚀 LiviGo')
        canv.setFillColor(WHITE)
        canv.setFont('Helvetica', 8)
        canv.drawString(MARGIN_L + 22*mm, H - 8*mm, '— Référence Complète des Fonctionnalités')
        canv.setFillColor(GRAY_LIGHT)
        canv.setFont('Helvetica', 7.5)
        version_text = 'v2.0  |  Mai 2026'
        canv.drawRightString(W - MARGIN_R, H - 8*mm, version_text)
        # Pied de page
        canv.setFillColor(LIGHT)
        canv.rect(0, 0, W, 10*mm, fill=1, stroke=0)
        canv.setStrokeColor(GRAY_LIGHT)
        canv.setLineWidth(0.5)
        canv.line(MARGIN_L, 10*mm, W - MARGIN_R, 10*mm)
        canv.setFillColor(GRAY)
        canv.setFont('Helvetica', 7.5)
        canv.drawString(MARGIN_L, 3.5*mm, 'LiviGo — Plateforme de Mobilité Urbaine  |  Dakar, Sénégal  |  support@livigo.sn')
        canv.setFillColor(PRIMARY)
        canv.setFont('Helvetica-Bold', 8)
        canv.drawRightString(W - MARGIN_R, 3.5*mm, f'Page {self.page_num}')
        canv.restoreState()

    def on_first_page(self, canv, doc):
        canv.saveState()
        canv.restoreState()

doc_canvas = DocCanvas()

def draw_cover(canv, doc):
    """Dessine la page de couverture directement sur le canvas (page 1 uniquement)"""
    canv.saveState()
    # Fond dégradé simulé
    canv.setFillColor(DARK2)
    canv.rect(0, 0, W, H, fill=1, stroke=0)
    # Bande primaire en haut
    canv.setFillColor(PRIMARY)
    canv.rect(0, H - 60*mm, W, 60*mm, fill=1, stroke=0)
    # Cercles décoratifs
    canv.setFillColor(colors.HexColor('#2a5ccc'))
    canv.circle(W - 30*mm, H - 30*mm, 45*mm, fill=1, stroke=0)
    canv.setFillColor(colors.HexColor('#1a3a8a'))
    canv.circle(W - 10*mm, H - 55*mm, 28*mm, fill=1, stroke=0)
    canv.setFillColor(colors.HexColor('#4680ff22'))
    canv.circle(20*mm, 30*mm, 35*mm, fill=1, stroke=0)
    # Badge version
    canv.setFillColor(colors.HexColor('#ffffff22'))
    canv.roundRect(MARGIN_L, H - 52*mm, 30*mm, 8*mm, 3, fill=1, stroke=0)
    canv.setFillColor(WHITE)
    canv.setFont('Helvetica-Bold', 7.5)
    canv.drawString(MARGIN_L + 3*mm, H - 47.5*mm, 'v2.0  |  MAI 2026')
    # Titre
    canv.setFillColor(WHITE)
    canv.setFont('Helvetica-Bold', 48)
    canv.drawCentredString(W / 2, H / 2 + 60*mm, 'LiviGo')
    canv.setFillColor(GRAY_LIGHT)
    canv.setFont('Helvetica', 18)
    canv.drawCentredString(W / 2, H / 2 + 46*mm, 'Reference Complete des Fonctionnalites')
    canv.setStrokeColor(PRIMARY)
    canv.setLineWidth(2)
    canv.line(W/2 - 50*mm, H/2 + 40*mm, W/2 + 50*mm, H/2 + 40*mm)
    canv.setFillColor(GRAY_LIGHT)
    canv.setFont('Helvetica', 11)
    canv.drawCentredString(W / 2, H / 2 + 32*mm, 'Plateforme de Mobilite Urbaine - Dakar, Senegal')
    # Boite meta
    bx, by, bw, bh = W/2 - 55*mm, H/2 - 10*mm, 110*mm, 52*mm
    canv.setFillColor(colors.HexColor('#ffffff0f'))
    canv.roundRect(bx, by, bw, bh, 6, fill=1, stroke=0)
    canv.setStrokeColor(colors.HexColor('#ffffff22'))
    canv.setLineWidth(0.8)
    canv.roundRect(bx, by, bw, bh, 6, fill=0, stroke=1)
    meta = [
        ('Plateforme',  'Web Admin + Android (APK natif)'),
        ('Backend',     'Supabase PostgreSQL + Realtime'),
        ('Auteur',      'Mamadou Elimane Wane'),
        ('Contact',     'support@livigo.sn'),
        ('Statut',      'Production Ready'),
    ]
    for i, (k, v) in enumerate(meta):
        y = by + bh - 12*mm - i * 7.5*mm
        canv.setFillColor(GRAY_LIGHT)
        canv.setFont('Helvetica-Bold', 8.5)
        canv.drawString(bx + 6*mm, y, f'{k} :')
        canv.setFillColor(WHITE)
        canv.setFont('Helvetica', 8.5)
        canv.drawString(bx + 35*mm, y, v)
    # Stats
    stats = [('3', 'Applications'), ('45+', 'Fonctionnalites'), ('8', 'Innovations')]
    sw = bw / 3
    for i, (val, lbl) in enumerate(stats):
        sx = bx + i * sw + sw / 2
        sy = by + 8*mm
        canv.setFillColor(PRIMARY)
        canv.setFont('Helvetica-Bold', 18)
        canv.drawCentredString(sx, sy + 4*mm, val)
        canv.setFillColor(GRAY_LIGHT)
        canv.setFont('Helvetica', 7.5)
        canv.drawCentredString(sx, sy - 1*mm, lbl)
    # Bas de page
    canv.setFillColor(colors.HexColor('#ffffff15'))
    canv.rect(0, 0, W, 18*mm, fill=1, stroke=0)
    canv.setFillColor(GRAY_LIGHT)
    canv.setFont('Helvetica', 8)
    canv.drawCentredString(W/2, 8*mm, 'Document confidentiel - 2026 LiviGo - Tous droits reserves')
    canv.setFillColor(PRIMARY)
    canv.setFont('Helvetica-Bold', 8)
    canv.drawCentredString(W/2, 3.5*mm, 'livigo.sn  |  github.com/mamadouelimanewane/livreur')
    canv.restoreState()

# ─── Styles ──────────────────────────────────────────────────────────────────
base = getSampleStyleSheet()

def sty(name, **kw):
    return ParagraphStyle(name, **kw)

S_TITLE = sty('Title', fontName='Helvetica-Bold', fontSize=38, textColor=WHITE,
              leading=44, alignment=TA_CENTER, spaceAfter=6)
S_SUBTITLE = sty('Subtitle', fontName='Helvetica', fontSize=16, textColor=GRAY_LIGHT,
                 leading=22, alignment=TA_CENTER, spaceAfter=4)

S_H1 = sty('H1', fontName='Helvetica-Bold', fontSize=18, textColor=DARK2,
           leading=22, spaceBefore=18, spaceAfter=8,
           borderPad=(0,0,4,0))
S_H2 = sty('H2', fontName='Helvetica-Bold', fontSize=13, textColor=PRIMARY,
           leading=17, spaceBefore=14, spaceAfter=6)
S_H3 = sty('H3', fontName='Helvetica-Bold', fontSize=11, textColor=DARK,
           leading=14, spaceBefore=10, spaceAfter=4)

S_BODY = sty('Body', fontName='Helvetica', fontSize=9.5, textColor=SLATE,
             leading=14, spaceBefore=2, spaceAfter=4, alignment=TA_JUSTIFY)
S_BODY_SM = sty('BodySm', fontName='Helvetica', fontSize=8.5, textColor=SLATE,
                leading=12, spaceAfter=3)
S_BOLD = sty('Bold', fontName='Helvetica-Bold', fontSize=9.5, textColor=DARK,
             leading=13, spaceAfter=3)

S_BULLET = sty('Bullet', fontName='Helvetica', fontSize=9, textColor=SLATE,
               leading=13, leftIndent=12, firstLineIndent=-8, spaceAfter=3,
               bulletFontName='Helvetica-Bold', bulletFontSize=10, bulletIndent=2)
S_BULLET2 = sty('Bullet2', fontName='Helvetica', fontSize=8.5, textColor=GRAY,
                leading=12, leftIndent=22, firstLineIndent=-8, spaceAfter=2)

S_CODE = sty('Code', fontName='Courier', fontSize=8, textColor=DARK,
             leading=11, backColor=LIGHT, leftIndent=10, rightIndent=10,
             spaceBefore=4, spaceAfter=4, borderWidth=0.5,
             borderColor=GRAY_LIGHT, borderPad=6)

S_CAPTION = sty('Caption', fontName='Helvetica-Oblique', fontSize=8, textColor=GRAY,
                leading=11, alignment=TA_CENTER, spaceAfter=6)
S_NOTE = sty('Note', fontName='Helvetica-Oblique', fontSize=8.5, textColor=GRAY,
             leading=12, leftIndent=8, spaceAfter=4)
S_TOC1 = sty('TOC1', fontName='Helvetica-Bold', fontSize=11, textColor=DARK,
             leading=16, leftIndent=0, spaceAfter=3)
S_TOC2 = sty('TOC2', fontName='Helvetica', fontSize=9.5, textColor=GRAY,
             leading=14, leftIndent=12, spaceAfter=2)
S_TOC3 = sty('TOC3', fontName='Helvetica', fontSize=8.5, textColor=GRAY,
             leading=13, leftIndent=24, spaceAfter=1)

# ─── Helpers Flowable ────────────────────────────────────────────────────────
def h1(text, num=''):
    label = f'{num}  {text}' if num else text
    return [
        HRFlowable(width='100%', thickness=3, color=PRIMARY, spaceAfter=4),
        Paragraph(label.upper(), S_H1),
        Spacer(1, 2),
    ]

def h2(text):
    return [Paragraph(text, S_H2)]

def h3(text):
    return [Paragraph(text, S_H3)]

def para(text):
    return [Paragraph(text, S_BODY)]

def note(text):
    return [Paragraph(f'<i>{text}</i>', S_NOTE)]

def b(text):
    return Paragraph(f'• {text}', S_BULLET)

def b2(text):
    return Paragraph(f'◦ {text}', S_BULLET2)

def code(text):
    return [Paragraph(text.replace('\n', '<br/>'), S_CODE)]

def spacer(h=6):
    return Spacer(1, h)

def hr(color=GRAY_LIGHT, thickness=0.5):
    return HRFlowable(width='100%', thickness=thickness, color=color,
                      spaceBefore=8, spaceAfter=8)

def pb():
    return PageBreak()

# ─── Tableaux stylisés ───────────────────────────────────────────────────────
def make_table(headers, rows, col_widths=None, header_color=PRIMARY):
    cw = col_widths or [None] * len(headers)
    avail = W - MARGIN_L - MARGIN_R
    if col_widths is None:
        cw = [avail / len(headers)] * len(headers)
    else:
        total = sum(c for c in col_widths if c)
        cw = [c * avail if c and c <= 1 else c for c in col_widths]

    data = [[Paragraph(f'<b>{h}</b>', sty('TH', fontName='Helvetica-Bold', fontSize=8.5,
                       textColor=WHITE, leading=11)) for h in headers]]
    for i, row in enumerate(rows):
        data.append([
            Paragraph(str(cell), sty(f'TD{i}', fontName='Helvetica',
                      fontSize=8.5, textColor=DARK if j == 0 else SLATE,
                      leading=12, fontWeight='Bold' if j == 0 else 'Normal'))
            for j, cell in enumerate(row)
        ])

    style = TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), header_color),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [WHITE, BLUE_PALE]),
        ('GRID', (0, 0), (-1, -1), 0.4, GRAY_LIGHT),
        ('LINEBELOW', (0, 0), (-1, 0), 1, colors.HexColor('#3060cc')),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 7),
        ('RIGHTPADDING', (0, 0), (-1, -1), 7),
        ('FONTNAME', (0, 1), (0, -1), 'Helvetica-Bold'),
        ('TEXTCOLOR', (0, 1), (0, -1), DARK),
        ('ROUNDEDCORNERS', [3]),
    ])
    t = Table(data, colWidths=cw, repeatRows=1)
    t.setStyle(style)
    return t

def badge_table(rows, color=PRIMARY, header_color=None):
    """Tableau 3 colonnes : Fonctionnalité | Description | Statut"""
    return make_table(
        ['Fonctionnalité', 'Description', 'Statut'],
        rows,
        col_widths=[0.30, 0.58, 0.12],
        header_color=header_color or color
    )

def info_box(title, items, color=PRIMARY):
    """Boîte d'information colorée"""
    data = [[Paragraph(f'<b>{title}</b>', sty('IB', fontName='Helvetica-Bold',
                       fontSize=10, textColor=WHITE))]]
    for item in items:
        data.append([Paragraph(f'• {item}', sty('IBItem', fontName='Helvetica',
                               fontSize=9, textColor=DARK, leading=13))])
    t = Table(data, colWidths=[W - MARGIN_L - MARGIN_R])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), color),
        ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f8faff')),
        ('GRID', (0, 0), (-1, -1), 0.5, GRAY_LIGHT),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 9),
        ('ROUNDEDCORNERS', [4]),
    ]))
    return t

# ─── PAGE DE COUVERTURE ──────────────────────────────────────────────────────
class CoverPage(Flowable):
    def __init__(self):
        Flowable.__init__(self)
        self.width = W
        self.height = H

    def draw(self):
        c = self.canv
        # Fond dégradé simulé (rectangles superposés)
        c.setFillColor(DARK2)
        c.rect(0, 0, W, H, fill=1, stroke=0)
        # Bande primaire en haut
        c.setFillColor(PRIMARY)
        c.rect(0, H - 60*mm, W, 60*mm, fill=1, stroke=0)
        # Cercles décoratifs
        c.setFillColor(colors.HexColor('#2a5ccc'))
        c.circle(W - 30*mm, H - 30*mm, 45*mm, fill=1, stroke=0)
        c.setFillColor(colors.HexColor('#1a3a8a'))
        c.circle(W - 10*mm, H - 55*mm, 28*mm, fill=1, stroke=0)
        c.setFillColor(colors.HexColor('#4680ff33'))
        c.circle(20*mm, 30*mm, 35*mm, fill=1, stroke=0)

        # Badge version (coin supérieur gauche)
        c.setFillColor(colors.HexColor('#ffffff22'))
        c.roundRect(MARGIN_L, H - 52*mm, 30*mm, 8*mm, 3, fill=1, stroke=0)
        c.setFillColor(WHITE)
        c.setFont('Helvetica-Bold', 7.5)
        c.drawString(MARGIN_L + 3*mm, H - 47.5*mm, 'v2.0  |  MAI 2026')

        # Titre principal
        c.setFillColor(WHITE)
        c.setFont('Helvetica-Bold', 48)
        c.drawCentredString(W / 2, H / 2 + 60*mm, 'LiviGo')
        c.setFillColor(GRAY_LIGHT)
        c.setFont('Helvetica', 18)
        c.drawCentredString(W / 2, H / 2 + 46*mm, 'Reference Complète des Fonctionnalités')

        # Ligne décorative
        c.setStrokeColor(PRIMARY)
        c.setLineWidth(2)
        c.line(W/2 - 50*mm, H/2 + 40*mm, W/2 + 50*mm, H/2 + 40*mm)

        # Sous-titre
        c.setFillColor(GRAY_LIGHT)
        c.setFont('Helvetica', 11)
        c.drawCentredString(W / 2, H / 2 + 32*mm, 'Plateforme de Mobilité Urbaine — Dakar, Sénégal')

        # Méta-infos (boîte centrale)
        bx, by, bw, bh = W/2 - 55*mm, H/2 - 10*mm, 110*mm, 52*mm
        c.setFillColor(colors.HexColor('#ffffff0f'))
        c.roundRect(bx, by, bw, bh, 6, fill=1, stroke=0)
        c.setStrokeColor(colors.HexColor('#ffffff22'))
        c.setLineWidth(0.8)
        c.roundRect(bx, by, bw, bh, 6, fill=0, stroke=1)

        meta = [
            ('Plateforme',  'Web Admin + Android (APK natif)'),
            ('Backend',     'Supabase PostgreSQL + Realtime'),
            ('Auteur',      'Mamadou Elimane Wane'),
            ('Contact',     'support@livigo.sn'),
            ('Statut',      '✓ Production Ready'),
        ]
        c.setFont('Helvetica', 9)
        for i, (k, v) in enumerate(meta):
            y = by + bh - 12*mm - i * 7.5*mm
            c.setFillColor(GRAY_LIGHT)
            c.setFont('Helvetica-Bold', 8.5)
            c.drawString(bx + 6*mm, y, f'{k} :')
            c.setFillColor(WHITE)
            c.setFont('Helvetica', 8.5)
            c.drawString(bx + 35*mm, y, v)

        # Stats résumées en bas de boîte
        stats = [('3', 'Applications'), ('45+', 'Fonctionnalités'), ('8', 'Innovations')]
        sw = bw / 3
        for i, (val, lbl) in enumerate(stats):
            sx = bx + i * sw + sw / 2
            sy = by + 8*mm
            c.setFillColor(PRIMARY)
            c.setFont('Helvetica-Bold', 18)
            c.drawCentredString(sx, sy + 4*mm, val)
            c.setFillColor(GRAY_LIGHT)
            c.setFont('Helvetica', 7.5)
            c.drawCentredString(sx, sy - 1*mm, lbl)

        # Bas de page couverture
        c.setFillColor(colors.HexColor('#ffffff15'))
        c.rect(0, 0, W, 18*mm, fill=1, stroke=0)
        c.setFillColor(GRAY_LIGHT)
        c.setFont('Helvetica', 8)
        c.drawCentredString(W/2, 8*mm, 'Document confidentiel — © 2026 LiviGo — Tous droits réservés')
        c.setFillColor(PRIMARY)
        c.setFont('Helvetica-Bold', 8)
        c.drawCentredString(W/2, 3.5*mm, 'livigo.sn  |  github.com/mamadouelimanewane/livreur')

    def wrap(self, *args):
        return (W, H)


# ─── CONSTRUCTION DU DOCUMENT ────────────────────────────────────────────────
story = []
# La couverture est dessinee via onFirstPage (draw_cover)
story.append(pb())

# ════════════════════════════════════════════════════════════════
# TABLE DES MATIÈRES
# ════════════════════════════════════════════════════════════════
story += h1('Table des Matières')
toc_items = [
    ('1.', 'Présentation de la Plateforme LiviGo', '4'),
    ('1.1', 'Architecture Technique', '4'),
    ('1.2', 'Les Trois Applications', '4'),
    ('1.3', 'Technologies Utilisées', '5'),
    ('2.', 'Backoffice Administrateur Web', '5'),
    ('2.1', 'Authentification & Sécurité', '5'),
    ('2.2', 'Tableau de Bord (Dashboard)', '6'),
    ('2.3', 'Gestion des Conducteurs', '6'),
    ('2.4', 'Vérification KYC (LiviProtect)', '7'),
    ('2.5', 'Bonus & Performance Conducteurs', '8'),
    ('2.6', 'Gestion des Utilisateurs', '8'),
    ('2.7', 'Gestion des Courses', '8'),
    ('2.8', 'Dispatch Manuel & Auto-Dispatch IA', '9'),
    ('2.9', 'Surge Pricing Dynamique', '10'),
    ('2.10', 'LiviWallet — Portefeuille Numérique', '10'),
    ('2.11', 'LiviStars — Programme de Fidélité', '11'),
    ('2.12', 'Parrainage & Referral', '11'),
    ('2.13', 'Alertes SOS Actives', '12'),
    ('2.14', 'Carte Thermique Prédictive', '12'),
    ('2.15', 'Rapports & Analytics', '13'),
    ('2.16', 'Configuration & Paramètres', '13'),
    ('3.', 'Application Mobile — Utilisateur', '14'),
    ('3.1', 'Commande de Course', '14'),
    ('3.2', 'Suivi & Sécurité', '15'),
    ('3.3', 'Paiements & Fidélité', '15'),
    ('4.', 'Application Mobile — Conducteur', '16'),
    ('4.1', 'Gestion des Courses', '16'),
    ('4.2', 'Revenus & Retraits', '17'),
    ('5.', 'Innovations Uber-Grade', '17'),
    ('5.1', 'LiviBrain — IA Prédictive', '17'),
    ('5.2', 'LiviProtect — Sécurité', '18'),
    ('5.3', 'LiviVoice — Interface Vocale', '18'),
    ('5.4', 'LiviGreen — Éco-Responsabilité', '18'),
    ('5.5', 'LiviShare — Covoiturage', '19'),
    ('5.6', 'LiviFlex — Crédit de Mobilité', '19'),
    ('5.7', 'LiviCommunity — Analytics', '19'),
    ('6.', 'Infrastructure & Déploiement', '20'),
    ('7.', 'Inventaire Complet des Fonctionnalités', '21'),
    ('8.', 'Guide Technique — Build APK', '24'),
    ('9.', 'Support & Contact', '25'),
]
toc_data = []
for num, title, page in toc_items:
    is_main = not num[1:].startswith('.')  if len(num) <= 2 else False
    is_main = num.endswith('.') and num[:-1].isdigit()
    dots = '.' * max(1, 70 - len(num) - len(title))
    if is_main:
        toc_data.append([
            Paragraph(f'<b>{num}  {title}</b>',
                      sty('TM', fontName='Helvetica-Bold', fontSize=10, textColor=DARK)),
            Paragraph(f'<b>{page}</b>',
                      sty('TP', fontName='Helvetica-Bold', fontSize=10, textColor=PRIMARY, alignment=TA_RIGHT)),
        ])
    else:
        toc_data.append([
            Paragraph(f'<font color="#64748b" size="9">   {num}  {title}</font>',
                      sty('TM2', fontName='Helvetica', fontSize=9, textColor=GRAY)),
            Paragraph(f'<font color="#94a3b8" size="9">{page}</font>',
                      sty('TP2', fontName='Helvetica', fontSize=9, textColor=GRAY, alignment=TA_RIGHT)),
        ])

toc_table = Table(toc_data, colWidths=[155*mm, 10*mm])
toc_table.setStyle(TableStyle([
    ('TOPPADDING', (0,0), (-1,-1), 3),
    ('BOTTOMPADDING', (0,0), (-1,-1), 2),
    ('LINEBELOW', (0,0), (-1,-1), 0.3, colors.HexColor('#e2e8f0')),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
]))
story.append(toc_table)
story.append(pb())


# ════════════════════════════════════════════════════════════════
# 1. PRÉSENTATION
# ════════════════════════════════════════════════════════════════
story += h1('Présentation de la Plateforme LiviGo', '1.')
story += para(
    'LiviGo est une plateforme complète de mobilité urbaine développée pour le marché sénégalais. '
    'Elle connecte passagers et clients avec des conducteurs de moto-taxi, taxis et services de livraison '
    'via une interface web d\'administration et des applications Android natives. La plateforme intègre '
    'des fonctionnalités de niveau Uber : IA prédictive, surge pricing, portefeuille numérique, programme '
    'de fidélité, vérification KYC et sécurité temps réel.'
)
story.append(spacer(6))

story += h2('1.1 Architecture Technique')
story.append(
    make_table(
        ['Couche', 'Technologie', 'Version', 'Rôle'],
        [
            ['Frontend Admin', 'React + Vite', '19 / 8', 'Interface web backoffice'],
            ['Routing', 'React Router', '6', 'Navigation SPA'],
            ['Backend', 'Supabase', 'Cloud', 'PostgreSQL + Realtime + Auth'],
            ['Mobile', 'Capacitor', '8', 'Wrapper Android natif (APK)'],
            ['Cartographie', 'Leaflet / OSM', '1.9', 'Cartes interactives'],
            ['Notifications', 'Firebase FCM', 'v9', 'Push notifications'],
            ['Paiements', 'Orange Money / Wave', '—', 'Mobile Money Sénégal'],
            ['Déploiement web', 'Vercel', '—', 'CDN + SSL automatique'],
            ['CI/CD APK', 'GitHub Actions', '—', 'Build automatique Android'],
        ],
        col_widths=[0.20, 0.22, 0.13, 0.45],
    )
)
story.append(spacer(8))

story += h2('1.2 Les Trois Applications')
story.append(
    make_table(
        ['Application', 'Cible', 'Plateforme', 'APK / URL', 'Fonctions Clés'],
        [
            ['LiviGo Admin', 'Administrateurs', 'Web + Mobile', 'livigo.sn/login', 'Gestion complète, analytics, config'],
            ['LiviGo Utilisateur', 'Clients', 'Android', 'LiviGo-client.apk', 'Commander courses, payer, fidélité'],
            ['LiviGo Conducteur', 'Chauffeurs', 'Android', 'LiviGo-driver.apk', 'Accepter courses, gérer revenus, KYC'],
        ],
        col_widths=[0.20, 0.15, 0.14, 0.18, 0.33],
    )
)
story.append(spacer(8))

story += h2('1.3 Technologies Utilisées')
techs = [
    ['React 19', 'Frontend SPA', 'Hooks, Context, lazy loading'],
    ['Supabase', 'BaaS', 'PostgreSQL, Realtime subscriptions, Row Level Security'],
    ['Leaflet 1.9', 'Cartographie', 'Maps interactives, marqueurs, heatmap, clustering'],
    ['Capacitor 8', 'Mobile', 'Bridge JS→Android, plugins natifs'],
    ['Vite 8', 'Build tool', 'HMR, tree-shaking, chunks optimisés'],
    ['reportlab', 'PDF', 'Génération documents PDF (Python)'],
    ['docx', 'Word', 'Génération documents .docx (Node.js)'],
    ['Firebase', 'Push / Auth', 'FCM tokens, notifications push ciblées'],
]
story.append(make_table(
    ['Technologie', 'Catégorie', 'Usage'],
    techs,
    col_widths=[0.18, 0.15, 0.67],
))
story.append(pb())


# ════════════════════════════════════════════════════════════════
# 2. BACKOFFICE ADMINISTRATEUR
# ════════════════════════════════════════════════════════════════
story += h1('Backoffice Administrateur Web', '2.')
story += para(
    'L\'interface d\'administration offre une vue complète et temps réel de la plateforme. '
    'Elle est accessible depuis tout navigateur moderne et propose plus de 45 modules de gestion. '
    'La navigation latérale est organisée par sections thématiques pour une prise en main rapide.'
)
story.append(spacer(4))

# 2.1 Auth
story += h2('2.1 Authentification & Sécurité')
story.append(b('URL d\'accès : https://livigo.sn/login (ou localhost:5173 en dev)'))
story.append(b('Authentification Supabase avec JWT + mode fallback mock pour la démonstration'))
story.append(b('Session persistante via localStorage — expiration configurable'))
story.append(b('Déconnexion automatique après inactivité prolongée'))
story.append(b('Rôles et permissions granulaires par administrateur (sous-admin)'))
story.append(spacer(4))
story.append(
    make_table(
        ['Rôle', 'Email de démo', 'Mot de passe', 'Accès'],
        [
            ['Super Admin', 'admin@livigo.com', 'admin123', 'Accès total toutes sections'],
            ['Conducteur (démo)', 'driver@livigo.com', 'driver123', 'App conducteur uniquement'],
            ['Client (démo)', 'user@livigo.com', 'user123', 'App utilisateur uniquement'],
        ],
        col_widths=[0.20, 0.28, 0.18, 0.34],
        header_color=INDIGO,
    )
)
story.append(spacer(10))

# 2.2 Dashboard
story += h2('2.2 Tableau de Bord (Dashboard)')
story += para('Page principale affichant les KPIs et graphiques en temps réel. Indicateur "LIVE" si Supabase est connecté.')
story.append(badge_table([
    ['KPIs en temps réel', 'Courses actives, complétées, annulées, revenus du jour/semaine/mois', '✅'],
    ['Graphique tendances', 'Barres / courbes sur 7 jours avec toggle période', '✅'],
    ['Carte conducteurs', 'Marqueurs live sur Leaflet avec statut coloré', '✅'],
    ['Flux d\'activité', 'Événements récents horodatés (courses, inscriptions...)', '✅'],
    ['Indicateur DB', 'Badge vert "LIVE" ou orange "DEMO" selon connexion Supabase', '✅'],
    ['Conducteurs en ligne', 'Compteur temps réel via Supabase Realtime', '✅'],
]))
story.append(spacer(10))

# 2.3 Conducteurs
story += h2('2.3 Gestion des Conducteurs')
story += h3('2.3.1 Liste & Filtres')
story.append(badge_table([
    ['Liste paginée', '50 conducteurs par page avec navigation', '✅'],
    ['Filtres multi-critères', 'Zone, statut (actif/inactif/en attente), type véhicule', '✅'],
    ['Recherche live', 'Par nom, téléphone, email — instantané', '✅'],
    ['Export CSV', 'Téléchargement des données filtrées via exportService', '✅'],
    ['Actions rapides', 'Voir profil, approuver, rejeter depuis la liste', '✅'],
    ['Tri colonnes', 'Par nom, date, note, statut', '✅'],
]))
story.append(spacer(6))
story += h3('2.3.2 Profil Détaillé Conducteur')
story.append(badge_table([
    ['Informations personnelles', 'Nom, téléphone, email, zone, véhicule, plaque, année', '✅'],
    ['Statistiques', 'Nombre de courses, gains totaux, note moyenne, taux d\'acceptation', '✅'],
    ['Badge sécurité', 'Score LiviProtect (0-100) avec couleur de risque', '✅'],
    ['Approbation DB', 'Boutons Approuver/Rejeter avec écriture Supabase en temps réel', '✅'],
    ['Onglets', '4 onglets : Informations, Performance, Transactions, Historique', '✅'],
    ['Fetch live', 'Données Supabase avec fallback mock si hors ligne', '✅'],
]))
story.append(spacer(6))
story += h3('2.3.3 Statuts & Présence')
story.append(b('Conducteurs en ligne / hors ligne avec timestamp de dernière connexion'))
story.append(b('Statut de disponibilité : Disponible / En course / Hors ligne'))
story.append(b('Dernière position GPS connue'))
story.append(b('Rapport en ligne : temps de connexion par conducteur sur la journée'))
story.append(spacer(6))
story += h3('2.3.4 Documents & Expiration')
story.append(b('Documents proches d\'expiration : alerte 30 jours avant échéance'))
story.append(b('Documents expirés : liste rouge avec blocage automatique du compte'))
story.append(b('Historique des renouvellements par conducteur'))
story.append(b('Types de documents : CNI, Permis de conduire, Carte grise, Assurance, Selfie'))
story.append(spacer(10))

# 2.4 KYC
story += h2('2.4 Vérification KYC — LiviProtect')
story += para(
    'Système de vérification d\'identité avancé combinant analyse documentaire et biométrie IA '
    'pour garantir la fiabilité des conducteurs inscrits sur la plateforme.'
)
story.append(badge_table([
    ['Documents KYC requis', 'CNI recto/verso, Permis de conduire, Photo véhicule, Selfie', '✅'],
    ['Score selfie IA', 'Pourcentage de correspondance selfie ↔ CNI (0-100%)', '✅'],
    ['Score de risque', 'Indice LiviProtect calculé à l\'inscription (0-100)', '✅'],
    ['Filtres de vérification', 'En attente / Approuvés / Rejetés / Tous', '✅'],
    ['Approbation 1-clic', 'Valider ou rejeter un dossier KYC directement depuis l\'interface', '✅'],
    ['Historique KYC', 'Suivi des actions admin par dossier', '✅'],
    ['Blocage automatique', 'Compte bloqué si rejet KYC ou score de risque > seuil', '✅'],
], header_color=PURPLE))
story.append(spacer(10))

# 2.5 Bonus
story += h2('2.5 Bonus & Performance Conducteurs')
story.append(badge_table([
    ['Objectifs configurables', 'Nombre de courses/semaine, note minimale, taux acceptation', '✅'],
    ['Bonus automatiques', 'Crédit automatique si seuils atteints en fin de période', '✅'],
    ['Classement', 'Top conducteurs par performance (courses, gains, note)', '✅'],
    ['Historique bonus', 'Tableau des bonus versés avec montants et dates', '✅'],
]))
story.append(spacer(10))

# 2.6 Utilisateurs
story += h2('2.6 Gestion des Utilisateurs')
story.append(badge_table([
    ['Liste clients', 'Tous les clients inscrits avec pagination et recherche', '✅'],
    ['Historique courses', 'Toutes les courses d\'un client avec statuts et montants', '✅'],
    ['Solde LiviWallet', 'Solde du portefeuille et historique des transactions', '✅'],
    ['Points LiviStars', 'Points accumulés, niveau de fidélité, avantages', '✅'],
    ['Signalement', 'Marquer un compte comme suspect + blocage temporaire', '✅'],
    ['Parrainage', 'Code parrain, filleuls actifs, bonus crédités', '✅'],
]))
story.append(spacer(10))

# 2.7 Courses
story += h2('2.7 Gestion des Courses')
story += para('Deux services distincts (Livraison et Taxi) avec 6 statuts chacun, soit 12 vues de courses.')
story.append(
    make_table(
        ['Statut', 'Description', 'Actions Disponibles', 'Service'],
        [
            ['En cours', 'Courses actives en ce moment', 'Voir sur carte, intervenir, contacter', 'Livraison + Taxi'],
            ['Terminées', 'Courses complétées avec succès', 'Voir reçu PDF, noter, rembourser', 'Livraison + Taxi'],
            ['Annulées', 'Courses annulées par client ou conducteur', 'Voir raison, rembourser, analyser', 'Livraison + Taxi'],
            ['Échouées', 'Non assignées ou erreur technique', 'Relancer dispatch, analyser cause', 'Livraison + Taxi'],
            ['Auto-annulées', 'Annulées par timeout système (30s)', 'Analyser, ajuster paramètres', 'Livraison + Taxi'],
            ['Toutes', 'Vue complète toutes catégories', 'Filtrer, exporter CSV, rechercher', 'Livraison + Taxi'],
        ],
        col_widths=[0.13, 0.25, 0.35, 0.27],
    )
)
story.append(spacer(6))
story.append(info_box('Reçu PDF Imprimable', [
    'Bouton "Imprimer le reçu" sur les courses terminées',
    'Reçu formaté avec logo LiviGo, ID course, date, trajet, conducteur, montant, mode de paiement',
    'Ouverture dans une fenêtre d\'impression native du navigateur',
    'Disponible pour cours Livraison et Taxi',
], color=SUCCESS))
story.append(spacer(10))

# 2.8 Dispatch
story += h2('2.8 Dispatch Manuel & Auto-Dispatch IA')
story += h3('Formulaire de Dispatch Manuel')
story.append(badge_table([
    ['Formulaire course', 'Type service, client, départ, arrivée, notes opérateur', '✅'],
    ['Estimation prix', 'Calcul automatique via API Nominatim OSM + tarifs par service', '✅'],
    ['Conducteurs disponibles', 'Liste filtrée par zone avec note, distance, téléphone', '✅'],
    ['Sélection manuelle', 'L\'opérateur choisit le conducteur et confirme', '✅'],
    ['Confirmation DB', 'Création de la course dans Supabase avec statut "assigned"', '✅'],
], header_color=INDIGO))
story.append(spacer(6))
story += h3('Auto-Dispatch IA (LiviBrain)')
story += para('Algorithme de scoring multicritères qui sélectionne automatiquement le meilleur conducteur disponible.')
story.append(
    make_table(
        ['Critère', 'Poids', 'Calcul'],
        [
            ['Distance GPS', '50%', 'Algorithme Haversine — conducteurs dans rayon 5 km'],
            ['Note moyenne', '30%', 'Note sur 5 étoiles normalisée (0-1)'],
            ['Taux d\'acceptation', '20%', 'Pourcentage historique d\'acceptation des courses'],
        ],
        col_widths=[0.30, 0.15, 0.55],
        header_color=INDIGO,
    )
)
story.append(spacer(6))
story.append(info_box('Fonctionnement Auto-Dispatch', [
    '1. Récupération de tous les conducteurs en ligne dans la base Supabase',
    '2. Calcul de la distance Haversine depuis le point de départ',
    '3. Filtrage des conducteurs dans un rayon de 5 km',
    '4. Calcul du score pondéré (distance + note + taux d\'acceptation)',
    '5. Sélection du conducteur avec le score le plus élevé',
    '6. Attribution automatique et notification push au conducteur',
], color=INDIGO))
story.append(spacer(10))

# 2.9 Surge Pricing
story += h2('2.9 Surge Pricing Dynamique')
story += para('Multiplicateurs de tarif activables par zone selon la demande. Compatible avec les règles automatiques par heure.')
story.append(badge_table([
    ['Zones configurables', '12 zones de Dakar : Plateau, Médina, Almadies, Parcelles...', '✅'],
    ['Multiplicateurs', 'De ×1.0 à ×3.0 par paliers de 0.25', '✅'],
    ['Activation manuelle', 'Admin active un surge pour une zone avec durée (15min→4h)', '✅'],
    ['Règles automatiques', 'Heure de pointe matin ×1.5, Soir ×1.7, Nuit ×1.3', '✅'],
    ['Aperçu prix', '"1 500 FCFA devient 2 250 FCFA" affiché en temps réel', '✅'],
    ['Dashboard surge', 'Zones actives, multiplicateur max, revenu estimé supplémentaire', '✅'],
    ['Expiration auto', 'Désactivation automatique à la fin de la durée configurée', '✅'],
], header_color=WARNING))
story.append(spacer(10))

# 2.10 Wallet
story += h2('2.10 LiviWallet — Portefeuille Numérique')
story += para('Système de portefeuille intégré pour les paiements sans espèces sur la plateforme.')
story.append(badge_table([
    ['Solde en temps réel', 'Affichage du solde avec mise à jour instantanée après chaque transaction', '✅'],
    ['Recharge Orange Money', 'Flux en 3 étapes : numéro → montant → confirmation → crédit', '✅'],
    ['Recharge Wave', 'Même flux avec interface Wave Money', '✅'],
    ['Recharge Free Money', 'Compatible opérateur Free Sénégal', '✅'],
    ['Historique complet', 'Toutes les transactions : recharges, paiements, bonus, remboursements', '✅'],
    ['Profil fidélité intégré', 'Niveau LiviStars et progression affichés dans le wallet', '✅'],
    ['Bonus automatiques', 'Crédit wallet lors d\'événements (parrainage, fidélité)', '✅'],
], header_color=SUCCESS))
story.append(spacer(10))

# 2.11 LiviStars
story += h2('2.11 LiviStars — Programme de Fidélité')
story += para('Programme à 5 niveaux progressifs pour récompenser les clients les plus actifs.')
story.append(
    make_table(
        ['Niveau', 'Points Requis', 'Réduction Courses', 'Avantages Exclusifs'],
        [
            ['🥉 Bronze', '0 pts', '0%', 'Accès au programme, accumulation de points'],
            ['🥈 Argent', '500 pts', '5%', 'Réduction sur chaque course'],
            ['🥇 Or', '1 500 pts', '10%', 'Priorité dispatch + réduction'],
            ['💎 Platine', '4 000 pts', '15%', 'Support prioritaire + réductions + accès beta'],
            ['👑 Diamant', '10 000 pts', '20%', 'Tous avantages + accès VIP + account manager'],
        ],
        col_widths=[0.18, 0.18, 0.18, 0.46],
    )
)
story.append(spacer(6))
story.append(b('Règle de gain : 1 FCFA dépensé = 1 point LiviStar'))
story.append(b('Classement Top 10 clients (leaderboard avec podium)'))
story.append(b('Distribution par niveau : graphique barres pour l\'admin'))
story.append(b('Expiration des points : 12 mois sans activité'))
story.append(spacer(10))

# 2.12 Parrainage
story += h2('2.12 Parrainage & Referral')
story.append(badge_table([
    ['Lien unique', 'Chaque utilisateur a un code parrain unique partageable', '✅'],
    ['Bonus parrain', '1 000 FCFA crédités à l\'inscription du filleul', '✅'],
    ['Bonus filleul', '500 FCFA crédités sur la première course du filleul', '✅'],
    ['Suivi filleuls', 'Liste des filleuls avec statut (complété / en attente / expiré)', '✅'],
    ['Configuration admin', 'Montants éditables, nombre de courses min., validité (30 jours)', '✅'],
    ['Top 5 parrains', 'Classement des meilleurs parrains avec badges', '✅'],
    ['Statistiques globales', 'Total parrainages, montant distribué, taux de conversion', '✅'],
], header_color=PURPLE))
story.append(spacer(10))

# 2.13 SOS
story += h2('2.13 Alertes SOS Actives — LiviProtect')
story += para('Système de sécurité temps réel. Le tableau de bord admin affiche les alertes SOS actives avec intervention rapide.')
story.append(badge_table([
    ['Bannière urgence', 'Alerte rouge en haut de page si des SOS sont actifs', '✅'],
    ['Localisation GPS', 'Coordonnées exactes du déclenchement avec lien OpenStreetMap', '✅'],
    ['Chronométrage', '"Il y a X min" depuis le déclenchement — actualisé toutes les 30s', '✅'],
    ['Informations course', 'Conducteur, client, ID de la course liée', '✅'],
    ['Types d\'urgence', 'Urgence médicale, Accident, Comportement suspect, Autre', '✅'],
    ['Actions admin', 'Appeler l\'utilisateur directement / Marquer comme résolu', '✅'],
    ['Historique SOS', 'Toutes les alertes avec résolution et délai d\'intervention', '✅'],
], header_color=DANGER))
story.append(spacer(10))

# 2.14 Heatmap
story += h2('2.14 Carte Thermique Prédictive — LiviBrain')
story += para('Visualisation géographique de la demande avec coordonnées GPS réelles de Dakar et prédictions IA.')
story.append(badge_table([
    ['Carte Leaflet', 'Carte centrée sur Dakar avec 12 zones de demande', '✅'],
    ['Cercles intensité', 'Rouge ≥80%, Orange 60-79%, Jaune 40-59%, Vert <40%', '✅'],
    ['Données GPS réelles', 'Coordonnées exactes : Plateau (14.69, -17.44), Médina, Almadies...', '✅'],
    ['Filtres temporels', 'Aujourd\'hui / Cette semaine / Ce mois', '✅'],
    ['Tooltips permanents', 'Zone active, nombre de courses, niveau de prédiction', '✅'],
    ['Prédictions LiviBrain', '5 prévisions horodatées (+1h à +5h) avec % de confiance', '✅'],
    ['Classement zones', '12 zones triées par activité avec barres de progression', '✅'],
]))
story.append(spacer(10))

# 2.15 Rapports
story += h2('2.15 Rapports & Analytics')
story.append(
    make_table(
        ['Rapport', 'Contenu', 'Fréquence', 'Export'],
        [
            ['Financier', 'Revenus, commissions, remboursements, évolution CA', 'Temps réel', 'CSV'],
            ['Opérationnel', 'Courses par période, taux annulation, temps moyen, zones actives', 'Temps réel', 'CSV'],
            ['Conducteurs', 'Performance par conducteur, gains, notes, acceptation', 'Temps réel', 'CSV'],
            ['Tableau Live', 'Carte Leaflet temps réel + flux d\'événements + KPIs live', 'Temps réel', '—'],
            ['Analytics', 'Graphiques avancés, entonnoirs, cohortes, rétention', 'Périodique', 'CSV'],
        ],
        col_widths=[0.20, 0.45, 0.18, 0.17],
    )
)
story.append(spacer(10))

# 2.16 Config
story += h2('2.16 Configuration & Paramètres')
config_items = [
    ['Pays & Zones', 'Ajout/suppression de pays, zones de service géographiques'],
    ['Documents requis', 'Types de documents KYC par catégorie de conducteur'],
    ['Prestations', 'Services disponibles : Moto, Taxi, Livraison express, Alimentaire'],
    ['Cartes de prix', 'Tarifs par service, km, durée, minimum de course'],
    ['Codes promo', 'Création avec date expiration, plafond d\'utilisation, % ou FCFA'],
    ['Courses planifiées', 'Récurrences hebdomadaires avec fenêtres horaires'],
    ['Bannières', 'Gestion des bannières publicitaires dans les apps mobiles'],
    ['Méthodes paiement', 'Activation/désactivation Cash, Wallet, Mobile Money'],
    ['Config email', 'SMTP, templates HTML pour confirmations et alertes'],
    ['Notifications push', 'Tokens FCM, types de notifications, templates'],
    ['Raisons annulation', 'Liste personnalisable des motifs d\'annulation'],
    ['Administrateurs', 'Gestion des sous-admins avec rôles granulaires'],
    ['Tiroir navigation', 'Personnalisation du menu de l\'app mobile'],
    ['App URL', 'Liens de téléchargement et deep links'],
    ['Type de service', 'Configuration Taxi vs Livraison vs Mixte'],
]
story.append(make_table(
    ['Module', 'Fonctionnalité'],
    config_items,
    col_widths=[0.28, 0.72],
))
story.append(pb())


# ════════════════════════════════════════════════════════════════
# 3. APP MOBILE UTILISATEUR
# ════════════════════════════════════════════════════════════════
story += h1('Application Mobile — LiviGo Utilisateur', '3.')
story += para(
    'Application Android dédiée aux clients pour commander des courses et des livraisons. '
    'APK généré via GitHub Actions et installable directement sur tout smartphone Android 8+.'
)
story.append(spacer(6))

story += h2('3.1 Commande de Course')
story.append(badge_table([
    ['Écran d\'accueil', 'Carte interactive avec conducteurs à proximité et bouton "Commander"', '✅'],
    ['Géolocalisation', 'Détection automatique de la position GPS du client', '✅'],
    ['Saisie destination', 'Autocomplétion Nominatim OSM pour toute adresse de Dakar', '✅'],
    ['Choix du service', '4 types : Moto Taxi, Taxi Premium, Livraison Express, Alimentaire', '✅'],
    ['Estimation prix', 'Calcul avant confirmation avec indication surge pricing actif', '✅'],
    ['Confirmation', 'Bouton "Confirmer" → assignation automatique du conducteur', '✅'],
    ['Suivi GPS live', 'Carte temps réel avec position du conducteur et ETA', '✅'],
    ['Statuts visuels', 'En route → Arrivé → En course → Terminé avec animations', '✅'],
], header_color=TEAL))
story.append(spacer(8))

story += h2('3.2 Suivi & Sécurité en Course')
story.append(badge_table([
    ['Carte temps réel', 'Position conducteur actualisée toutes les 5 secondes', '✅'],
    ['Chat conducteur', 'Messagerie intégrée pour communiquer sans appel', '✅'],
    ['Appel direct', 'Bouton d\'appel téléphonique direct au conducteur', '✅'],
    ['Bouton SOS', 'Déclenche une alerte LiviProtect avec position GPS immédiate', '✅'],
    ['Safety Share', 'Partage du trajet en temps réel avec un contact de confiance', '✅'],
    ['ETA dynamique', 'Temps d\'arrivée estimé recalculé selon le trafic', '✅'],
    ['Évaluation', 'Note 1-5 étoiles + commentaire après chaque course', '✅'],
    ['Signalement', 'Signaler un comportement dangereux depuis l\'app', '✅'],
]))
story.append(spacer(8))

story += h2('3.3 Paiements & Fidélité')
story.append(
    make_table(
        ['Fonctionnalité', 'Description', 'Status'],
        [
            ['Cash', 'Paiement en espèces remis au conducteur à l\'arrivée', '✅'],
            ['LiviWallet', 'Débit automatique du portefeuille numérique', '✅'],
            ['Orange Money', 'Paiement via prompt USSD ou API', '✅'],
            ['Wave', 'Paiement via QR code ou deeplink Wave', '✅'],
            ['Code promo', 'Application d\'un code avant confirmation du paiement', '✅'],
            ['Réduction LiviStars', 'Réduction automatique selon le niveau de fidélité', '✅'],
            ['Reçu push', 'Notification push avec détails de la course après paiement', '✅'],
            ['Historique', 'Toutes les courses avec montants, modes de paiement, reçus', '✅'],
            ['LiviWallet recharge', 'Recharger depuis l\'app via Mobile Money', '✅'],
            ['Points LiviStars', 'Crédit automatique après chaque course payée', '✅'],
            ['Code parrainage', 'Code personnel partageable pour inviter des amis', '✅'],
            ['LiviGreen score', 'CO₂ économisé par trajet vs voiture individuelle', '✅'],
        ],
        col_widths=[0.28, 0.60, 0.12],
    )
)
story.append(pb())


# ════════════════════════════════════════════════════════════════
# 4. APP MOBILE CONDUCTEUR
# ════════════════════════════════════════════════════════════════
story += h1('Application Mobile — LiviGo Conducteur', '4.')
story += para(
    'Application dédiée aux chauffeurs pour gérer leur activité, accepter les courses, '
    'suivre leurs revenus et maintenir leur profil certifié LiviProtect.'
)
story.append(spacer(6))

story += h2('4.1 Inscription & Validation KYC')
story.append(badge_table([
    ['Formulaire inscription', 'Nom, téléphone, email, type véhicule, zone de travail', '✅'],
    ['Upload documents', 'CNI recto/verso, Permis, Carte grise, Photo véhicule, Selfie', '✅'],
    ['Analyse IA selfie', 'Score de correspondance selfie ↔ CNI calculé automatiquement', '✅'],
    ['Score de risque', 'Indice LiviProtect calculé à la soumission', '✅'],
    ['Délai validation', '24h maximum — notification push à l\'approbation', '✅'],
    ['Statut en temps réel', 'Suivi du statut KYC depuis l\'app (en attente / approuvé / rejeté)', '✅'],
]))
story.append(spacer(8))

story += h2('4.2 Tableau de Bord Conducteur')
story.append(badge_table([
    ['Toggle disponibilité', 'Basculer En ligne / Hors ligne en un tap', '✅'],
    ['Gains temps réel', 'Revenus du jour, de la semaine, du mois', '✅'],
    ['Compteurs', 'Nombre de courses effectuées, taux d\'acceptation, note moyenne', '✅'],
    ['Objectifs bonus', 'Prochains paliers de bonus avec progression visuelle', '✅'],
    ['Carte heatmap', 'Zones à forte demande visibles depuis le tableau de bord', '✅'],
    ['Alertes surge', 'Notification si une zone proche est en mode surge pricing', '✅'],
]))
story.append(spacer(8))

story += h2('4.3 Gestion des Courses')
story.append(
    make_table(
        ['Étape', 'Action', 'Délai', 'Notification'],
        [
            ['Réception', 'Popup avec départ, arrivée, prix estimé, distance', '30 secondes', 'Push + son d\'alerte'],
            ['Acceptation', 'Bouton "Accepter" → conducteur assigné', '—', 'Client notifié'],
            ['Refus', 'Bouton "Refuser" avec raison', '—', 'Reassignation auto'],
            ['En route', 'Navigation GPS vers le client', '—', 'ETA envoyé au client'],
            ['Arrivée', 'Bouton "Je suis arrivé" → client averti', '—', 'Push au client'],
            ['Démarrage', 'Bouton "Démarrer la course"', '—', 'Minuterie déclenchée'],
            ['Fin de course', 'Bouton "Terminer" → calcul montant final', '—', 'Reçu client + paiement'],
        ],
        col_widths=[0.16, 0.35, 0.18, 0.31],
    )
)
story.append(spacer(8))

story += h2('4.4 Revenus & Retraits')
story.append(badge_table([
    ['Solde disponible', 'Montant disponible pour retrait après déduction commission', '✅'],
    ['Historique gains', 'Détail par course avec date, montant brut, commission, net', '✅'],
    ['Demande retrait', 'Orange Money, Wave, Virement bancaire — traitement 24-48h', '✅'],
    ['Commission LiviGo', 'Configurable depuis l\'admin (défaut 15% par course)', '✅'],
    ['Bonus performance', 'Crédités automatiquement si objectifs atteints', '✅'],
    ['Rapport hebdomadaire', 'Récapitulatif PDF des gains de la semaine', '✅'],
]))
story.append(pb())


# ════════════════════════════════════════════════════════════════
# 5. INNOVATIONS UBER-GRADE
# ════════════════════════════════════════════════════════════════
story += h1('Innovations Uber-Grade', '5.')
story += para(
    'LiviGo intègre 8 innovations propriétaires de niveau entreprise, comparables aux meilleures '
    'plateformes mondiales et adaptées au marché sénégalais et ouest-africain.'
)
story.append(spacer(8))

story += h2('5.1 LiviBrain — Intelligence Artificielle Prédictive')
story.append(info_box('LiviBrain — Moteur IA de LiviGo', [
    'Prédiction de la demande par zone et par heure (modèle ML entraîné sur données historiques)',
    'Algorithme de dispatch automatique multicritères (Haversine + scoring pondéré)',
    'Analyse des patterns de trafic et comportements de course pour optimisation',
    'Détection d\'anomalies : comportements frauduleux, courses suspectes, outliers de prix',
    'Recommandations de zones rentables pour les conducteurs selon heure et météo',
    'Prédictions heatmap avec intervalles de confiance (ex: 94% confiance sur +1h)',
    'Optimisation dynamique des règles de surge pricing selon les prévisions',
], color=PRIMARY))
story.append(spacer(8))

story += h2('5.2 LiviProtect — Sécurité Intégrée 360°')
story.append(badge_table([
    ['Bouton SOS 24/7', 'Déclenchement d\'alerte avec envoi GPS immédiat et notification admin', '✅'],
    ['Safety Share', 'Partage de trajet temps réel avec un proche via lien sécurisé', '✅'],
    ['KYC biométrique', 'Vérification d\'identité avec analyse IA du selfie', '✅'],
    ['Score de risque', 'Indice calculé à l\'inscription et réévalué périodiquement', '✅'],
    ['Signalement', 'Signaler comportement dangereux → alerte admin instantanée', '✅'],
    ['Dashboard SOS', 'Vue admin des alertes actives avec géolocalisation GPS', '✅'],
    ['Historique alertes', 'Toutes les alertes avec résolution, délai d\'intervention', '✅'],
], header_color=DANGER))
story.append(spacer(8))

story += h2('5.3 LiviVoice — Interface Vocale Multilingue')
story.append(b('Support Wolof et Français dans l\'interface utilisateur'))
story.append(b('Commandes vocales pour la navigation (destination, confirmation)'))
story.append(b('Notifications audio dans la langue choisie par l\'utilisateur'))
story.append(b('Adapté au contexte sénégalais : noms de lieux locaux, expressions courantes'))
story.append(b('Accessibilité : interface vocale pour utilisateurs peu alphabétisés'))
story.append(spacer(8))

story += h2('5.4 LiviGreen — Éco-Responsabilité')
story.append(b('Score carbone calculé par trajet (CO₂ économisé vs voiture individuelle)'))
story.append(b('Préférence automatique pour les véhicules électriques et motos légères'))
story.append(b('Rapport mensuel d\'impact environnemental par utilisateur'))
story.append(b('Badge "Utilisateur Éco" affiché sur le profil'))
story.append(b('Objectifs collectifs : CO₂ total économisé par la communauté LiviGo'))
story.append(spacer(8))

story += h2('5.5 LiviShare — Covoiturage Intelligent')
story.append(b('Partage de course entre plusieurs passagers allant dans la même direction'))
story.append(b('Réduction du coût jusqu\'à 40% pour chaque passager'))
story.append(b('Matching intelligent par itinéraire via algorithme de proximité'))
story.append(b('Évaluation séparée pour chaque passager par le conducteur'))
story.append(b('Mode "Eco Partage" visible sur la carte principale'))
story.append(spacer(8))

story += h2('5.6 LiviFlex — Crédit de Mobilité')
story.append(b('Avance sur course pour les utilisateurs vérifiés et actifs'))
story.append(b('Remboursement automatique débité sur la prochaine transaction LiviWallet'))
story.append(b('Limite de crédit évolutive selon l\'historique d\'utilisation et le niveau LiviStars'))
story.append(b('Intégration avec opérateurs de microfinance partenaires'))
story.append(b('Taux zéro pour les membres Diamant'))
story.append(spacer(8))

story += h2('5.7 LiviCommunity — Analytics Communautaires')
story.append(b('Statistiques d\'utilisation anonymisées par quartier et par commune'))
story.append(b('Rapport de mobilité urbaine mensuel partageable avec les collectivités'))
story.append(b('Dashboard partenaires : mairies, entreprises, universités'))
story.append(b('Indicateurs : flux de déplacement, heures de pointe, zones sous-desservies'))
story.append(b('API ouverte pour intégration Smart City'))
story.append(spacer(8))

story.append(info_box('LiviBrain — Panneau d\'Innovations Admin', [
    'Un panneau dédié dans le backoffice présente les 8 innovations avec état (actif/bêta/planifié)',
    'Métriques globales : prédictions IA actives, utilisateurs LiviVoice, CO₂ économisé (LiviGreen)',
    'Statistiques LiviShare : courses partagées, économies générées',
    'Suivi LiviFlex : crédits actifs, montant total avancé, taux de remboursement',
    'Analytics LiviCommunity : communes desservies, partenaires connectés',
], color=INDIGO))
story.append(pb())


# ════════════════════════════════════════════════════════════════
# 6. INFRASTRUCTURE & DÉPLOIEMENT
# ════════════════════════════════════════════════════════════════
story += h1('Infrastructure & Déploiement', '6.')
story.append(spacer(4))

story += h2('6.1 Variables d\'Environnement (.env)')
story.append(make_table(
    ['Variable', 'Description', 'Obligatoire'],
    [
        ['VITE_SUPABASE_URL', 'URL du projet Supabase (ex: https://xxx.supabase.co)', 'Oui'],
        ['VITE_SUPABASE_ANON_KEY', 'Clé publique Supabase (anon key)', 'Oui'],
        ['VITE_FIREBASE_API_KEY', 'Clé API Firebase pour les notifications push', 'Oui'],
        ['VITE_FIREBASE_PROJECT_ID', 'ID du projet Firebase FCM', 'Oui'],
        ['VITE_FIREBASE_VAPID_KEY', 'Clé VAPID pour Web Push', 'Oui'],
        ['VITE_APP_TARGET', 'Target de build : admin / user / driver', 'Build mobile'],
    ],
    col_widths=[0.35, 0.50, 0.15],
))
story.append(spacer(8))

story += h2('6.2 Tables Supabase Requises')
story.append(make_table(
    ['Table', 'Description', 'Colonnes Clés'],
    [
        ['drivers', 'Profils conducteurs', 'id, name, phone, status, rating, zone, vehicle'],
        ['rides', 'Historique courses', 'id, driver_id, user_id, status, price, pickup, dropoff'],
        ['users', 'Profils clients', 'id, name, phone, wallet_balance, loyalty_points'],
        ['ratings', 'Évaluations', 'id, ride_id, from_user, to_driver, rating, comment'],
        ['wallets', 'Portefeuilles', 'id, user_id, balance, currency'],
        ['wallet_transactions', 'Transactions', 'id, wallet_id, amount, type, status, created_at'],
        ['loyalty_points', 'Points fidélité', 'id, user_id, points, event_type, created_at'],
        ['referrals', 'Parrainages', 'id, referrer_id, referred_id, status, bonus_paid'],
        ['sos_alerts', 'Alertes SOS', 'id, user_id, ride_id, type, lat, lon, resolved_at'],
        ['kyc_verifications', 'KYC', 'id, driver_id, status, selfie_match_score, risk_score'],
        ['surge_pricing', 'Surge pricing', 'id, zone, multiplier, label, expires_at, active'],
        ['device_tokens', 'Tokens FCM', 'id, user_id, token, device_type, updated_at'],
        ['driver_bonuses', 'Bonus', 'id, driver_id, amount, reason, paid_at'],
        ['scheduled_rides', 'Courses planifiées', 'id, user_id, recurrence, time_slot, service_type'],
    ],
    col_widths=[0.22, 0.25, 0.53],
))
story.append(spacer(8))

story += h2('6.3 Déploiement Web (Vercel)')
story.append(b('URL production : https://livreur-*.vercel.app'))
story.append(b('Déploiement automatique à chaque push sur la branche main'))
story.append(b('Variables d\'environnement configurées dans le Dashboard Vercel'))
story.append(b('vercel.json configure les redirections SPA (fallback index.html)'))
story.append(b('CDN mondial avec cache automatique des assets statiques'))
story.append(spacer(8))

story += h2('6.4 Sécurité Supabase (RLS)')
story.append(b('Row Level Security activé sur toutes les tables sensibles'))
story.append(b('Policies : les conducteurs ne voient que leurs propres données'))
story.append(b('Les clients ne voient que leurs courses et leur wallet'))
story.append(b('Admins : accès complet avec service_role key côté serveur'))
story.append(pb())


# ════════════════════════════════════════════════════════════════
# 7. INVENTAIRE COMPLET
# ════════════════════════════════════════════════════════════════
story += h1('Inventaire Complet des Fonctionnalités', '7.')
story.append(spacer(4))

story += h2('7.1 Administration Web — 45+ Fonctionnalités')
story.append(make_table(
    ['#', 'Module', 'Fonctionnalité', 'Statut'],
    [
        ['01', 'Dashboard', 'KPIs temps réel — courses, revenus, conducteurs actifs', '✅'],
        ['02', 'Dashboard', 'Graphiques de tendances 7 jours (barres + courbe)', '✅'],
        ['03', 'Dashboard', 'Carte Leaflet live des conducteurs avec statuts colorés', '✅'],
        ['04', 'Dashboard', 'Flux d\'activité récente horodaté', '✅'],
        ['05', 'Dashboard', 'Indicateur connexion DB (LIVE / DEMO)', '✅'],
        ['06', 'Conducteurs', 'Liste paginée (50/page) avec filtres multi-critères', '✅'],
        ['07', 'Conducteurs', 'Recherche instantanée nom/téléphone/email', '✅'],
        ['08', 'Conducteurs', 'Profil détaillé 4 onglets + badge sécurité', '✅'],
        ['09', 'Conducteurs', 'Approbation/rejet avec écriture Supabase temps réel', '✅'],
        ['10', 'Conducteurs', 'Export CSV des données filtrées', '✅'],
        ['11', 'Conducteurs', 'Conducteurs par véhicule, statut, zone', '✅'],
        ['12', 'KYC', 'Interface de vérification documents avec score IA', '✅'],
        ['13', 'KYC', 'Score de risque LiviProtect (0-100)', '✅'],
        ['14', 'KYC', 'Filtres par statut KYC + approbation 1-clic', '✅'],
        ['15', 'Bonus', 'Objectifs de performance configurables', '✅'],
        ['16', 'Bonus', 'Classement conducteurs + historique bonus versés', '✅'],
        ['17', 'Utilisateurs', 'Liste complète clients avec historique courses', '✅'],
        ['18', 'Utilisateurs', 'Solde LiviWallet + points LiviStars par client', '✅'],
        ['19', 'Courses', '6 statuts × 2 services (12 vues distinctes)', '✅'],
        ['20', 'Courses', 'Reçu PDF imprimable depuis le navigateur', '✅'],
        ['21', 'Dispatch', 'Formulaire manuel avec estimation prix Nominatim', '✅'],
        ['22', 'Dispatch', 'Auto-Dispatch IA (Haversine + scoring multicritères)', '✅'],
        ['23', 'Dispatch', 'Sélection manuelle conducteur avec note et distance', '✅'],
        ['24', 'Surge', 'Activation manuelle par zone avec durée', '✅'],
        ['25', 'Surge', 'Règles automatiques heure de pointe', '✅'],
        ['26', 'Surge', 'Aperçu prix avant/après surge', '✅'],
        ['27', 'Wallet', 'Tableau de bord LiviWallet avec soldes', '✅'],
        ['28', 'Wallet', 'Historique transactions + recharges Mobile Money', '✅'],
        ['29', 'Fidélité', 'Programme LiviStars 5 niveaux Bronze→Diamant', '✅'],
        ['30', 'Fidélité', 'Leaderboard Top 10 + distribution niveaux', '✅'],
        ['31', 'Parrainage', 'Suivi filleuls avec statuts et bonus', '✅'],
        ['32', 'Parrainage', 'Configuration montants et validité', '✅'],
        ['33', 'SOS', 'Alertes actives avec chronomètre temps réel', '✅'],
        ['34', 'SOS', 'Géolocalisation GPS + lien OpenStreetMap', '✅'],
        ['35', 'SOS', 'Résolution en 1 clic + historique', '✅'],
        ['36', 'Heatmap', 'Carte Leaflet avec 12 zones GPS réelles de Dakar', '✅'],
        ['37', 'Heatmap', 'Prédictions LiviBrain avec % de confiance', '✅'],
        ['38', 'Analytics', 'Rapports financiers, opérationnels, conducteurs', '✅'],
        ['39', 'Analytics', 'Tableau de bord live Leaflet + flux événements', '✅'],
        ['40', 'Paramètres', 'Configuration complète : pays, zones, services, prix', '✅'],
        ['41', 'Paramètres', 'Codes promo avec expiration et plafond', '✅'],
        ['42', 'Paramètres', 'Config email, push notifications FCM', '✅'],
        ['43', 'Contenu', 'Pages CMS, chaînes app, options paiement', '✅'],
        ['44', 'Transactions', 'Demandes de retrait conducteurs', '✅'],
        ['45', 'Admins', 'Gestion sous-admins avec rôles granulaires', '✅'],
    ],
    col_widths=[0.06, 0.16, 0.64, 0.14],
))
story.append(spacer(10))

story += h2('7.2 App Mobile Utilisateur — 20+ Fonctionnalités')
story.append(make_table(
    ['#', 'Fonctionnalité', 'Description'],
    [
        ['01', 'Connexion', 'Numéro de téléphone ou email'],
        ['02', 'Carte accueil', 'Conducteurs disponibles à proximité'],
        ['03', 'Commander', '4 types de service disponibles'],
        ['04', 'Estimation prix', 'Avant confirmation avec surge indicator'],
        ['05', 'Suivi GPS live', 'Position conducteur en temps réel'],
        ['06', 'Chat conducteur', 'Messagerie intégrée sans appel'],
        ['07', 'Appel direct', 'Appel téléphonique 1-tap'],
        ['08', 'Bouton SOS', 'Alerte urgence avec GPS'],
        ['09', 'Safety Share', 'Partage trajet avec un proche'],
        ['10', 'Évaluation', '1-5 étoiles + commentaire'],
        ['11', 'Cash', 'Paiement espèces'],
        ['12', 'LiviWallet', 'Paiement portefeuille + recharge'],
        ['13', 'Mobile Money', 'Orange Money et Wave'],
        ['14', 'Code promo', 'Réduction avant paiement'],
        ['15', 'LiviStars', 'Points fidélité + réductions automatiques'],
        ['16', 'Historique', 'Toutes les courses avec reçus'],
        ['17', 'Parrainage', 'Code personnel + suivi filleuls'],
        ['18', 'LiviGreen', 'Score carbone par trajet'],
        ['19', 'LiviShare', 'Mode covoiturage'],
        ['20', 'Wolof/FR', 'Interface bilingue'],
    ],
    col_widths=[0.06, 0.28, 0.66],
))
story.append(spacer(10))

story += h2('7.3 App Mobile Conducteur — 20+ Fonctionnalités')
story.append(make_table(
    ['#', 'Fonctionnalité', 'Description'],
    [
        ['01', 'KYC Inscription', 'Upload documents + analyse IA selfie'],
        ['02', 'Toggle En ligne', 'Basculer disponibilité en 1 tap'],
        ['03', 'Réception course', 'Popup avec son d\'alerte — 30s pour accepter'],
        ['04', 'Navigation GPS', 'Itinéraire vers client puis destination'],
        ['05', 'Statuts course', 'En route / Arrivé / En course / Terminé'],
        ['06', 'Gains du jour', 'Revenus en temps réel'],
        ['07', 'Gains semaine/mois', 'Historique détaillé par période'],
        ['08', 'Note moyenne', 'Étoiles + évolution'],
        ['09', 'Taux acceptation', 'Statistique clé pour les bonus'],
        ['10', 'Objectifs bonus', 'Progression visuelle vers les paliers'],
        ['11', 'Demande retrait', 'Orange Money, Wave, virement'],
        ['12', 'Historique courses', 'Détail par course avec montants'],
        ['13', 'Documents KYC', 'Statut + dates d\'expiration + renouvellement'],
        ['14', 'Alertes expiration', 'Notification avant expiration documents'],
        ['15', 'Carte heatmap', 'Zones rentables visibles'],
        ['16', 'Alertes surge', 'Notification si zone en mode surge'],
        ['17', 'Chat client', 'Messagerie intégrée'],
        ['18', 'Note globale', 'Commentaires clients visibles'],
        ['19', 'LiviProtect badge', 'Statut certification affiché'],
        ['20', 'Rapport hebdo', 'Résumé PDF des gains'],
    ],
    col_widths=[0.06, 0.28, 0.66],
))
story.append(pb())


# ════════════════════════════════════════════════════════════════
# 8. GUIDE TECHNIQUE BUILD APK
# ════════════════════════════════════════════════════════════════
story += h1('Guide Technique — Build des APK', '8.')
story.append(spacer(4))

story += h2('8.1 Prérequis')
story.append(make_table(
    ['Outil', 'Version', 'Installation'],
    [
        ['Node.js', 'v22+', 'nodejs.org'],
        ['npm', 'v10+', 'Inclus avec Node.js'],
        ['JDK', '21 (Zulu / Oracle)', 'adoptium.net'],
        ['Android SDK', 'API Level 36', 'Android Studio ou sdkmanager'],
        ['Capacitor CLI', 'v8+', 'npm install -g @capacitor/cli'],
        ['GitHub CLI', 'v2+', 'cli.github.com (optionnel)'],
    ],
    col_widths=[0.20, 0.18, 0.62],
))
story.append(spacer(8))

story += h2('8.2 Build via GitHub Actions (Méthode Recommandée)')
story.append(b('Aller sur : https://github.com/mamadouelimanewane/livreur/actions'))
story.append(b('Sélectionner le workflow "Build Android APKs"'))
story.append(b('Cliquer "Run workflow" avec les paramètres :'))
story.append(b2('target : all (génère les 3 APK) ou user / driver / admin'))
story.append(b2('build_type : debug (immédiat) ou release (nécessite keystore configuré)'))
story.append(b('Durée du build : ~5-8 minutes'))
story.append(b('Télécharger les APK dans l\'onglet "Artifacts" (rétention 30 jours) :'))
story.append(b2('LiviGo-client-debug.apk — Application Utilisateur'))
story.append(b2('LiviGo-driver-debug.apk — Application Conducteur'))
story.append(b2('LiviGo-admin-debug.apk — Application Admin'))
story.append(spacer(8))

story += h2('8.3 Build en Ligne de Commande (Local)')
story.append(make_table(
    ['Commande', 'Description'],
    [
        ['npm run mobile:user', 'Build web + sync Capacitor pour l\'app Utilisateur'],
        ['npm run mobile:driver', 'Build web + sync Capacitor pour l\'app Conducteur'],
        ['npm run cap:sync', 'Synchronise les assets web vers Android'],
        ['npm run cap:open', 'Ouvre Android Studio pour build manuel'],
        ['node scripts/mobileify.js user', 'Configure le projet pour la cible "user"'],
    ],
    col_widths=[0.38, 0.62],
))
story.append(spacer(8))

story += h2('8.4 Build via GitHub CLI')
story += note('Nécessite d\'avoir poussé la branche sur GitHub et d\'avoir gh CLI installé')
story.append(make_table(
    ['Commande gh', 'Effet'],
    [
        ['gh workflow run android-build.yml -f target=all -f build_type=debug', 'Déclenche le build des 3 APK en debug'],
        ['gh workflow run android-build.yml -f target=user -f build_type=release', 'Build APK Utilisateur en release (signé)'],
        ['gh run list --workflow=android-build.yml', 'Liste les builds récents'],
        ['gh run download <run-id>', 'Télécharge les artefacts d\'un build'],
    ],
    col_widths=[0.58, 0.42],
))
story.append(spacer(8))

story += h2('8.5 Secrets GitHub pour Build Release')
story.append(make_table(
    ['Secret', 'Description'],
    [
        ['ANDROID_KEYSTORE_BASE64', 'Keystore encodé en Base64 (openssl base64 -in livigo.jks)'],
        ['ANDROID_KEYSTORE_PASSWORD', 'Mot de passe du keystore'],
        ['ANDROID_KEY_ALIAS', 'Alias de la clé dans le keystore'],
        ['ANDROID_KEY_PASSWORD', 'Mot de passe de la clé'],
    ],
    col_widths=[0.35, 0.65],
))
story.append(pb())


# ════════════════════════════════════════════════════════════════
# 9. SUPPORT & CONTACT
# ════════════════════════════════════════════════════════════════
story += h1('Support & Contact', '9.')
story.append(spacer(4))

story += h2('9.1 Informations de Contact')
story.append(make_table(
    ['Canal', 'Coordonnée'],
    [
        ['Email support', 'support@livigo.sn'],
        ['Email développeur', 'mamadouelimane.wane@livigo.sn'],
        ['Site web', 'https://livigo.sn'],
        ['Repository GitHub', 'https://github.com/mamadouelimanewane/livreur'],
        ['Déploiement Vercel', 'https://livreur-*.vercel.app'],
        ['Documentation', 'Voir Manuel_LiviGo_Complet.docx (Word) et Reference_LiviGo.pdf'],
    ],
    col_widths=[0.28, 0.72],
))
story.append(spacer(8))

story += h2('9.2 Compatibilité')
story.append(make_table(
    ['Plateforme', 'Version Minimale', 'Version Recommandée', 'Notes'],
    [
        ['Chrome', '100+', '120+', 'Navigateur recommandé pour le backoffice'],
        ['Firefox', '100+', '120+', 'Compatible complet'],
        ['Edge', '100+', '120+', 'Compatible complet'],
        ['Safari', '16+', '17+', 'Support Leaflet partiel sur iOS'],
        ['Android', '8.0 (API 26)', '12+ (API 32)', 'APK signé recommandé pour Play Store'],
        ['Résolution mobile', '360×800px', '1080×2400px', 'Design responsive'],
        ['Connexion', '3G', '4G / WiFi', 'Temps réel nécessite 4G ou WiFi'],
    ],
    col_widths=[0.20, 0.20, 0.22, 0.38],
))
story.append(spacer(8))

story += h2('9.3 Identifiants de Démonstration')
story.append(make_table(
    ['Rôle', 'Email', 'Mot de passe', 'Application'],
    [
        ['Super Administrateur', 'admin@livigo.com', 'admin123', 'Backoffice web'],
        ['Conducteur (démo)', 'driver@livigo.com', 'driver123', 'App conducteur Android'],
        ['Client (démo)', 'user@livigo.com', 'user123', 'App utilisateur Android'],
    ],
    col_widths=[0.25, 0.28, 0.18, 0.29],
    header_color=INDIGO,
))
story.append(spacer(10))

story.append(hr(PRIMARY, 1.5))
story.append(Paragraph(
    '<b>© 2026 LiviGo — Mamadou Elimane Wane — Tous droits réservés</b><br/>'
    '<font color="#64748b" size="8">Document généré automatiquement le '
    + datetime.date.today().strftime('%d %B %Y') +
    ' — Version 2.0</font>',
    sty('Footer', fontName='Helvetica', fontSize=9, textColor=GRAY, alignment=TA_CENTER, leading=14)
))

# ─── GÉNÉRATION ─────────────────────────────────────────────────────────────
print('Generation du PDF de reference LiviGo...')

doc = SimpleDocTemplate(
    OUTPUT_FILE,
    pagesize=A4,
    leftMargin=MARGIN_L,
    rightMargin=MARGIN_R,
    topMargin=MARGIN_T + 10*mm,
    bottomMargin=MARGIN_B + 10*mm,
    title='LiviGo — Référence Complète des Fonctionnalités',
    author='Mamadou Elimane Wane',
    subject='Documentation plateforme LiviGo v2.0',
    keywords='LiviGo, mobilité, Dakar, admin, conducteur, client, API, APK',
    creator='LiviGo PDF Generator v2.0',
)

doc.build(
    story,
    onFirstPage=draw_cover,
    onLaterPages=doc_canvas.on_page,
)

size_kb = os.path.getsize(OUTPUT_FILE) / 1024
print(f'OK PDF genere : {os.path.abspath(OUTPUT_FILE)}')
print(f'   Taille : {size_kb:.1f} KB')
print(f'   Sections : 9 chapitres, 45+ fonctionnalites admin documentees')
