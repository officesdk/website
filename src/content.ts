import type { ComponentType } from 'react'
import { FileSpreadsheet, FileText, Presentation } from 'lucide-react'

export type FormatKey = 'docx' | 'xlsx' | 'pptx'

export type FormatOption = {
  key: FormatKey
  label: string
  description: string
  title: string
  accent: string
  icon: ComponentType<{ size?: number; strokeWidth?: number }>
}

export const formatOptions: FormatOption[] = [
  {
    key: 'docx',
    label: 'Word',
    description: 'Rich text documents',
    title: 'Q3 customer rollout brief.docx',
    accent: '#71a5ff',
    icon: FileText,
  },
  {
    key: 'xlsx',
    label: 'Excel',
    description: 'Data and calculations',
    title: 'Revenue planning model.xlsx',
    accent: '#4bd4a2',
    icon: FileSpreadsheet,
  },
  {
    key: 'pptx',
    label: 'PowerPoint',
    description: 'Slides and presentations',
    title: 'Product launch narrative.pptx',
    accent: '#ff9d68',
    icon: Presentation,
  },
]

export const codeSamples = {
  javascript: `const editor = await OfficeSDK.createEditor({
  element: '#document-editor',
  file: documentUrl,
  mode: 'edit',
});

editor.on('ready', () => {
  console.log('document is ready');
});`,
  react: `import { OfficeEditor } from '@officesdk/react';

export function ContractEditor({ url }) {
  return (
    <OfficeEditor
      file={url}
      mode="edit"
      onReady={() => setReady(true)}
    />
  );
}`,
  vue: `<template>
  <OfficeEditor
    :file="documentUrl"
    mode="edit"
    @ready="handleReady"
  />
</template>

<script setup>
const handleReady = () => console.log('ready')
</script>`,
} as const

export const features = [
  {
    number: '01',
    title: 'A document surface your product can own',
    body: 'Bring viewing, editing, annotation, and conversion into the workflow you already have. Your navigation, permissions, and brand stay in charge.',
    label: 'Product control',
  },
  {
    number: '02',
    title: 'One integration for everyday business files',
    body: 'Give teams one consistent entry point for Word, Excel, PowerPoint, and other business files, with a format-aware experience that feels native to your product.',
    label: 'Format coverage',
  },
  {
    number: '03',
    title: 'Room for your security model',
    body: 'Shape deployment, access, watermarking, and UI decisions around your application and its data-handling requirements.',
    label: 'Deployment choice',
  },
]

export const useCases = [
  { title: 'Document management', body: 'Turn file repositories into a productive workspace with preview, editing, and review in one flow.', tag: 'CONTENT PLATFORMS' },
  { title: 'Legal & compliance', body: 'Keep agreements, evidence, and approval notes close to the controls that govern them.', tag: 'REVIEW WORKFLOWS' },
  { title: 'Education & research', body: 'Make course packs, reports, and spreadsheets useful without sending people to another app.', tag: 'LEARNING PRODUCTS' },
  { title: 'Finance operations', body: 'Move from uploaded statements to reviewable, annotated business documents inside your system.', tag: 'OPERATIONS SOFTWARE' },
]

export const faqs = [
  {
    question: 'What file formats can I work with?',
    answer: 'Office SDK is designed around common business documents, including Word, Excel, and PowerPoint. Use the current format matrix in the developer documentation to confirm an exact production combination.',
  },
  {
    question: 'Can I keep my existing product UI?',
    answer: 'Yes. The integration model is intended to place the document surface inside your existing product, while UI customization lets you align the editor with your navigation, brand, and permission model.',
  },
  {
    question: 'Is there a private deployment option?',
    answer: 'Deployment and support depend on the licensed package. Share your infrastructure and data-handling requirements with the Office SDK team so the production topology can be confirmed before implementation.',
  },
  {
    question: 'Where should I start as a developer?',
    answer: 'Start with the JavaScript integration guide, use the interactive demo below to understand the surface, and then validate your target file formats and deployment model with the current documentation.',
  },
]
