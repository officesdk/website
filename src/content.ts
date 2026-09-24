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
  { key: 'review', label: 'Review', description: 'Keep the document beside the business context your workflow already owns.' },
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
    eyebrow: 'FILE WORKFLOW',
    title: 'Connect the file to the next step',
    body: 'Use callbacks to supply file information and permissions, then receive the edited file back in your system.',
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
    title: 'Your system keeps control of files and permissions',
    body: 'Office SDK does not provide file storage. Your system supplies file information and permissions through callbacks, and receives edited files back. Token-based access stays yours to define.',
    label: 'Keep the data boundary clear',
  },
] as const

export const solutionCards = [
  { title: 'Content platforms', body: 'Preview and edit files where teams store and share them.', tag: 'DOCUMENT MANAGEMENT' },
  { title: 'Review and approval', body: 'Connect a document to the people, notes, and decisions around it.', tag: 'WORKFLOW SOFTWARE' },
  { title: 'Education and research', body: 'Make reports, course packs, and spreadsheets useful in one place.', tag: 'LEARNING PRODUCTS' },
  { title: 'Operations and finance', body: 'Keep statements, plans, and business documents close to the system of record.', tag: 'BUSINESS SYSTEMS' },
] as const

export const fileFamilies = [
  { name: 'Word documents', formats: 'Preview: DOC, DOCX, DOT, DOCM, DOTX, DOTM, WPS, WPT · Edit: DOC, DOCX, WPS', accent: '#356ea8' },
  { name: 'Excel workbooks', formats: 'Preview: XLS, XLSX, CSV, XLSM, XLT, XLTM, ET, ETT · Edit: XLS, XLSX', accent: '#25845b' },
  { name: 'PowerPoint decks', formats: 'Preview: PPT, PPTX, POT, POTX, POTM, DPS, DPT · Edit: PPT, PPTX', accent: '#c35e35' },
  { name: 'Broader preview coverage', formats: 'PDF, images, video, audio, text, Markdown, and code', accent: '#7655a5' },
] as const

export const faqs = [
  {
    question: 'What is Office SDK?',
    answer: 'Office SDK is an online document preview and editing service for teams that want to put Word, Excel, and PowerPoint workflows inside their own web product.',
  },
  {
    question: 'Which Office files should we evaluate first?',
    answer: 'Start with the files your users already bring into the workflow. The current reference lists Word, Excel, and PowerPoint formats for editing, with broader preview coverage including PDF and other common file types. Confirm exact format behavior before launch.',
  },
  {
    question: 'Can Office SDK sit inside an existing product?',
    answer: 'That is the intended evaluation path. Your system keeps file storage and permission decisions, while Office SDK provides the document surface, callback communication, and JavaScript SDK integration points.',
  },
  {
    question: 'Do we need the full developer documentation to get started?',
    answer: 'No. Start with the workflow and format fit. Detailed API documentation can follow once the product direction, target files, and deployment requirements are clear.',
  },
  {
    question: 'Does Office SDK support PDF files?',
    answer: 'PDF is listed as a preview format. The current reference lists Word, Excel, and PowerPoint as the editable Office file families; confirm the exact behavior for your workflow in the maintained reference.',
  },
  {
    question: 'Who stores the files?',
    answer: 'Your system does. Office SDK does not provide file storage. It communicates with your file system through callbacks and returns edited files to your system, while token-based permissions remain under your control.',
  },
] as const
