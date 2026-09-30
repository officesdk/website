export type SiteRoute = '/' | '/product' | '/formats' | '/solutions' | '/deployment' | '/contact' | '/pricing' | '/docs' | '/demo'

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
    h1: 'Talk to our team.',
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
  '/pricing': {
    path: '/pricing',
    title: 'Office SDK Pricing | Self-hosted licensing for your deployment',
    description: 'Understand how Office SDK is priced: a self-hosted license sized to your deployment, with evaluation support and no per-file or per-document fees.',
    h1: 'Self-hosted licensing, sized to your deployment.',
    eyebrow: 'PRICING MODEL',
    intro: 'Office SDK runs on your infrastructure, so pricing follows the deployment rather than per-file usage. Tell us the editor count, environments, and workflow scope, and you receive a quote that matches the deployment you are actually evaluating.',
    reviewedAt: '2026-09-30',
    sections: [
      { label: 'HOW PRICING WORKS', title: 'A license for the deployment, not per document.', body: 'The license covers the self-hosted Office SDK deployment in your environments. Opening, editing, and converting files inside that deployment is not metered, so usage growth does not change the invoice.' },
      { label: 'WHAT SIZES THE QUOTE', title: 'Three inputs shape the number.', body: 'Concurrent editors, the environments you run (evaluation, staging, production), and the workflow scope you need first. A focused first scope keeps the entry price honest.' },
      { label: 'WHAT IS INCLUDED', title: 'Support and upgrades travel with the license.', body: 'The quote includes integration support during evaluation, upgrade access, and help validating the exact formats and workflows you plan to run in production.' },
      { label: 'START SMALL', title: 'Prove one workflow before you scale.', body: 'The recommended path is a single-server proof of concept on one workflow. Pricing for production is easier to accept after the evaluation has evidence behind it.' },
    ],
    evidence: {
      definition: 'Office SDK pricing is a self-hosted deployment license sized by editors, environments, and workflow scope, without per-file or per-document charges.',
      facts: [
        { value: '1 license', label: 'deployment coverage', detail: 'One self-hosted license covers the Office SDK runtime in the environments you agree with the team.' },
        { value: '0', label: 'per-document fees', detail: 'Preview, editing, and conversion inside the deployment are not metered per file or per document.' },
        { value: '3 inputs', label: 'quote sizing', detail: 'Concurrent editors, environment count, and first workflow scope determine the quote.' },
      ],
      comparison: {
        title: 'What changes the quote and what does not',
        headers: ['Factor', 'Moves the quote', 'Why'],
        rows: [
          ['Concurrent editors', 'Yes', 'Sizing follows the people editing at the same time, not the document count'],
          ['Environments', 'Partly', 'Evaluation, staging, and production are scoped explicitly'],
          ['Files opened or converted', 'No', 'Document volume is not metered inside the deployment'],
          ['First workflow scope', 'Partly', 'A focused first scope keeps the evaluation and the quote small'],
        ],
      },
      steps: [
        'Describe the first workflow and the formats it must handle.',
        'Estimate concurrent editors and name the environments you run.',
        'Request the quote and a single-server evaluation license together.',
        'Revisit pricing after the proof of concept has recorded evidence.',
      ],
      references: [
        { label: 'Deployment planning', url: '/deployment' },
        { label: 'Talk to the team', url: '/contact' },
        { label: 'Office SDK on GitHub', url: 'https://github.com/officesdk/' },
      ],
    },
  },
  '/docs': {
    path: '/docs',
    title: 'Office SDK Docs | Integration and deployment documentation',
    description: 'Find Office SDK documentation: quickstart integration, frontend embed, backend callbacks, format coverage, and self-hosted deployment guidance.',
    h1: 'Start integrating with the right document.',
    eyebrow: 'DOCUMENTATION',
    intro: 'The documentation set covers the whole integration path: embed the editor surface, connect your backend through callbacks, validate formats, and deploy on your own infrastructure. Start with the quickstart, then follow the surface you are building first.',
    reviewedAt: '2026-09-30',
    sections: [
      { label: 'QUICKSTART', title: 'Open your first document.', body: 'The shortest path from an empty web app to a rendered Office document: load the SDK surface, supply a file source, and confirm the open event end to end.' },
      { label: 'FRONTEND EMBED', title: 'Place the editor inside your product.', body: 'Mount the document surface in the page, size it to your layout, and choose preview, edit, or review per view. The surface receives context; your product keeps identity and permissions.' },
      { label: 'BACKEND CALLBACKS', title: 'Connect saves to your system of record.', body: 'Callback endpoints let your backend issue access decisions and receive saved results, so storage and versioning stay in the system you already operate.' },
      { label: 'DEPLOYMENT', title: 'Run it on your infrastructure.', body: 'Self-hosted deployment guidance covers the Ubuntu baseline, single-server proof of concept, and the production readiness checks your team should record.' },
    ],
    evidence: {
      definition: 'Office SDK documentation maps the integration path from first open to production deployment: frontend embed, backend callbacks, format validation, and self-hosted operations.',
      facts: [
        { value: '4 areas', label: 'documentation set', detail: 'Quickstart, frontend embed, backend callbacks, and deployment form the core reading path.' },
        { value: '2 sides', label: 'integration boundary', detail: 'The browser surface and your backend meet through defined context and callback contracts.' },
        { value: '1 rule', label: 'validation first', detail: 'Every guide asks you to confirm the behavior with your own files before production.' },
      ],
      notes: [
        { title: 'Read by the question you are answering', body: 'Pick the document that matches the decision in front of you. If the question is whether the file opens correctly, start with the quickstart. If the question is where a saved version lands, read the callback guide. If the question is what the server needs, start with deployment. Reading in this order keeps each check tied to one decision.' },
        { title: 'Keep the boundary in the notes', body: 'While integrating, record which system issued the access decision, which system stored the result, and which version identifier the business record points to. These three facts resolve most later questions about a document without reopening the editor.' },
      ],
      comparison: {
        title: 'Find the document by the next question',
        headers: ['Your question', 'Start with', 'You leave with'],
        rows: [
          ['Does the file open in our app?', 'Quickstart', 'A rendered document and a verified open path'],
          ['Where do saves go?', 'Backend callbacks', 'A save flow that lands in your storage with version identity'],
          ['What does the server need?', 'Deployment', 'A sizing and environment plan for your infrastructure'],
          ['Which formats behave how?', 'Formats page', 'An operation-by-format validation checklist'],
        ],
      },
      steps: [
        'Open the quickstart and render one of your own files.',
        'Decide which view is preview, which is edit, and which is review.',
        'Wire the callback endpoint and save one document into your storage.',
        'Record the version and access decision with your business record.',
      ],
      references: [
        { label: 'Office SDK on GitHub', url: 'https://github.com/officesdk/' },
        { label: 'Format coverage', url: '/formats' },
        { label: 'Deployment planning', url: '/deployment' },
      ],
    },
  },
  '/demo': {
    path: '/demo',
    title: 'Office SDK Demo | See the editors before you integrate',
    description: 'Walk through the Office SDK editor surfaces: notes, Markdown, Word, Excel, and PowerPoint views inside one workflow story, then request a guided session.',
    h1: 'See the editors before you integrate.',
    eyebrow: 'PRODUCT DEMO',
    intro: 'The fastest way to evaluate Office SDK is to watch one business workflow move across the editor surfaces: a brief in notes, the same work in Word, the numbers in Excel, and the result in PowerPoint. Then bring your own files to a guided session.',
    reviewedAt: '2026-09-30',
    sections: [
      { label: 'SELF-GUIDED', title: 'Follow one workflow across four editors.', body: 'The core editors story walks a single illustrative workflow through the notes, Word, Excel, and PowerPoint surfaces, so you see the boundaries between preview, editing, and review without installing anything.' },
      { label: 'GUIDED SESSION', title: 'Bring your files and your questions.', body: 'A guided walkthrough runs your representative files through the same surfaces and pauses on the integration points your product cares about: context, callbacks, and where results land.' },
      { label: 'WHAT TO PREPARE', title: 'Three inputs make the session useful.', body: 'One workflow description, two or three representative files, and the system that owns storage and permissions. With these, the session ends at a proof-of-concept plan instead of a slide deck.' },
      { label: 'AFTER THE DEMO', title: 'Leave with a one-workflow plan.', body: 'The output of a good demo is narrow: the workflow to prove first, the formats to validate, and the environment to run the proof of concept on.' },
    ],
    evidence: {
      definition: 'An Office SDK demo is a walkthrough of one workflow across the editor surfaces, ending with a scoped proof-of-concept plan for your own files and infrastructure.',
      facts: [
        { value: '4 surfaces', label: 'one workflow story', detail: 'Notes, Word, Excel, and PowerPoint views appear in one continuous workflow narrative.' },
        { value: '3 inputs', label: 'useful session prep', detail: 'A workflow description, representative files, and the storage owner make the session concrete.' },
        { value: '1 output', label: 'scoped POC plan', detail: 'The session ends with the workflow, formats, and environment for the first proof of concept.' },
      ],
      comparison: {
        title: 'Choose how to see the product',
        headers: ['Format', 'Best for', 'Preparation'],
        rows: [
          ['Self-guided story', 'Understanding the surfaces at your own pace', 'None — open the core editors story'],
          ['Guided session', 'Your files, your integration points', 'Workflow description and representative files'],
          ['Proof of concept', 'Validating the workflow end to end', 'An evaluation environment and a named owner'],
        ],
      },
      steps: [
        'Open the core editors story and follow the workflow across the surfaces.',
        'Note the views where preview, edit, and review should differ in your product.',
        'Book a guided session with two or three of your own files.',
        'Leave with the first workflow, format list, and environment for the POC.',
      ],
      references: [
        { label: 'Open the core editors story', url: '/product/core-editors' },
        { label: 'Request a guided session', url: '/contact' },
        { label: 'Deployment planning', url: '/deployment' },
      ],
    },
  },
}

export const siteRoutes: SiteRoute[] = ['/', '/product', '/formats', '/solutions', '/deployment', '/contact', '/pricing', '/docs', '/demo']
