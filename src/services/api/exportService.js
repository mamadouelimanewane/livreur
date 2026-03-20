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

function dateStamp() {
  return new Date().toISOString().slice(0, 10)
}

function filename_safe(s) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '_')
}
