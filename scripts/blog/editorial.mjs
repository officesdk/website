export const heroKinds = ['masthead', 'cover-first', 'overprint', 'report', 'centered', 'folio', 'compact', 'ledger', 'visual-first', 'statement', 'field-notes', 'exhibit']
export const bodyKinds = ['rail-left', 'rail-right', 'wide', 'chapter-rail', 'inset', 'numbered', 'alternating', 'journal', 'reading-room']
export const categories = ['Integration', 'Self-hosting', 'Security', 'AI & documents', 'Office workflows', 'Comparisons', 'Operations', 'Migration']
export const articleFormats = ['explainer', 'walkthrough', 'comparison', 'decision-brief', 'troubleshooting', 'architecture', 'field-notes', 'playbook']
export const sectionKinds = ['prose', 'steps', 'comparison', 'diagnostic', 'example', 'checklist', 'note']
export const figureKinds = ['flow', 'sequence', 'comparison', 'layers', 'matrix', 'document', 'decision']
export const keywordTags = [
  'Office SDK', 'Embedded editing', 'Document preview', 'Document conversion', 'Collaboration', 'Version control',
  'Document storage', 'Webhooks', 'Access control', 'Multi-tenancy', 'Self-hosting', 'Docker', 'Kubernetes', 'Operations',
  'Troubleshooting', 'Security', 'Data privacy', 'Data residency', 'Migration', 'AI documents', 'Document search', 'RAG',
  'Word documents', 'Excel spreadsheets', 'Presentations', 'PDF', 'Document automation', 'Integrations', 'Product selection',
  'Open source', 'Accessibility', 'Performance', 'API integration', 'Business workflows', 'Audit logs', 'Backup and recovery',
]

const palettes = [
  ['#247355', '#e7f2ec'], ['#315f9b', '#eaf1f9'], ['#ae463d', '#f8eeeb'],
  ['#696030', '#f1f3df'], ['#087b83', '#e4f3f3'], ['#883b62', '#f6eaf0'],
  ['#515c68', '#edf0f3'], ['#725494', '#f0ebf7'], ['#8c592d', '#f6eee5'],
]

export function editorialRecipe(index) {
  if (!Number.isInteger(index) || index < 0 || index >= heroKinds.length * bodyKinds.length) throw new Error('Editorial recipe index exceeds the 108 unique compositions')
  const hero = heroKinds[index % heroKinds.length]
  const body = bodyKinds[Math.floor(index / heroKinds.length)]
  const [accent, soft] = palettes[index % palettes.length]
  return { hero, body, signature: `${hero}:${body}`, accent, soft, number: index + 1 }
}

export function categorize(slug, originalCategory) {
  if (categories.includes(originalCategory)) return originalCategory
  if (/migrat|adoption|exit-planning|lock-in/.test(slug)) return 'Migration'
  if (/security|secure|encrypt|sovereignty|residency|gdpr|hipaa|iso27001|soc2|sharing-risk|access-control|legal-hold|retention|sso/.test(slug)) return 'Security'
  if (/ai-|agents|model|training|deck|generation|formatting|intent/.test(slug)) return 'AI & documents'
  if (/-vs-|alternative|comparison|best-|options/.test(slug)) return 'Comparisons'
  if (/backup|restore|monitor|tuning|hardware|capacity|recovery|operations|upgrade|storage/.test(slug)) return 'Operations'
  if (/self-host|private-cloud|air-gapped|kubernetes|offline|on-device/.test(slug)) return 'Self-hosting'
  if (/engine|rust|integration/.test(slug)) return 'Integration'
  return 'Office workflows'
}
