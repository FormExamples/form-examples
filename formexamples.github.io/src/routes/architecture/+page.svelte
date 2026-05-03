<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  import OnThisPage from '$lib/components/OnThisPage.svelte';

  const sections = [
    { id: 'directory-layout', label: 'Directory layout' },
    { id: 'design-patterns', label: 'Design patterns' },
    { id: 'conventions', label: 'Conventions' }
  ];
</script>

<svelte:head>
  <title>Architecture — FormExamples</title>
</svelte:head>

<OnThisPage {sections} />

<h1 class="text-3xl font-semibold tracking-tight">Architecture</h1>
<p class="mt-2 text-slate-600 dark:text-slate-400">How each form project is laid out and the design patterns shared across them.</p>

<h2 id="directory-layout" class="mt-10 text-xl font-semibold">Directory layout</h2>
<p class="mt-4">Each form lives in <code>forms/&lt;slug&gt;/</code> with a consistent layout:</p>
<CodeBlock>{`forms/<slug>/
  index.md                                  # Form description + scoring system
  README.md -> index.md                     # Symlink for GitHub rendering
  AGENTS.md                                 # Agent instructions for this form
  CLAUDE.md                                 # Claude Code project instructions
  plan.md                                   # Implementation plan and status
  tasks.md                                  # Task tracking
  doc/                                      # Documentation and references
  sql-migrations/                           # PostgreSQL Liquibase migrations
  xml-representations/                      # XML + DTD per SQL table entity
  fhir-r5/                                  # FHIR HL7 R5 JSON per SQL entity
  front-end-form-with-html/                 # Patient questionnaire (HTML)
  front-end-form-with-svelte/               # Patient questionnaire (SvelteKit)
  front-end-dashboard-with-html/            # Dashboard (HTML)
  front-end-dashboard-with-svelte/          # Dashboard (SvelteKit)
  full-stack-with-loco-tera-htmx-alpine/    # Full-stack Rust backend`}</CodeBlock>

<h2 id="design-patterns" class="mt-10 text-xl font-semibold">Design patterns</h2>

<h3 class="mt-6 text-lg font-semibold">Form</h3>
<ol class="mt-3 list-decimal space-y-1 pl-6">
  <li>Single-page, step-by-step wizard with <code>StepNavigation</code> and <code>ProgressBar</code></li>
  <li>Pure scoring engine: <code>types.ts</code> → <code>*-rules.ts</code> → <code>*-grader.ts</code> → <code>flagged-issues.ts</code></li>
  <li>Class-based Svelte 5 reactive store (<code>assessment.svelte.ts</code>) — no Svelte stores</li>
  <li>PDF report generation via SvelteKit server endpoint (<code>/report/pdf</code>)</li>
  <li>Vitest unit tests for grading logic</li>
</ol>

<h3 class="mt-6 text-lg font-semibold">Dashboard</h3>
<ul class="mt-3 list-disc space-y-1 pl-6">
  <li>SVAR DataGrid with sortable columns and dropdown filters</li>
  <li>Willow theme wrapper for consistent styling</li>
  <li>Backend API client with sample data fallback</li>
  <li>Row list with computed scores, severities, and safety flags</li>
</ul>

<h3 class="mt-6 text-lg font-semibold">Backend</h3>
<ul class="mt-3 list-disc space-y-1 pl-6">
  <li>Loco framework with axum routing (port 5150 in development)</li>
  <li>Rust scoring engine mirrors TypeScript types with <code>serde(rename_all = "camelCase")</code></li>
  <li>SeaORM entities against PostgreSQL 18</li>
  <li>Tera templates with <code>&lt;body hx-boost="true"&gt;</code> for HTMX-driven navigation</li>
</ul>

<h2 id="conventions" class="mt-10 text-xl font-semibold">Conventions</h2>
<ul class="mt-4 list-disc space-y-1 pl-6">
  <li>Empty string <code>''</code> for unanswered text fields; <code>null</code> for unanswered numeric fields</li>
  <li>camelCase property names in TypeScript; snake_case in SQL and Rust</li>
  <li>Step components named <code>StepNName.svelte</code> (1-indexed)</li>
  <li>UI components in <code>src/lib/components/ui/</code></li>
  <li><code>serde(rename_all = "camelCase")</code> on Rust structs shared with the front-end</li>
  <li>UUIDv4 primary keys; <code>created_at</code> + <code>updated_at</code> timestamps on every table</li>
</ul>
