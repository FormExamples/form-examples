<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  import OnThisPage from '$lib/components/OnThisPage.svelte';

  const sections = [
    { id: 'directory-layout', label: 'Directory layout' },
    { id: 'design-patterns', label: 'Design patterns' },
    { id: 'conventions', label: 'Conventions' }
  ];
</script>

<OnThisPage {sections} />

<h1 class="text-3xl font-semibold tracking-tight">Architecture</h1>
<p class="mt-2 text-muted">How each form project is laid out and the design patterns shared across them.</p>

<h2 id="directory-layout" class="mt-10 text-xl font-semibold">Directory layout</h2>
<p class="mt-4">Each form lives in <code>forms/&lt;slug&gt;/</code> with a consistent layout:</p>
<CodeBlock>{`forms/<slug>/
  index.md                       # Form description and scoring details
  README.md -> index.md          # Symlink for GitHub rendering
  AGENTS.md                      # Agent instructions for this form
  CLAUDE.md                      # Claude Code project instructions
  spec/                          # Living domain spec (index.md + README symlink)
  plan.md                        # Implementation plan and status
  tasks.md                       # Task tracking
  CHANGELOG.md                   # Keep-a-Changelog + SemVer
  doc/                           # Clinical/regulatory reference documentation
  examples/                      # Filled-form JSON fixtures + personas + FHIR R5 Bundle
  sql/                           # PostgreSQL Liquibase migrations (source of truth)
  xml/                           # XML + DTD per SQL table entity (generated)
  fhir/r5/                       # FHIR HL7 R5 JSON per SQL entity (generated)
  protobuf/                      # Protocol Buffers .proto schemas per SQL entity (generated)
  openapi/                       # OpenAPI 3.1 .yaml specifications per SQL entity (generated)
  front-end-with-html/           # Questionnaire + dashboard (HTML, Lily Design System)
  front-end-with-svelte/         # Questionnaire + dashboard (SvelteKit, Lily Design System)
  back-end-with-loco/            # Back-end Rust JSON API (axum + Loco)
  back-end-with-loco-setup       # Scaffold generator (generated)`}</CodeBlock>

<h2 id="design-patterns" class="mt-10 text-xl font-semibold">Design patterns</h2>

<h3 class="mt-6 text-lg font-semibold">Front-ends</h3>
<ol class="mt-3 list-decimal space-y-1 pl-6">
  <li>One continuous single-page, step-by-step wizard — never multi-page</li>
  <li>Pure scoring engine per form (types → rules → grader → flagged issues), independently testable</li>
  <li>Both stacks — HTML/headless and SvelteKit — implemented per form, each covering the questionnaire and its dashboard, both on the Lily Design System</li>
  <li>Header carries theme, locale, text-size, and share controls, wired to the vendored Lily Design System Svelte/HTML helpers</li>
</ol>

<h3 class="mt-6 text-lg font-semibold">Back-end</h3>
<ul class="mt-3 list-disc space-y-1 pl-6">
  <li>Rust JSON API — axum routing via the Loco framework, no server-rendered templates</li>
  <li>Relational, per-table schema: one Loco migration + one entity + one RESTful scaffold controller per SQL table (never a single table with a JSONB blob)</li>
  <li><code>serde(rename_all = "camelCase")</code> on every struct shared with a front-end, mirroring the front-end's TypeScript types</li>
  <li>SeaORM entities against PostgreSQL, generated from the same <code>sql/</code> migrations that are the schema's source of truth</li>
  <li>Postgres-only background queue plus OpenTelemetry + Prometheus <code>/metrics</code> observability</li>
</ul>

<h2 id="conventions" class="mt-10 text-xl font-semibold">Conventions</h2>
<ul class="mt-4 list-disc space-y-1 pl-6">
  <li>Empty string <code>''</code> for unanswered text/enum fields; <code>null</code> for unanswered numeric, date, and time fields</li>
  <li>camelCase property names in TypeScript and front-end Rust serde; snake_case in SQL and Rust internals</li>
  <li>Step components named <code>StepNName.svelte</code> (1-indexed; no spaces, ampersands, or parentheses)</li>
  <li>UI components in <code>src/lib/components/ui/</code></li>
  <li>UUIDv4 primary keys via <code>gen_random_uuid()</code>; <code>created_at</code>, <code>updated_at</code>, and <code>deleted_at</code> timestamps on every table</li>
  <li>Generated artefacts (XML, FHIR, protobuf, OpenAPI, the Loco setup script, <code>CHANGELOG.md</code>, <code>examples/</code>) are never hand-edited — regenerated from source instead</li>
</ul>
