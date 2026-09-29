export const articleActionGuides = {
  'stale-preview-invalidation': {
    title: 'Publish a preview without moving version identity backward',
    steps: [
      'Record the source version and rendering configuration when the preview job is created.',
      'Store the completed output against that exact source identity.',
      'Move the current-preview pointer only when the completed source is still current.',
      'Race two revisions and verify both existing and new browser sessions show the intended version.',
    ],
  },
  'ai-document-answer-provenance': {
    title: 'Make each generated claim traceable to supplied evidence',
    steps: [
      'Store the source document version and passage location supplied to generation.',
      'Check that every returned citation resolves to one of those authorized passages.',
      'Review whether the cited passage supports the claim, separately from link validity.',
      'Mark saved answers when a source changes, access is revoked, or evidence is no longer available.',
    ],
  },
  'document-format-routing': {
    title: 'Route a document through one reviewed decision sequence',
    steps: [
      'Inspect the actual content type and current document state.',
      'Name the requested operation: preview, edit, convert, or download.',
      'Check operation support and the user permission required for that route.',
      'Select the supported processor, a specific fallback, or an explicit rejection.',
      'Apply the same rule to menus, deep links, and background jobs.',
    ],
  },
  'signed-document-url-lifetimes': {
    title: 'Set and test the source-access window',
    steps: [
      'Identify when the link is issued and which service consumes it.',
      'Measure queue wait, connection setup, transfer, and supported retry delay separately.',
      'Choose the validity window from the storage provider behavior and the accepted operating range.',
      'Test a delayed fetch and an expired retry using a disposable document.',
      'Require fresh authorization before issuing replacement access.',
    ],
  },
  'editor-permission-lifecycle': {
    title: 'Test permission changes across an active editor session',
    steps: [
      'List edit, comment, export, download, and reopen as separate operations.',
      'Map each operation to the server endpoint that authorizes it.',
      'Remove a test user while the document, a second tab, and a prior link remain open.',
      'Attempt every operation and record immediate and delayed revocation behavior.',
      'Close any path that still relies only on hidden controls or launch-time state.',
    ],
  },
  'document-capacity-measurement': {
    title: 'Build a capacity test around representative work',
    steps: [
      'Define the document mix, user actions, concurrency, and expected peaks.',
      'Prepare representative files and separate cold-cache from warm-cache runs.',
      'Increase demand gradually while measuring user outcomes, queue age, and dependencies.',
      'Introduce a dependency interruption and observe retry demand and backlog recovery.',
      'Record the supported operating range and the first limiting component.',
    ],
  },
  'ai-document-data-minimization': {
    title: 'Limit an AI request to the authorized task context',
    steps: [
      'Define the smallest source scope that can support the requested task.',
      'Check tenant and document access before retrieving any passage.',
      'Send only the selected content and definitions needed to interpret it.',
      'Inspect the actual outbound request and application logs during acceptance.',
      'Trace cached chunks and stored answers back to the source lifecycle.',
    ],
  },
  'sso-and-editor-session-logout': {
    title: 'Verify what logout ends in every document context',
    steps: [
      'Inventory host, identity-provider, editor, and signed-storage credentials separately.',
      'Define the intended logout result for active tabs, pending work, and prior links.',
      'Log out with two documents open and attempt a new document action in each tab.',
      'Switch accounts and test history navigation and cached application state.',
      'Confirm the new account inherits no prior content or permission context.',
    ],
  },
  'document-deletion-lifecycle': {
    title: 'Track deletion through the source and every derived copy',
    steps: [
      'Inventory source versions, previews, extracted text, indexes, temporary files, and backups.',
      'Define when ordinary access ends and when permanent cleanup is expected.',
      'Start a durable per-system cleanup operation with version and retention guards.',
      'Retry and reconcile incomplete work without deleting a restored or replaced version.',
      'Verify completion and the behavior of later backup restores.',
    ],
  },
  'accessible-document-preview': {
    title: 'Run an accessibility check as a complete reader task',
    steps: [
      'Define how a reader opens, navigates, understands, and leaves the preview.',
      'Test focus, controls, loading, and errors using the keyboard.',
      'Inspect reading order, headings, tables, and image descriptions in the rendered content.',
      'Repeat with the relevant browser, assistive technology, zoom, and source formats.',
      'Verify an authorized alternate representation when the preview cannot support the task.',
    ],
  },
  'phased-document-rollout': {
    title: 'Move from one rollout cohort to the next',
    steps: [
      'Choose a cohort and document corpus that represent the intended workflow.',
      'Set opening, save, export, permission, support, and recovery gates before release.',
      'Monitor user outcomes and pause criteria during the cohort window.',
      'Rehearse rollback for changed documents and pending jobs, not only the interface flag.',
      'Expand only after the current phase meets the recorded gates.',
    ],
  },
  'callback-retries-and-idempotency': {
    title: 'Process a repeated save callback once',
    steps: [
      'Authenticate and validate the callback against the documented delivery contract.',
      'Derive a stable key for the logical save operation.',
      'Persist acceptance before sending an acknowledgement when asynchronous work is allowed.',
      'Make publication and downstream effects atomic or repeatable under that key.',
      'Test duplicate delivery, concurrent workers, a lost response, and a worker restart.',
    ],
  },
  'conversion-queue-backpressure': {
    title: 'Exercise admission and recovery under a conversion burst',
    steps: [
      'Set admission, worker concurrency, retry, and cancellation limits.',
      'Observe oldest-job age, queued bytes, and per-tenant demand as a batch arrives.',
      'Keep interactive preview work in the test while bulk jobs are queued.',
      'Introduce one permanent failure and stop a worker during processing.',
      'Verify bounded retries, fair scheduling, job recovery, and clear rejection states.',
    ],
  },
  'document-trace-id-design': {
    title: 'Follow one user operation across every service boundary',
    steps: [
      'Create a durable operation ID when the user starts the document action.',
      'Attach request, queue, worker, and callback identifiers to that operation.',
      'Map external provider IDs without recording document text or signed credentials.',
      'Expose a safe support ID in the actionable user error.',
      'Trace one synthetic failure from launch to its first failed boundary.',
    ],
  },
  'font-deployment-as-a-dependency': {
    title: 'Deploy and verify one approved font package',
    steps: [
      'Inventory required families, styles, versions, digests, licenses, and scripts.',
      'Package the approved files through the normal worker build or deployment path.',
      'Refresh the documented font cache or restart every relevant worker.',
      'Render the multilingual regression fixture on each supported worker environment.',
      'Compare output and retain the prior image and font package for rollback.',
    ],
  },
  'document-template-governance': {
    title: 'Publish a template as a controlled version',
    steps: [
      'Assign drafting, review, publishing, retirement, and restoration owners.',
      'Create a versioned draft outside the normal document-creation flow.',
      'Test populated wording, placeholders, formulas, and edge values.',
      'Publish the approved version and record it on every document created from it.',
      'Retire outdated versions with a named replacement and recoverable history.',
    ],
  },
  'document-upload-quarantine': {
    title: 'Release only the immutable bytes that passed validation',
    steps: [
      'Store the received object outside normal preview, editing, and download routes.',
      'Validate content type, size, structure, and the policy for encrypted or active content.',
      'Bind the scan decision to an immutable object version or verified digest.',
      'Publish that exact version only after every required check succeeds.',
      'Monitor pending items and remove rejected or abandoned objects under the retention rule.',
    ],
  },
  'large-workbook-acceptance': {
    title: 'Accept a workbook against a stated operating envelope',
    steps: [
      'Select representative workbook complexity and the user tasks that must succeed.',
      'Fix the browser, client device, server environment, and concurrency conditions.',
      'Measure retrieval, first display, recalculation, editing, save, reopen, and export separately.',
      'Verify formulas and dependent values after editing and after export.',
      'Record the supported envelope and the recovery path for files outside it.',
    ],
  },
  'preview-versus-readonly-editor': {
    title: 'Choose the viewing surface from the version contract',
    steps: [
      'Name the exact version or freshness promise the viewer must receive.',
      'Choose a rendered preview or a read only editor from the required viewing task.',
      'Map edit, comment, download, print, and export permissions separately.',
      'Test the view after the source changes and after access is revoked.',
      'Return a clear error or approved alternative instead of silently substituting another version.',
    ],
  },
  'pdf-fidelity-acceptance': {
    title: 'Accept converted PDF output with retained evidence',
    steps: [
      'Record the reference application, export settings, and critical content before conversion.',
      'Convert the representative Word, spreadsheet, and presentation corpus.',
      'Compare text, values, formulas, and object presence before judging appearance.',
      'Render comparable pages and inspect pagination, clipping, charts, and fonts.',
      'Classify failures and retain the source, output, and comparison evidence with the decision.',
    ],
  },
  'first-open-source-retrieval': {
    title: 'Reproduce first-open retrieval from the actual requester',
    steps: [
      'Identify the browser, document service, or worker that performs the first source fetch.',
      'Test the same authorized URL from both the user network and the requester network.',
      'Compare DNS, routing, TLS, redirect, and credential behavior at each boundary.',
      'Repeat after the credential expires and record the response visible to the host product.',
      'Keep the request trace with the file version and the owner of the failed boundary.',
    ],
  },
}

export const articleComparisonSections = {
  'stale-preview-invalidation': {
    title: 'Compare preview publication paths',
    headers: ['Path', 'Identity or cache rule', 'Safe publication behavior'],
    rows: [
      ['Immutable revision preview', 'File ID, source version, output format, and rendering options', 'Keep the result attached to that exact source version'],
      ['Mutable current preview', 'Document identity plus deliberate cache validation', 'Move the pointer only when the completed source version is still current'],
      ['Late conversion result', 'Original source version remains explicit', 'Retain it as historical output without replacing a newer preview'],
    ],
  },
  'document-format-routing': {
    title: 'Choose the route from validated capability',
    headers: ['Requested action', 'Required evidence', 'Fallback when unavailable'],
    rows: [
      ['Edit', 'Validated content type, edit support, permission, and usable document state', 'Offer preview or download with a specific reason'],
      ['Preview', 'Validated content type, render support, and read permission', 'Use an existing immutable rendition or an authorized download'],
      ['Download', 'Authorized access to the original file', 'Preserve the source without implying preview or edit support'],
      ['Reject or quarantine', 'Validation failure, unsafe input, or unavailable document state', 'Explain the blocked condition and the next supported action'],
    ],
  },
  'signed-document-url-lifetimes': {
    title: 'Balance URL lifetime against retrieval delay',
    headers: ['Issuance choice', 'Operational effect', 'Exposure tradeoff'],
    rows: [
      ['Issue when the job enters the queue', 'The validity window includes queueing and retry time', 'A longer window may be required'],
      ['Issue immediately before retrieval', 'Most of the window is available to the worker', 'The credential exists for less time'],
      ['Refresh after an authorized retry', 'A delayed worker obtains a new supported access path', 'The expired URL does not need to remain valid'],
    ],
  },
  'callback-retries-and-idempotency': {
    title: 'Compare duplicate-handling designs',
    headers: ['Design', 'Failure mode', 'Durable behavior'],
    rows: [
      ['Memory-only queue', 'A process restart can lose accepted work', 'Persist acceptance before acknowledgement'],
      ['Seen-event flag', 'A crash after the flag can leave work unfinished', 'Track pending, completed, and failed states'],
      ['Atomic operation key', 'Duplicate deliveries compete for one logical effect', 'Use a uniqueness constraint or equivalent atomic claim'],
    ],
  },
}

export const articleMeasurementNotes = {
  'first-open-source-retrieval': 'Use 2 files, 2 user roles, and 3 network locations so browser access and backend retrieval can be compared without changing the fixture.',
  'stale-preview-invalidation': 'Use 2 file revisions, 2 browser sessions, and 1 deliberately delayed conversion job to make a backward version change observable.',
  'ai-document-answer-provenance': 'Use 3 generated claims, 3 cited passages, and 2 source versions so citation validity and freshness can be reviewed separately.',
  'document-format-routing': 'Use 5 files, 4 requested operations, and 2 user roles to cover supported, mislabeled, pending, unsafe, and unsupported routes.',
  'signed-document-url-lifetimes': 'Exercise 3 retrieval windows: 30 seconds, 5 minutes, and 30 minutes, including one attempt that crosses each expiry boundary.',
  'editor-permission-lifecycle': 'Use 2 user roles, 2 open browser tabs, and 1 previously issued download link to observe what revocation actually ends.',
  'document-capacity-measurement': 'Start with 25 users, 10 preview requests per minute, and 5 conversion jobs per minute, then increase one workload dimension at a time.',
  'ai-document-data-minimization': 'Compare 3 model tasks, 2 document scopes, and 1 revoked source file to verify that retained context follows the source lifecycle.',
  'sso-and-editor-session-logout': 'Use 2 accounts, 2 browser tabs, and 1 signed download URL to test logout, account switching, and residual access.',
  'document-deletion-lifecycle': 'Create 2 source versions, track copies in 3 derived stores, and complete 1 isolated restore drill before signing off deletion behavior.',
  'accessible-document-preview': 'Run the fixture in 2 browsers, complete 2 keyboard-only passes, and repeat at 200% zoom with the selected assistive technology.',
  'phased-document-rollout': 'Use a pilot of 10 users, 20 documents, and 1 pending conversion job so rollback is tested after real document changes.',
  'callback-retries-and-idempotency': 'Deliver 10 duplicate callbacks through 2 concurrent workers and force 1 worker restart before checking the published result.',
  'conversion-queue-backpressure': 'Queue 20 batch jobs beside 5 interactive preview requests and include 2 worker restarts to expose backlog and recovery behavior.',
  'document-trace-id-design': 'Trace 1 user operation across 3 service requests and 2 retries, then start from the support ID and find the first failed boundary.',
  'font-deployment-as-a-dependency': 'Render 3 writing systems on 2 worker images and repeat 1 case with a required font removed to make fallback behavior visible.',
  'document-template-governance': 'Compare 2 template versions, populate 5 placeholder values, and create 3 documents before retiring the earlier version.',
  'document-upload-quarantine': 'Submit 5 files through 2 scanner states and replace 1 stored object during validation to prove that only checked bytes are released.',
  'large-workbook-acceptance': 'Use 3 workbooks with 10 worksheets and 100,000 populated cells, varying formulas and objects instead of testing file size alone.',
  'preview-versus-readonly-editor': 'Compare 2 file versions, 2 user roles, and 4 operations: view, comment, download, and export.',
  'pdf-fidelity-acceptance': 'Convert 3 source files with 10 pages per file in 2 font environments, then retain both semantic and visual comparison evidence.',
}

export const articleReferenceAdditions = {
  'first-open-source-retrieval': [
    { label: 'MDN: Cross-Origin Resource Sharing', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS' },
    { label: 'OWASP: Server-Side Request Forgery Prevention', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html' },
  ],
  'stale-preview-invalidation': [
    { label: 'RFC 9111: HTTP Caching', url: 'https://www.rfc-editor.org/rfc/rfc9111' },
    { label: 'MDN: HTTP conditional requests', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Conditional_requests' },
  ],
  'ai-document-answer-provenance': [
    { label: 'W3C: PROV-O provenance ontology', url: 'https://www.w3.org/TR/prov-o/' },
    { label: 'NIST: AI Risk Management Framework', url: 'https://www.nist.gov/itl/ai-risk-management-framework' },
  ],
  'document-format-routing': [
    { label: 'IANA: Media Types registry', url: 'https://www.iana.org/assignments/media-types/media-types.xhtml' },
    { label: 'RFC 9110: HTTP Semantics', url: 'https://www.rfc-editor.org/rfc/rfc9110' },
  ],
  'signed-document-url-lifetimes': [
    { label: 'Google Cloud: Signed URLs', url: 'https://cloud.google.com/storage/docs/access-control/signed-urls' },
    { label: 'Microsoft Learn: Shared access signatures', url: 'https://learn.microsoft.com/en-us/azure/storage/common/storage-sas-overview' },
  ],
  'editor-permission-lifecycle': [
    { label: 'OWASP: Session Management Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html' },
    { label: 'NIST SP 800-63B: Authentication and session management', url: 'https://pages.nist.gov/800-63-4/sp800-63b.html' },
  ],
  'document-capacity-measurement': [
    { label: 'Google SRE Book: Handling overload', url: 'https://sre.google/sre-book/handling-overload/' },
    { label: 'OpenTelemetry: Metrics data model', url: 'https://opentelemetry.io/docs/specs/otel/metrics/data-model/' },
  ],
  'ai-document-data-minimization': [
    { label: 'EU GDPR Article 5: Data processing principles', url: 'https://eur-lex.europa.eu/eli/reg/2016/679/art_5/oj' },
    { label: 'NIST: Privacy Framework', url: 'https://www.nist.gov/privacy-framework' },
  ],
  'sso-and-editor-session-logout': [
    { label: 'OpenID Connect: RP-Initiated Logout', url: 'https://openid.net/specs/openid-connect-rpinitiated-1_0.html' },
    { label: 'NIST SP 800-63B: Session management', url: 'https://pages.nist.gov/800-63-4/sp800-63b.html' },
  ],
  'document-deletion-lifecycle': [
    { label: 'EU GDPR Article 17: Right to erasure', url: 'https://eur-lex.europa.eu/eli/reg/2016/679/art_17/oj' },
    { label: 'NIST SP 800-34 Rev. 1: Contingency planning', url: 'https://csrc.nist.gov/pubs/sp/800/34/r1/final' },
  ],
  'accessible-document-preview': [
    { label: 'W3C WAI: Understanding keyboard access', url: 'https://www.w3.org/WAI/WCAG22/Understanding/keyboard' },
    { label: 'W3C WAI: Images tutorial', url: 'https://www.w3.org/WAI/tutorials/images/' },
  ],
  'phased-document-rollout': [
    { label: 'Google SRE Book: Release engineering', url: 'https://sre.google/sre-book/release-engineering/' },
    { label: 'Kubernetes: Deployments', url: 'https://kubernetes.io/docs/concepts/workloads/controllers/deployment/' },
  ],
  'callback-retries-and-idempotency': [
    { label: 'RFC 9110: Idempotent methods', url: 'https://www.rfc-editor.org/rfc/rfc9110#section-9.2.2' },
    { label: 'CloudEvents: Core specification', url: 'https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/spec.md' },
  ],
  'conversion-queue-backpressure': [
    { label: 'AWS Builders Library: Avoiding queue backlogs', url: 'https://aws.amazon.com/builders-library/avoiding-insurmountable-queue-backlogs/' },
    { label: 'AWS Builders Library: Timeouts, retries, and backoff', url: 'https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/' },
  ],
  'document-trace-id-design': [
    { label: 'OpenTelemetry: Traces', url: 'https://opentelemetry.io/docs/concepts/signals/traces/' },
    { label: 'OWASP: Logging Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html' },
  ],
  'font-deployment-as-a-dependency': [
    { label: 'W3C: CSS Fonts Module Level 4', url: 'https://www.w3.org/TR/css-fonts-4/' },
    { label: 'Microsoft Learn: OpenType specification', url: 'https://learn.microsoft.com/en-us/typography/opentype/spec/' },
  ],
  'document-template-governance': [
    { label: 'OWASP: Input Validation Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html' },
    { label: 'NIST: Secure Software Development Framework', url: 'https://csrc.nist.gov/Projects/ssdf' },
  ],
  'document-upload-quarantine': [
    { label: 'NIST SP 800-83 Rev. 1: Malware prevention and handling', url: 'https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-83r1.pdf' },
    { label: 'CISA: StopRansomware guide', url: 'https://www.cisa.gov/stopransomware/ransomware-guide' },
  ],
  'large-workbook-acceptance': [
    { label: 'Microsoft Support: Excel specifications and limits', url: 'https://support.microsoft.com/en-us/office/excel-specifications-and-limits-1672b34d-7043-467e-8e27-269d656771c3' },
    { label: 'Microsoft Learn: Excel performance tips', url: 'https://learn.microsoft.com/en-us/office/vba/excel/concepts/excel-performance/excel-tips-for-optimizing-performance-obstructions' },
  ],
  'preview-versus-readonly-editor': [
    { label: 'RFC 9110: HTTP Semantics', url: 'https://www.rfc-editor.org/rfc/rfc9110' },
    { label: 'OWASP: Session Management Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html' },
  ],
  'pdf-fidelity-acceptance': [
    { label: 'veraPDF: PDF/A validation', url: 'https://verapdf.org/' },
    { label: 'W3C WAI: PDF accessibility techniques', url: 'https://www.w3.org/WAI/WCAG21/Techniques/pdf/' },
  ],
}
