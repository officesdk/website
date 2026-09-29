export type SiteRoute = '/' | '/product' | '/formats' | '/solutions' | '/deployment' | '/contact'

export type SeoEvidence = {
  definition: string
  facts: Array<{ value: string; label: string; detail: string }>
  notes?: Array<{ title: string; body: string }>
  comparison?: {
    title: string
    headers: string[]
    rows: string[][]
  }
  steps: string[]
  references: Array<{ label: string; url: string }>
}

export type SeoPage = {
  path: SiteRoute
  title: string
  description: string
  h1: string
  eyebrow: string
  intro: string
  reviewedAt: string
  sections: Array<{ title: string; body: string; label: string }>
  evidence?: SeoEvidence
}

export const seoPages: Record<Exclude<SiteRoute, '/'>, SeoPage> = {
  '/product': {
    path: '/product',
    title: 'Office SDK Product | Embedded Office document workflows',
    description: 'Explore the Office SDK document surface for Office file preview, editing, collaboration, import, export, and callback-based workflows.',
    h1: 'Office SDK for embedded Office document workflows.',
    eyebrow: 'PRODUCT CAPABILITY',
    intro: 'Files are often the last step outside the product. Office SDK gives your web product an embedded Office document surface so the file can stay with the work while your system keeps ownership of users, files, permissions, and business data.',
    reviewedAt: '2026-09-29',
    sections: [
      { label: 'THE PROBLEM', title: 'Keep the file beside the work around it.', body: 'When people download an Office file and switch tools, the record, access decision, and next action can become disconnected. An embedded document surface keeps that context together.' },
      { label: 'PREVIEW', title: 'Let users inspect a file in context.', body: 'Open Word, Excel, and PowerPoint files beside the record, task, or process that gives them meaning. Keep the next action close to the document.' },
      { label: 'EDIT + COLLABORATE', title: 'Keep document work where the workflow lives.', body: 'Give teams an editing and review surface without sending them to a separate file product. Confirm the exact file and editing behavior for the target workflow.' },
      { label: 'IMPORT + EXPORT', title: 'Connect existing files to a managed flow.', body: 'Move Office files into the workflow your product provides, then use the documented API and callback path to apply your own storage and versioning rules.' },
      { label: 'INTEGRATION BOUNDARY', title: 'Make responsibility clear before implementation.', body: 'Your backend supplies file, user, permission, and organization context through the documented integration surfaces. Storage, access decisions, and business records remain with your system.' },
    ],
    evidence: {
      definition: 'Office SDK is an embedded web document surface for products that need Word, Excel, or PowerPoint work to stay beside the surrounding record, permission, and business workflow.',
      facts: [
        { value: '3 families', label: 'core Office families', detail: 'Word, Excel, and PowerPoint are the first format families to validate.' },
        { value: '5 boundaries', label: 'capability boundaries', detail: 'Preview, collaboration, import/export, content operations, and callbacks have different acceptance criteria.' },
        { value: '2 owners', label: 'ownership systems', detail: 'Your product owns business data and access decisions; the embedded surface handles document work.' },
      ],
      notes: [
        { title: 'What stays in the host product', body: 'The host product remains the authority for user identity, organization membership, file storage, permission decisions, business records, and the workflow state that surrounds a document. The embedded surface should receive only the context required for the current action. Make that boundary visible in the design review so a successful editor demo does not silently become a new storage or authorization system.' },
        { title: 'What to accept before rollout', body: 'A useful acceptance record names the test file, user role, browser, operation, source version, returned result, and owner of the next step. Repeat the path after an expired access decision and a failed conversion. Keep the evidence with the release or business record that depends on it; a screenshot alone cannot prove that a later version was saved or that a denied request stayed denied.' },
      ],
      comparison: {
        title: 'Choose the surface by the user action',
        headers: ['User action', 'Best fit', 'Validate before launch'],
        rows: [
          ['Inspect a file', 'Preview', 'Format coverage, access checks, and first-open latency'],
          ['Change document content', 'Edit', 'Save path, version identity, and concurrent work'],
          ['Move a file through a process', 'Import or export', 'Conversion fidelity, ownership, and result write-back'],
        ],
      },
      steps: [
        'Name the record, user, file, and permission decision that surround the document.',
        'Select preview, edit, review, import, or export from the action the user must complete.',
        'Run the target Office files through the same browser and backend path used in production.',
        'Record the result in your system of record with an explicit version and owner.',
      ],
      references: [
        { label: 'Microsoft Learn: Office Open XML overview', url: 'https://learn.microsoft.com/en-us/office/open-xml/' },
        { label: 'W3C: File API', url: 'https://www.w3.org/TR/FileAPI/' },
        { label: 'Office SDK on GitHub', url: 'https://github.com/officesdk/' },
      ],
    },
  },
  '/formats': {
    path: '/formats',
    title: 'Office SDK Formats | Preview, import, edit, and export',
    description: 'Map Office SDK preview, import, editing, and export paths for Word, Excel, PowerPoint, PDF, and other supported files.',
    h1: 'Office file preview, import, editing, and export.',
    eyebrow: 'FORMAT COVERAGE',
    intro: 'Format support is not one promise. Separate preview, import, edit, and export requirements, then validate each operation with your target files before a production decision.',
    reviewedAt: '2026-09-29',
    sections: [
      { label: 'WORD', title: 'DOC and DOCX workflows.', body: 'Preview DOC, DOCX, and related Word-family formats. Confirm the exact import, editing, and export operation before launch.' },
      { label: 'EXCEL', title: 'Workbooks, tables, and operational data.', body: 'Evaluate XLS and XLSX workflows separately from CSV and other spreadsheet-family formats. Decide whether users need a view, an edit surface, or a conversion step.' },
      { label: 'POWERPOINT', title: 'Slides and presentation handoffs.', body: 'Bring PPT and PPTX files into a product workflow when the next step depends on the deck. Confirm the editing and export behavior that your process requires.' },
      { label: 'BROADER PREVIEW', title: 'Inspect more than Office files.', body: 'PDF, OFD, images, video, audio, text, and Markdown are listed for broader preview scenarios. Treat preview coverage separately from editable Office coverage.' },
    ],
    evidence: {
      definition: 'Office file support is an operation-specific contract: preview, import, edit, and export must each be tested against the formats and files your workflow actually receives.',
      facts: [
        { value: '8 formats', label: 'Word-family entries', detail: 'DOC, DOCX, DOT, DOCM, DOTX, DOTM, WPS, and WPT are listed for evaluation.' },
        { value: '9 formats', label: 'Excel-family entries', detail: 'XLS, XLSX, CSV, XLSM, XLT, XLTX, XLTM, ET, and ETT are listed for evaluation.' },
        { value: '8 formats', label: 'PowerPoint-family entries', detail: 'PPT, PPTX, POT, POTX, POTM, DPS, DPT, and PPTM are listed for evaluation.' },
        { value: '7 types', label: 'broader preview types', detail: 'PDF, OFD, images, video, audio, text, and Markdown are preview candidates.' },
      ],
      comparison: {
        title: 'Separate format questions by operation',
        headers: ['Operation', 'What it proves', 'Evidence to keep'],
        rows: [
          ['Preview', 'The user can inspect the received file', 'Rendered pages, access result, and browser context'],
          ['Import', 'The file can enter the managed workflow', 'Source identity, conversion result, and error path'],
          ['Edit', 'The required changes can be made', 'Saved version, collaboration behavior, and permissions'],
          ['Export', 'The result can leave the workflow safely', 'Output file, fidelity review, and destination owner'],
        ],
      },
      steps: [
        'Collect representative files, including the largest and most structurally complex examples.',
        'Test preview, import, edit, and export separately instead of treating format support as one claim.',
        'Inspect layout, formulas, comments, media, and accessibility in the application that receives the result.',
        'Publish an operation-by-format matrix with a named owner for every unresolved case.',
      ],
      references: [
        { label: 'Microsoft Learn: Office Open XML overview', url: 'https://learn.microsoft.com/en-us/office/open-xml/' },
        { label: 'Microsoft Support: Excel date systems', url: 'https://support.microsoft.com/en-us/office/date-systems-in-excel-e7fe7167-48a9-4b96-bb53-5612a800b487' },
        { label: 'Office SDK on GitHub', url: 'https://github.com/officesdk/' },
      ],
    },
  },
  '/solutions': {
    path: '/solutions',
    title: 'Office SDK Solutions | Embedded Office workflows by use case',
    description: 'See where Office SDK fits: document management, review and approval, knowledge bases, CRM and ERP workflows, education, and collaboration products.',
    h1: 'Find the Office workflow inside the product people already use.',
    eyebrow: 'SOLUTION FIT',
    intro: 'Office SDK is useful wherever a file is part of a larger decision. Use these solution patterns to find a high-intent workflow, then validate the exact format and the boundary your application owns.',
    reviewedAt: '2026-09-29',
    sections: [
      { label: 'DOCUMENT MANAGEMENT', title: 'Preview and edit files where teams keep them.', body: 'Keep document actions close to folders, records, permissions, and sharing rules owned by the content platform. Storage and access rules remain host-owned.' },
      { label: 'REVIEW + APPROVAL', title: 'Put the file beside the decision.', body: 'Let reviewers see the source document alongside comments, approval state, and the business context that drives the next step. Approval state remains host-owned.' },
      { label: 'KNOWLEDGE + EDUCATION', title: 'Make reports and course files usable in one place.', body: 'Give learners, researchers, and knowledge workers a familiar Office surface without losing the surrounding product workflow.' },
      { label: 'CRM + ERP', title: 'Keep operational files with the system of record.', body: 'Connect proposals, statements, plans, and other Office files to the customer, project, or finance record that gives them meaning.' },
    ],
    evidence: {
      definition: 'Office SDK is an embedded document surface for products where an Office file is part of a larger task and the host product must keep the record, permissions, and next decision in one workflow.',
      facts: [
        { value: '4 patterns', label: 'solution patterns', detail: 'Content platforms, review and approval, education and research, and business systems cover the main entry points.' },
        { value: '3 families', label: 'Office families', detail: 'Word, Excel, and PowerPoint files can be evaluated inside the surrounding product context.' },
        { value: '2 records', label: 'records to reconcile', detail: 'The document version and the host business record must point to the same completed action.' },
      ],
      notes: [
        { title: 'Start with the surrounding record', body: 'A solution page should lead with the work people are trying to complete, not with a generic editor promise. Identify the customer, project, case, course, or approval record that gives the file meaning. Then decide which document action belongs beside it and which events must remain in the host system for audit, reporting, and recovery. This framing keeps the first proof point measurable for both product and operations teams.' },
        { title: 'Keep fit claims narrow', body: 'A content platform, review workflow, and finance record can all use an embedded document surface while requiring different permissions, version rules, and handoffs. Treat each as a separate proof point. A successful preview does not prove that approval, export, or downstream reconciliation will work without additional tests and an owner. Keep the acceptance result tied to the exact record and file version that the business process will use.' },
      ],
      comparison: {
        title: 'Choose a use case by the surrounding record',
        headers: ['Use case', 'Document sits beside', 'First proof point'],
        rows: [
          ['Content platform', 'Folder, owner, sharing rule', 'Open and edit a representative file under ordinary permissions'],
          ['Review and approval', 'Comments, decision, submitted version', 'Trace one approval to the exact document revision'],
          ['CRM or ERP', 'Customer, project, or finance record', 'Save the result and reopen it from the business record'],
          ['Education or research', 'Course, report, or knowledge context', 'Complete the learner or researcher task without a download detour'],
        ],
      },
      steps: [
        'Choose one high-intent task and name the record that gives the file meaning.',
        'List the user, organization, file, and permission data the host already owns.',
        'Test the document action with real representative files and ordinary user roles.',
        'Measure completion, version clarity, and support effort before expanding the use case.',
      ],
      references: [
        { label: 'Microsoft Learn: Office Open XML overview', url: 'https://learn.microsoft.com/en-us/office/open-xml/' },
        { label: 'OWASP: Authorization Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html' },
        { label: 'Office SDK on GitHub', url: 'https://github.com/officesdk/' },
      ],
    },
  },
  '/deployment': {
    path: '/deployment',
    title: 'Office SDK Deployment | Plan an Office document integration',
    description: 'Plan an Office SDK deployment with a focused proof of concept, web delivery, backend ownership, and the documented production baseline.',
    h1: 'Plan a deployment around the system you already operate.',
    eyebrow: 'DEPLOYMENT FIT',
    intro: 'Start with a focused proof of concept, verify the target workflow, then align the production environment with the current deployment guidance. The application that owns users, files, permissions, and business data remains the integration boundary.',
    reviewedAt: '2026-09-29',
    sections: [
      { label: 'POC', title: 'Validate one workflow first.', body: 'Use a single-server evaluation environment to confirm the file path, browser experience, callback exchange, and result handling before broad rollout.' },
      { label: 'WEB DELIVERY', title: 'Meet users in the browser.', body: 'Office SDK is evaluated as a web-based document surface inside the product your users already access on desktop and mobile browsers.' },
      { label: 'PRODUCTION BASELINE', title: 'Use the documented platform baseline.', body: 'The current deployment guidance provides an Ubuntu 22.04 or 24.04 x86 baseline. Confirm resource sizing, topology, and version requirements with engineering.' },
      { label: 'OWNERSHIP', title: 'Keep storage and permissions in your system.', body: 'Deployment planning should identify the service that stores files, issues access decisions, receives callbacks, and records business-level audit history.' },
    ],
    evidence: {
      definition: 'An Office SDK deployment is the operating arrangement that delivers the document surface in the browser while your services retain file storage, identity, permission, and business-record responsibility.',
      facts: [
        { value: '1 workflow', label: 'focused proof of concept', detail: 'Start with one workflow and one representative file path before broad rollout.' },
        { value: '2 baselines', label: 'Ubuntu baselines', detail: 'The current guidance names Ubuntu 22.04 and 24.04 on x86 for planning.' },
        { value: '2 contexts', label: 'browser contexts', detail: 'Desktop and mobile browser access belong in the acceptance plan.' },
      ],
      comparison: {
        title: 'Separate evaluation from production planning',
        headers: ['Stage', 'Environment question', 'Evidence to keep'],
        rows: [
          ['Proof of concept', 'Can the target workflow open, edit, and return a result?', 'Test file, browser trace, callback log, and owner sign-off'],
          ['Web delivery', 'Can intended users reach the surface from supported browsers?', 'Desktop and mobile acceptance notes'],
          ['Production', 'Can the operating team recover and observe the service?', 'Sizing, deployment record, monitoring, and rollback plan'],
        ],
      },
      steps: [
        'Choose one workflow and document its file, identity, permission, and result boundaries.',
        'Validate the single-server proof of concept from the same network path users will use.',
        'Plan the production baseline, observability, recovery owner, and version policy.',
        'Repeat the acceptance workflow after deployment and retain the evidence with the release record.',
      ],
      references: [
        { label: 'Office SDK deployment guidance', url: '/deployment' },
        { label: 'Office SDK on GitHub', url: 'https://github.com/officesdk/' },
        { label: 'W3C: Trace Context', url: 'https://www.w3.org/TR/trace-context/' },
      ],
    },
  },
  '/contact': {
    path: '/contact',
    title: 'Contact Office SDK | Discuss an Office workflow',
    description: 'Contact the Office SDK team about Office file preview, editing, collaboration, format fit, deployment, and integration questions.',
    h1: 'Bring the Office workflow you want to make easier.',
    eyebrow: 'CONTACT ENGINEERING',
    intro: 'Tell us what your product needs to do with Office files. A short workflow description is enough to start; include the file types, user action, and system boundary you are evaluating.',
    reviewedAt: '2026-09-29',
    sections: [
      { label: 'START WITH THE TASK', title: 'What should the user do with the file?', body: 'Preview, edit, review, import, export, or connect the file to a business record. The task determines the right next question.' },
      { label: 'BRING THE FILE FAMILY', title: 'Which formats matter first?', body: 'Share the Office or broader preview formats that your users already bring into the workflow.' },
      { label: 'DESCRIBE THE BOUNDARY', title: 'Which system owns storage and permissions?', body: 'The most useful first conversation makes clear where files live, how access is decided, and where the result should go.' },
      { label: 'DIRECT EMAIL', title: 'Prefer email?', body: 'Write to support@officesdk.com and include the file types, user action, deployment context, and where the result belongs. The form and email are two contact options for the same workflow context.' },
    ],
  },
}

export const siteRoutes: SiteRoute[] = ['/', '/product', '/formats', '/solutions', '/deployment', '/contact']
