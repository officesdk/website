import type { ComponentType } from 'react'
import { FileSpreadsheet, FileText, Presentation } from 'lucide-react'

export type FormatKey = 'docx' | 'xlsx' | 'pptx'
export type DemoMode = 'preview' | 'edit' | 'review'

export type FormatOption = {
  key: FormatKey
  label: string
  extension: string
  description: string
  title: string
  accent: string
  icon: ComponentType<{ size?: number; strokeWidth?: number }>
}

export const formatOptions: FormatOption[] = [
  {
    key: 'docx',
    label: 'Word',
    extension: 'DOCX',
    description: 'Text-heavy documents, contracts, and reports',
    title: 'Sample Word document.docx',
    accent: '#356ea8',
    icon: FileText,
  },
  {
    key: 'xlsx',
    label: 'Excel',
    extension: 'XLSX',
    description: 'Tables, calculations, and operational data',
    title: 'Sample workbook.xlsx',
    accent: '#25845b',
    icon: FileSpreadsheet,
  },
  {
    key: 'pptx',
    label: 'PowerPoint',
    extension: 'PPTX',
    description: 'Slides, decks, and presentation handoffs',
    title: 'Sample presentation.pptx',
    accent: '#c35e35',
    icon: Presentation,
  },
]

export const modeOptions: Array<{ key: DemoMode; label: string; description: string }> = [
  { key: 'preview', label: 'Preview', description: 'Let people inspect a file before they decide what happens next.' },
  { key: 'edit', label: 'Edit', description: 'Keep editing inside the product that owns the workflow.' },
  { key: 'review', label: 'Review', description: 'Keep the document beside the business context your workflow already owns.' },
]

export const workflowThemes = [
  {
    eyebrow: 'ONLINE OFFICE VIEWER',
    title: 'View Office files online',
    body: 'Give users a practical way to open Word, Excel, and PowerPoint files without leaving your product.',
    query: 'office document viewer',
    accent: 'blue',
  },
  {
    eyebrow: 'DOCUMENT EDITOR',
    title: 'Edit Word, Excel, and PowerPoint files',
    body: 'Put an editable Office surface next to the records, permissions, and workflows your app already owns.',
    query: 'online office editor',
    accent: 'green',
  },
  {
    eyebrow: 'FILE WORKFLOW',
    title: 'Connect the file to the next step',
    body: 'Use callbacks to supply file information and permissions, then follow the documented result path back into your system.',
    query: 'office document callback api',
    accent: 'orange',
  },
  {
    eyebrow: 'REVIEW WORKFLOW',
    title: 'Review documents with context',
    body: 'Keep approvals and business records close to the document they explain.',
    query: 'document review and approval',
    accent: 'violet',
  },
] as const
export const capabilityRows = [
  {
    number: '01',
    title: 'Embed a full Office document surface',
    body: 'Bring Word, Excel, and PowerPoint preview and collaborative editing into your web product. Users stay in the workflow that owns the file.',
    label: 'Preview + collaborate',
  },
  {
    number: '02',
    title: 'Move files in and out cleanly',
    body: 'Use import and export flows to connect existing Office files with the document workflow your product provides.',
    label: 'Import + export',
  },
  {
    number: '03',
    title: 'Work with document content',
    body: 'Read and write document and spreadsheet content, and keep comments and version history close to the business record.',
    label: 'Content operations',
  },
  {
    number: '04',
    title: 'Keep ownership boundaries explicit',
    body: 'Your system owns users, files, permissions, and business data. As an integration boundary, business-level records remain in your system while Office SDK provides the editor, rendering, format processing, collaboration, and JavaScript SDK surface.',
    label: 'Clear responsibility',
  },
  {
    number: '05',
    title: 'Connect through your backend',
    body: 'Callbacks let your backend supply user, file, permission, and organization information to the embedded document workflow.',
    label: 'Callback integration',
  },
] as const

export const deploymentSignals = [
  {
    label: 'Web delivery',
    value: 'Desktop and mobile browsers',
    body: 'A web-based integration keeps the document workflow available across the environments your users already use.',
  },
  {
    label: 'Evaluation path',
    value: 'Single-server proof of concept',
    body: 'Start with a focused validation environment, then move to a multi-node deployment when scale and availability require it.',
  },
  {
    label: 'Production baseline',
    value: 'Ubuntu 22.04 or 24.04 on x86',
    body: 'The current deployment guidance gives platform teams a concrete baseline for planning an installation.',
  },
] as const

export const solutionCards = [
  { title: 'Content platforms', body: 'Preview and edit files where teams store and share them.', tag: 'DOCUMENT MANAGEMENT' },
  { title: 'Review and approval', body: 'Connect a document to the people, notes, and decisions around it.', tag: 'WORKFLOW SOFTWARE' },
  { title: 'Education and research', body: 'Make reports, course packs, and spreadsheets useful in one place.', tag: 'LEARNING PRODUCTS' },
  { title: 'Operations and finance', body: 'Keep statements, plans, and business documents close to the system of record.', tag: 'BUSINESS SYSTEMS' },
] as const

export const fileFamilies = [
  { name: 'Word documents', formats: 'Preview: DOC, DOCX, DOT, DOCM, DOTX, DOTM, WPS, WPT · Import, edit, and export: verify the operation-specific path', accent: '#356ea8' },
  { name: 'Excel workbooks', formats: 'Preview: XLS, XLSX, CSV, XLSM, XLT, XLTX, XLTM, ET, ETT · Import, edit, and export: verify the operation-specific path', accent: '#25845b' },
  { name: 'PowerPoint decks', formats: 'Preview: PPT, PPTX, POT, POTX, POTM, DPS, DPT, PPTM · Import, edit, and export: verify the operation-specific path', accent: '#c35e35' },
  { name: 'Broader preview coverage', formats: 'Preview: PDF, OFD, images, video, audio, text, and Markdown', accent: '#7655a5' },
] as const

export const faqs = [
  {
    question: 'What is Office SDK?',
    answer: 'Office SDK is an online document preview and editing service for teams that want to put Word, Excel, and PowerPoint workflows inside their own web product.',
  },
  {
    question: 'Which Office files should we evaluate first?',
    answer: 'Start with the files your users already bring into the workflow. Evaluate preview, import, editing, and export paths separately for Word, Excel, and PowerPoint, with broader preview coverage including PDF and other common file types. Confirm the exact operation before launch.',
  },
  {
    question: 'Can Office SDK sit inside an existing product?',
    answer: 'That is the intended evaluation path. Your system keeps file storage and permission decisions, while Office SDK provides the document surface, callback communication, and JavaScript SDK integration points.',
  },
  {
    question: 'How should we start evaluating Office SDK?',
    answer: 'Start with one workflow and the file formats your users need. Identify the user action, target files, and deployment requirements, then validate the fit in a focused proof of concept.',
  },
  {
    question: 'Does Office SDK support PDF files?',
    answer: 'PDF is supported for preview. Word, Excel, and PowerPoint are the editable Office file families; validate the exact behavior with the files and actions your workflow requires.',
  },
  {
    question: 'Who stores the files?',
    answer: 'Your system does. Office SDK does not provide file storage. It communicates with your file system through documented callbacks and integration paths; apply your own storage, versioning, and permission rules to the resulting file or content.',
  },
] as const
