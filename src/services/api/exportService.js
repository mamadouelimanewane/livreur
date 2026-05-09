/**
 * Service d'export de données (CSV, JSON)
 * Compatible avec tous les tableaux de l'application LiviGo Admin
 */

/** Télécharge un fichier Blob dans le navigateur */
function download(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Exporte un tableau de données vers un fichier CSV.
 * @param {Object[]} data      — tableau d'objets
 * @param {string}   filename  — nom du fichier sans extension
 * @param {string[]} [columns] — clés à inclure (toutes si omis)
 * @param {Object}   [labels]  — { clé: 'Label colonne' }
 */
export function exportCSV(data, filename = 'export', columns, labels = {}) {
  if (!data?.length) return

  const keys = columns || Object.keys(data[0])
  const header = keys.map(k => labels[k] || k).join(',')
  const rows = data.map(row =>
    keys.map(k => {
      const v = row[k] ?? ''
      const s = String(v).replace(/"/g, '""')
      return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s}"` : s
    }).join(',')
  )

  const csv = '\uFEFF' + [header, ...rows].join('\n') // BOM pour Excel UTF-8
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  download(blob, `${filename}_${dateStamp()}.csv`)
}

/**
 * Exporte un tableau de données vers un fichier JSON.
 */
export function exportJSON(data, filename = 'export') {
  if (!data?.length) return
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  download(blob, `${filename}_${dateStamp()}.json`)
}

/** Exporte un rapport texte formaté (récap admin) */
export function exportTextReport(title, sections) {
  const lines = [
    `RAPPORT LIVIGO ADMIN — ${title.toUpperCase()}`,
    `Généré le : ${new Date().toLocaleString('fr-FR')}`,
    '─'.repeat(60),
    '',
    ...sections.flatMap(s => [
      `## ${s.title}`,
      ...s.rows.map(r => `  ${r.label.padEnd(32)} ${r.value}`),
      '',
    ]),
  ]
  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8;' })
  download(blob, `rapport_${filename_safe(title)}_${dateStamp()}.txt`)
}

/**
 * Génère et imprime un reçu de course au format HTML (via iframe caché).
 * Aucune dépendance externe requise — utilise window.print().
 */
export function printRideReceipt(ride) {
  const {
    id = '—', created_at, pickup_address = '—', destination_address = '—',
    driver_name = '—', client_name = '—', price = 0, distance_meters = 0,
    duration_seconds = 0, payment_method = 'Cash', status = '—',
    type = 'Moto Taxi',
  } = ride

  const date = created_at ? new Date(created_at).toLocaleString('fr-FR') : new Date().toLocaleString('fr-FR')
  const km = (distance_meters / 1000).toFixed(1)
  const mins = Math.round((duration_seconds || 0) / 60)
  const priceFormatted = Number(price).toLocaleString('fr-FR')

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8" />
<title>Reçu — ${id}</title>
<style>
  body { font-family: Arial, sans-serif; margin: 0; padding: 24px; color: #1e293b; }
  .header { text-align: center; border-bottom: 2px solid #4680ff; padding-bottom: 16px; margin-bottom: 20px; }
  .logo { font-size: 26px; font-weight: 900; color: #4680ff; letter-spacing: -1px; }
  .subtitle { font-size: 12px; color: #64748b; margin-top: 4px; }
  .receipt-id { font-size: 13px; font-weight: 700; color: #1e293b; margin-top: 8px; }
  .section { margin-bottom: 16px; }
  .section-title { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 8px; }
  .row { display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
  .row .label { color: #64748b; }
  .row .value { font-weight: 600; color: #1e293b; }
  .total-row { display: flex; justify-content: space-between; padding: 12px 0; font-size: 18px; font-weight: 900; border-top: 2px solid #4680ff; margin-top: 8px; }
  .total-row .value { color: #4680ff; }
  .footer { text-align: center; margin-top: 24px; font-size: 11px; color: #94a3b8; }
  .status-badge { display: inline-block; padding: 3px 10px; border-radius: 10px; font-size: 11px; font-weight: 700; background: #f0fdf4; color: #166534; }
  @media print { body { padding: 0; } }
</style>
</head>
<body>
  <div class="header">
    <div class="logo">🚀 LiviGo</div>
    <div class="subtitle">Plateforme de mobilité urbaine — Dakar, Sénégal</div>
    <div class="receipt-id">Reçu de course · ${id}</div>
  </div>

  <div class="section">
    <div class="section-title">Informations de la course</div>
    <div class="row"><span class="label">Date</span><span class="value">${date}</span></div>
    <div class="row"><span class="label">Service</span><span class="value">${type}</span></div>
    <div class="row"><span class="label">Statut</span><span class="value"><span class="status-badge">${status}</span></span></div>
    <div class="row"><span class="label">Départ</span><span class="value">${pickup_address}</span></div>
    <div class="row"><span class="label">Arrivée</span><span class="value">${destination_address}</span></div>
    <div class="row"><span class="label">Distance</span><span class="value">${km} km</span></div>
    ${mins > 0 ? `<div class="row"><span class="label">Durée</span><span class="value">~${mins} min</span></div>` : ''}
  </div>

  <div class="section">
    <div class="section-title">Intervenants</div>
    <div class="row"><span class="label">Client</span><span class="value">${client_name}</span></div>
    <div class="row"><span class="label">Conducteur</span><span class="value">${driver_name}</span></div>
    <div class="row"><span class="label">Mode de paiement</span><span class="value">${payment_method}</span></div>
  </div>

  <div class="total-row">
    <span>TOTAL</span>
    <span class="value">${priceFormatted} FCFA</span>
  </div>

  <div class="footer">
    Merci d'avoir utilisé LiviGo · livigo.sn<br/>
    En cas de problème : support@livigo.sn · +221 33 000 00 00
  </div>
</body>
</html>`

  const iframe = document.createElement('iframe')
  iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;border:none;'
  document.body.appendChild(iframe)
  iframe.contentDocument.write(html)
  iframe.contentDocument.close()
  iframe.contentWindow.focus()
  setTimeout(() => {
    iframe.contentWindow.print()
    setTimeout(() => document.body.removeChild(iframe), 1000)
  }, 300)
}

function dateStamp() {
  return new Date().toISOString().slice(0, 10)
}

function filename_safe(s) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '_')
}
