<script lang="ts">
  import OnThisPage from '$lib/components/OnThisPage.svelte';
  import { REPO_URL } from '$lib/site';

  const sections = [
    { id: 'html', label: 'Front-end: HTML / Lily headless' },
    { id: 'svelte', label: 'Front-end: SvelteKit / Lily headless' },
    { id: 'rust', label: 'Back-end: Rust / axum / Loco' },
    { id: 'sql', label: 'SQL migrations' },
    { id: 'xml', label: 'XML representations' },
    { id: 'fhir', label: 'FHIR HL7 R5' },
    { id: 'protobuf', label: 'Protocol Buffers' },
    { id: 'openapi', label: 'OpenAPI 3.1' }
  ];

  function agentDoc(path: string): string {
    return `${REPO_URL}/blob/main/${path}`;
  }
</script>

<OnThisPage {sections} />

<h1 class="text-3xl font-semibold tracking-tight">Tech stacks</h1>
<p class="mt-2 text-muted">Each form is implemented across several stacks. The links go to the per-stack agent docs in the monorepo.</p>

<h2 id="html" class="mt-10 text-xl font-semibold">Front-end with HTML / Lily Design System headless</h2>
<p class="mt-4">
  Each form ships a single, consolidated <code>front-end-with-html/</code> — one directory whose
  <code>index.html</code> is the single-page, step-by-step wizard and <code>dashboard.html</code> is the vetting
  dashboard, sharing one <code>css/</code> and <code>js/</code>. The scoring engine (<code>js/types.js</code> →
  <code>js/rules.js</code> → <code>js/grader.js</code> → <code>js/flags.js</code>, sometimes under domain-specific
  filenames) is pure JavaScript, loaded as native ES modules. The Lily Design System HTML headless
  library defines the markup/class contract every form's <code>index.html</code>/<code>dashboard.html</code> satisfy —
  theme, locale, text-size, and share controls in the page header, and a vendored multi-theme CSS
  catalogue under <code>css/themes/</code>.
</p>
<p class="mt-4">
  <a href={agentDoc('forms/AGENTS-front-end-html.md')} target="_blank" rel="noopener noreferrer">Read the HTML stack doc →</a>
</p>

<h2 id="svelte" class="mt-10 text-xl font-semibold">Front-end with SvelteKit / Lily Design System Svelte headless</h2>
<p class="mt-4">
  Each form also ships a single, consolidated <code>front-end-with-svelte/</code> — one SvelteKit app that
  serves both the wizard and the dashboard from RESTful, resource-oriented routes nested under
  <code>src/routes/&lt;slug&gt;/</code>, sharing one scoring engine (<code>src/lib/engine/</code>) and UI component set
  (<code>src/lib/components/ui/</code>). Grading is a pure TypeScript pipeline (<code>types.ts</code> →
  <code>*-rules.ts</code> → <code>*-grader.ts</code> → <code>flagged-issues.ts</code>) with Vitest unit tests. The Lily
  Design System Svelte headless library — five vendored helper components (ThemePicker, LocalePicker,
  TextSizePicker, SharePicker, DateTimePicker) plus a 45-theme CSS catalogue under <code>static/themes/</code> —
  defines the component contract.
</p>
<p class="mt-4">
  <a href={agentDoc('forms/AGENTS-front-end-svelte.md')} target="_blank" rel="noopener noreferrer">Read the SvelteKit stack doc →</a>
</p>

<h2 id="rust" class="mt-10 text-xl font-semibold">Back-end with Rust / axum / Loco</h2>
<p class="mt-4">
  Each form has a Rust back-end JSON API built on the Loco framework with axum routing — no HTML
  rendering layer at all: no Tera templates, no HTMX, no Alpine.js, no Lily Design System, no CSS, no
  static assets. The schema is relational and per-table: one Loco migration, one SeaORM entity, and
  one RESTful scaffold controller per SQL table (never a single table with a JSONB blob), running
  against PostgreSQL.
</p>
<p class="mt-4">
  The Rust scoring types mirror the front-ends' TypeScript/JavaScript types via
  <code>serde(rename_all = "camelCase")</code>, so every implementation stays aligned at its JSON boundary.
</p>
<p class="mt-4">
  <a href={agentDoc('AGENTS/back-end-with-loco.md')} target="_blank" rel="noopener noreferrer">Read the Rust stack doc →</a>
</p>

<h2 id="sql" class="mt-10 text-xl font-semibold">SQL migrations</h2>
<p class="mt-4">
  Each form has PostgreSQL migrations in Liquibase SQL format under <code>sql/</code> — the source of truth
  every generated representation derives from. Filenames follow <code>NN_create_table_&lt;name&gt;.sql</code>,
  with <code>COMMENT ON TABLE</code> and <code>COMMENT ON COLUMN</code> statements for every column. Primary keys are
  UUIDv4 via <code>gen_random_uuid()</code>, and every table has <code>created_at</code>, <code>updated_at</code>, and
  <code>deleted_at</code> timestamps.
</p>
<p class="mt-4">
  <a href={agentDoc('AGENTS/sql.md')} target="_blank" rel="noopener noreferrer">Read the SQL migrations doc →</a>
</p>

<h2 id="xml" class="mt-10 text-xl font-semibold">XML representations</h2>
<p class="mt-4">
  An XML + DTD pair is generated per SQL table entity. The XML schema matches the SQL schema
  one-to-one, providing an alternative wire format for systems that prefer XML over JSON.
</p>
<p class="mt-4">
  <a href={agentDoc('AGENTS/xml-representations.md')} target="_blank" rel="noopener noreferrer">Read the XML representations doc →</a>
</p>

<h2 id="fhir" class="mt-10 text-xl font-semibold">FHIR HL7 R5 representations</h2>
<p class="mt-4">
  Each SQL entity is also represented as a FHIR HL7 R5 JSON resource, validated against the official
  HL7 <code>validator_cli.jar</code> in CI. This is the interoperability format expected by EHR systems and
  health-information exchanges that have standardized on FHIR R5.
</p>
<p class="mt-4">
  <a href={agentDoc('AGENTS/fhir-r5.md')} target="_blank" rel="noopener noreferrer">Read the FHIR R5 doc →</a>
</p>

<h2 id="protobuf" class="mt-10 text-xl font-semibold">Protocol Buffers representations</h2>
<p class="mt-4">
  A Protocol Buffers <code>.proto</code> schema is generated per SQL table entity, so a form's data can be
  serialized, transmitted, or code-generated into any language the protobuf compiler supports.
</p>
<p class="mt-4">
  <a href={agentDoc('AGENTS/protobuf.md')} target="_blank" rel="noopener noreferrer">Read the Protocol Buffers doc →</a>
</p>

<h2 id="openapi" class="mt-10 text-xl font-semibold">OpenAPI 3.1 representations</h2>
<p class="mt-4">
  An OpenAPI 3.1 <code>.yaml</code> specification is generated per SQL table entity (plus one combined
  <code>openapi.yaml</code> per form), so a form's resources can be described, mocked, validated, and
  code-generated by any OpenAPI-compatible tooling.
</p>
<p class="mt-4">
  <a href={agentDoc('AGENTS/openapi.md')} target="_blank" rel="noopener noreferrer">Read the OpenAPI doc →</a>
</p>
