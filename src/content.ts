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
    title: 'Q3 customer rollout brief.docx',
    accent: '#356ea8',
    icon: FileText,
  },
  {
    key: 'xlsx',
    label: 'Excel',
    extension: 'XLSX',
    description: 'Tables, calculations, and operational data',
    title: 'Revenue planning model.xlsx',
    accent: '#25845b',
    icon: FileSpreadsheet,
  },
  {
    key: 'pptx',
    label: 'PowerPoint',
    extension: 'PPTX',
    description: 'Slides, decks, and presentation handoffs',
    title: 'Product launch narrative.pptx',
    accent: '#c35e35',
    icon: Presentation,
  },
]

export const modeOptions: Array<{ key: DemoMode; label: string; description: string }> = [
  { key: 'preview', label: 'Preview', description: 'Let people inspect a file before they decide what happens next.' },
  { key: 'edit', label: 'Edit', description: 'Keep editing inside the product that owns the workflow.' },
  { key: 'review', label: 'Review', description: 'Keep comments, decisions, and document context together.' },
]

export const workflowThemes = [
  {
    eyebrow: 'ONLINE OFFICE VIEWER',
    title: 'View Office files online',
    body: 'Give users a fast way to open Word, Excel, and PowerPoint files without leaving your product.',
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
    eyebrow: 'FILE CONVERSION',
    title: 'Convert Office files for the next step',
    body: 'Move between editable Office files and delivery formats such as PDF when the workflow calls for it.',
    query: 'convert office files to pdf',
    accent: 'orange',
  },
  {
    eyebrow: 'REVIEW WORKFLOW',
    title: 'Review documents with context',
    body: 'Keep approvals, annotations, and business records close to the document they explain.',
    query: 'document review and approval',
    accent: 'violet',
  },
] as const
export const capabilityRows = [
  {
    number: '01',
    title: 'Office files inside the product people already use',
    body: 'Add a familiar document surface to a content platform, workflow tool, education product, or business system.',
    label: 'Embed the workflow',
  },
  {
    number: '02',
    title: 'One experience across everyday Office formats',
    body: 'Start with the file families your users already bring to work: Word documents, Excel workbooks, and PowerPoint presentations.',
    label: 'Work with Office files',
  },
  {
    number: '03',
    title: 'A path from search intent to a real product evaluation',
    body: 'Use practical Office workflows as the entry point, then confirm the current integration and deployment details against the API reference.',
    label: 'Move from interest to proof',
  },
] as const

export const solutionCards = [
  { title: 'Content platforms', body: 'Preview and edit files where teams store and share them.', tag: 'DOCUMENT MANAGEMENT' },
  { title: 'Review and approval', body: 'Connect a document to the people, notes, and decisions around it.', tag: 'WORKFLOW SOFTWARE' },
  { title: 'Education and research', body: 'Make reports, course packs, and spreadsheets useful in one place.', tag: 'LEARNING PRODUCTS' },
  { title: 'Operations and finance', body: 'Keep statements, plans, and business documents close to the system of record.', tag: 'BUSINESS SYSTEMS' },
] as const

export const fileFamilies = [
  { name: 'Word documents', formats: 'DOCX, DOC, DOTX, ODT, RTF', accent: '#356ea8' },
  { name: 'Excel workbooks', formats: 'XLSX, XLS, XLTX, CSV, ODS', accent: '#25845b' },
  { name: 'PowerPoint decks', formats: 'PPTX, PPT, POTX, ODP', accent: '#c35e35' },
  { name: 'Delivery formats', formats: 'PDF and image outputs where supported', accent: '#7655a5' },
] as const

export const faqs = [
  {
    question: 'What is Office SDK?',
    answer: 'Office SDK is an Office file workflow product for teams that want to put document viewing, editing, review, and delivery steps inside their own web product.',
  },
  {
    question: 'Which Office files should we evaluate first?',
    answer: 'Start with the files your users already bring into the workflow. The first product surface focuses on Word documents, Excel workbooks, and PowerPoint presentations, with the current API reference used to confirm exact format behavior.',
  },
  {
    question: 'Can Office SDK sit inside an existing product?',
    answer: 'That is the intended evaluation path. Bring your product context, permission model, and target file workflow to the Office SDK team, then validate the integration details in the current API reference.',
  },
  {
    question: 'Do we need the full developer documentation to get started?',
    answer: 'No. Start with the workflow and format fit. Detailed API documentation can follow once the product direction, target files, and deployment requirements are clear.',
  },
] as const
