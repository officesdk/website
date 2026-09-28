export type SiteRoute = '/' | '/product' | '/formats' | '/workflows' | '/solutions' | '/deployment' | '/contact'

export type SeoPage = {
  path: SiteRoute
  title: string
  description: string
  h1: string
  eyebrow: string
  intro: string
  sections: Array<{ title: string; body: string; label: string }>
}

export const seoPages: Record<Exclude<SiteRoute, '/'>, SeoPage> = {
  '/product': {
    path: '/product',
    title: 'Office SDK Product | Embed Office workflows in your product',
    description: 'Explore the Office SDK document surface for Office file preview, editing, collaboration, import, export, and callback-based workflows.',
    h1: 'Office SDK for embedded Office document workflows.',
    eyebrow: 'PRODUCT CAPABILITY',
    intro: 'Files are often the last step outside the product. Office SDK gives your web product an embedded Office document surface so the file can stay with the work while your system keeps ownership of users, files, permissions, and business data.',
    sections: [
      { label: 'THE PROBLEM', title: 'Keep the file beside the work around it.', body: 'When people download an Office file and switch tools, the record, access decision, and next action can become disconnected. An embedded document surface keeps that context together.' },
      { label: 'PREVIEW', title: 'Let users inspect a file in context.', body: 'Open Word, Excel, and PowerPoint files beside the record, task, or process that gives them meaning. Keep the next action close to the document.' },
      { label: 'EDIT + COLLABORATE', title: 'Keep document work where the workflow lives.', body: 'Give teams an editing and review surface without sending them to a separate file product. Confirm the exact file and editing behavior for the target workflow.' },
      { label: 'IMPORT + EXPORT', title: 'Connect existing files to a managed flow.', body: 'Move Office files into the workflow your product provides, then use the documented API and callback path to apply your own storage and versioning rules.' },
      { label: 'INTEGRATION BOUNDARY', title: 'Make responsibility clear before implementation.', body: 'Your backend supplies file, user, permission, and organization context through the documented integration surfaces. Storage, access decisions, and business records remain with your system.' },
    ],
  },
  '/formats': {
    path: '/formats',
    title: 'Office SDK Formats | Preview, import, edit, and export',
    description: 'Map Office SDK preview, import, editing, and export paths for Word, Excel, PowerPoint, PDF, and other supported files.',
    h1: 'Office file preview, import, editing, and export.',
    eyebrow: 'FORMAT COVERAGE',
    intro: 'Format support is not one promise. Separate preview, import, edit, and export requirements, then validate each operation with your target files before a production decision.',
    sections: [
      { label: 'WORD', title: 'DOC and DOCX workflows.', body: 'Preview DOC, DOCX, and related Word-family formats. Confirm the exact import, editing, and export operation before launch.' },
      { label: 'EXCEL', title: 'Workbooks, tables, and operational data.', body: 'Evaluate XLS and XLSX workflows separately from CSV and other spreadsheet-family formats. Decide whether users need a view, an edit surface, or a conversion step.' },
      { label: 'POWERPOINT', title: 'Slides and presentation handoffs.', body: 'Bring PPT and PPTX files into a product workflow when the next step depends on the deck. Confirm the editing and export behavior that your process requires.' },
      { label: 'BROADER PREVIEW', title: 'Inspect more than Office files.', body: 'PDF, OFD, images, video, audio, text, and Markdown are listed for broader preview scenarios. Treat preview coverage separately from editable Office coverage.' },
    ],
  },
  '/workflows': {
    path: '/workflows',
    title: 'Office SDK Workflows | Connect Office files to your product',
    description: 'Map product context, callbacks, document preview, editing, collaboration, and documented result paths with Office SDK.',
    h1: 'Map the file workflow before you choose the API path.',
    eyebrow: 'INTEGRATION WORKFLOW',
    intro: 'A useful Office integration has a clear owner at every step: your product provides context and access decisions, Office SDK provides the document surface, and your backend applies the documented result path to the business workflow.',
    sections: [
      { label: '01 / CONTEXT', title: 'Start with the product record.', body: 'Identify the user, organization, business record, file identifier, and permission decision that should surround the document surface.' },
      { label: '02 / SURFACE', title: 'Choose preview, edit, review, or conversion.', body: 'Select the Office SDK surface that matches the user action. Do not turn a preview requirement into an editing promise.' },
      { label: '03 / CALLBACK', title: 'Let your backend supply the boundary.', body: 'Use callback and integration parameters to provide file, user, organization, and permission context from the system that owns them.' },
      { label: '04 / RESULT', title: 'Apply the result to the system of record.', body: 'Use the documented result path, then apply your own storage, versioning, business-record, and downstream workflow rules.' },
    ],
  },
  '/solutions': {
    path: '/solutions',
    title: 'Office SDK Solutions | Office workflows for business products',
    description: 'See where Office SDK fits: document management, review and approval, knowledge bases, CRM and ERP workflows, education, and collaboration products.',
    h1: 'Find the Office workflow inside the product people already use.',
    eyebrow: 'SOLUTION FIT',
    intro: 'Office SDK is useful wherever a file is part of a larger decision. Use these solution patterns to find a high-intent workflow, then validate the exact format and the boundary your application owns.',
    sections: [
      { label: 'DOCUMENT MANAGEMENT', title: 'Preview and edit files where teams keep them.', body: 'Keep document actions close to folders, records, permissions, and sharing rules owned by the content platform. Storage and access rules remain host-owned.' },
      { label: 'REVIEW + APPROVAL', title: 'Put the file beside the decision.', body: 'Let reviewers see the source document alongside comments, approval state, and the business context that drives the next step. Approval state remains host-owned.' },
      { label: 'KNOWLEDGE + EDUCATION', title: 'Make reports and course files usable in one place.', body: 'Give learners, researchers, and knowledge workers a familiar Office surface without losing the surrounding product workflow.' },
      { label: 'CRM + ERP', title: 'Keep operational files with the system of record.', body: 'Connect proposals, statements, plans, and other Office files to the customer, project, or finance record that gives them meaning.' },
    ],
  },
  '/deployment': {
    path: '/deployment',
    title: 'Office SDK Deployment | Plan an Office document integration',
    description: 'Plan an Office SDK deployment with a focused proof of concept, web delivery, backend ownership, and the documented production baseline.',
    h1: 'Plan a deployment around the system you already operate.',
    eyebrow: 'DEPLOYMENT FIT',
    intro: 'Start with a focused proof of concept, verify the target workflow, then align the production environment with the current deployment guidance. The application that owns users, files, permissions, and business data remains the integration boundary.',
    sections: [
      { label: 'POC', title: 'Validate one workflow first.', body: 'Use a single-server evaluation environment to confirm the file path, browser experience, callback exchange, and result handling before broad rollout.' },
      { label: 'WEB DELIVERY', title: 'Meet users in the browser.', body: 'Office SDK is evaluated as a web-based document surface inside the product your users already access on desktop and mobile browsers.' },
      { label: 'PRODUCTION BASELINE', title: 'Use the documented platform baseline.', body: 'The current deployment guidance provides an Ubuntu 22.04 or 24.04 x86 baseline. Confirm resource sizing, topology, and version requirements with engineering.' },
      { label: 'OWNERSHIP', title: 'Keep storage and permissions in your system.', body: 'Deployment planning should identify the service that stores files, issues access decisions, receives callbacks, and records business-level audit history.' },
    ],
  },
  '/contact': {
    path: '/contact',
    title: 'Contact Office SDK | Discuss an Office workflow',
    description: 'Contact the Office SDK team about Office file preview, editing, collaboration, format fit, deployment, and integration questions.',
    h1: 'Bring the Office workflow you want to make easier.',
    eyebrow: 'CONTACT ENGINEERING',
    intro: 'Tell us what your product needs to do with Office files. A short workflow description is enough to start; include the file types, user action, and system boundary you are evaluating.',
    sections: [
      { label: 'START WITH THE TASK', title: 'What should the user do with the file?', body: 'Preview, edit, review, import, export, or connect the file to a business record. The task determines the right next question.' },
      { label: 'BRING THE FILE FAMILY', title: 'Which formats matter first?', body: 'Share the Office or broader preview formats that your users already bring into the workflow.' },
      { label: 'DESCRIBE THE BOUNDARY', title: 'Which system owns storage and permissions?', body: 'The most useful first conversation makes clear where files live, how access is decided, and where the result should go.' },
      { label: 'DIRECT EMAIL', title: 'Prefer email?', body: 'Write to support@officesdk.com and include the file types, user action, deployment context, and where the result belongs. The form and email are two contact options for the same workflow context.' },
    ],
  },
}

export const siteRoutes: SiteRoute[] = ['/', '/product', '/formats', '/workflows', '/solutions', '/deployment', '/contact']
