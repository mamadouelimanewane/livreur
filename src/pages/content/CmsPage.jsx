import { useState } from 'react'
import { FiEdit, FiPlus, FiSave } from 'react-icons/fi'
import { PageHeader, Btn, Badge } from '../../components/PageLayout'

const cmsPages = [
  { id: 'CMS-001', title: 'Conditions d\'utilisation', lang: 'FR', lastEdit: '10/01/2024', content: 'Ces conditions regissent l\'utilisation de la plateforme LiviGo...' },
  { id: 'CMS-002', title: 'Politique de confidentialité', lang: 'FR', lastEdit: '10/01/2024', content: 'Nous respectons votre vie privée...' },
  { id: 'CMS-003', title: 'A propos de LiviGo', lang: 'FR', lastEdit: '05/02/2024', content: 'LiviGo est une plateforme de transport et livraison au Senegal...' },
]

export default function CmsPage() {
  const [selected, setSelected] = useState(cmsPages[0])
  const [editing, setEditing] = useState(false)
  const [content, setContent] = useState(selected.content)

  return (
    <div>
      <PageHeader title="Pages CMS" icon={<FiEdit />}>
        <Btn color="#2ed8a3"><FiPlus size={14} /> Nouvelle page</Btn>
        {editing && <Btn color="#4680ff" onClick={() => setEditing(false)}><FiSave size={14} /> Enregistrer</Btn>}
      </PageHeader>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: 16 }}>
        {/* Sidebar */}
        <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <div style={{ padding: '12px 14px', background: '#f6f7fb', fontSize: 12, fontWeight: 700, color: '#718096', borderBottom: '1px solid #edf2f7' }}>
            PAGES
          </div>
          {cmsPages.map(p => (
            <div key={p.id}
              onClick={() => { setSelected(p); setContent(p.content); setEditing(false) }}
              style={{
                padding: '12px 14px',
                cursor: 'pointer',
                borderBottom: '1px solid #f7f9fb',
                background: selected.id === p.id ? '#ebf4ff' : 'transparent',
                borderLeft: selected.id === p.id ? '3px solid #4680ff' : '3px solid transparent',
              }}
            >
              <div style={{ fontSize: 13, fontWeight: selected.id === p.id ? 700 : 400, color: selected.id === p.id ? '#4680ff' : '#2d3748' }}>{p.title}</div>
              <div style={{ fontSize: 11, color: '#a0aec0', marginTop: 2 }}>Modifié: {p.lastEdit}</div>
            </div>
          ))}
        </div>

        {/* Editor */}
        <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#2d3748', margin: 0 }}>{selected.title}</h2>
              <div style={{ fontSize: 11, color: '#a0aec0', marginTop: 2 }}>Dernière modification: {selected.lastEdit}</div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Badge color="#2ed8a3" bg="#e6faf4">Publié</Badge>
              <Btn color="#4680ff" onClick={() => setEditing(!editing)}>
                <FiEdit size={12} /> {editing ? 'Aperçu' : 'Modifier'}
              </Btn>
            </div>
          </div>

          {editing ? (
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              style={{
                width: '100%',
                height: 400,
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: 5,
                fontSize: 13,
                color: '#4a5568',
                resize: 'vertical',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
          ) : (
            <div style={{
              padding: 16,
              background: '#f6f7fb',
              borderRadius: 8,
              fontSize: 13,
              color: '#4a5568',
              lineHeight: 1.6,
              minHeight: 200,
            }}>
              {content}
            </div>
          )}

          {editing && (
            <div style={{ marginTop: 12, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <Btn outline color="#6c757d" onClick={() => setEditing(false)}>Annuler</Btn>
              <Btn color="#2ed8a3"><FiSave size={12} /> Enregistrer</Btn>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
