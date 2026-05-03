<script lang="ts">
  import OnThisPage from '$lib/components/OnThisPage.svelte';
  import { REPO_URL } from '$lib/site';

  const sections = [
    { id: 'sveltekit', label: 'SvelteKit / Tailwind / SVAR' },
    { id: 'rust', label: 'Rust / axum / Loco / HTMX' },
    { id: 'sql', label: 'SQL migrations' },
    { id: 'xml', label: 'XML representations' },
    { id: 'fhir', label: 'FHIR HL7 R5' }
  ];

  function agentDoc(filename: string): string {
    return `${REPO_URL}/blob/main/AGENTS/${filename}`;
  }
</script>

<svelte:head>
  <title>Tech stacks — FormExamples</title>
</svelte:head>

<OnThisPage {sections} />

<h1 class="text-3xl font-semibold tracking-tight">Tech stacks</h1>
<p class="mt-2 text-slate-600 dark:text-slate-400">Each form is implemented across several stacks. The links go to the per-stack agent docs in the monorepo.</p>

<h2 id="sveltekit" class="mt-10 text-xl font-semibold">Front-end with SvelteKit / Tailwind / SVAR</h2>
<p class="mt-4">
  Each form ships a SvelteKit app with a single-page, step-by-step wizard backed by a class-based
  Svelte 5 reactive store. Grading is a pure TypeScript pipeline (<code>types.ts</code> → <code>*-rules.ts</code> →
  <code>*-grader.ts</code> → <code>flagged-issues.ts</code>) with Vitest unit tests, and a PDF report is rendered by a
  SvelteKit server endpoint at <code>/report/pdf</code>.
</p>
<p class="mt-4">
  Each form also ships a SvelteKit dashboard built on the SVAR DataGrid (Willow theme), with sortable
  columns, dropdown filters, computed scores and severities, and a backend API client that falls back
  to sample data when the backend isn't running.
</p>
<p class="mt-4">
  <a href={agentDoc('front-end-with-sveltekit-tailwind-svar.md')} target="_blank" rel="noopener noreferrer">Read the SvelteKit stack doc →</a>
</p>

<h2 id="rust" class="mt-10 text-xl font-semibold">Full-stack with Rust / axum / Loco / Tera / HTMX / Alpine.js</h2>
<p class="mt-4">
  Each form has a full-stack Rust implementation built on the Loco framework with axum routing, SeaORM
  against PostgreSQL 18, and Tera templates rendered with <code>&lt;body hx-boost="true"&gt;</code> for HTMX-driven
  navigation. Alpine.js handles per-page interactivity.
</p>
<p class="mt-4">
  The Rust scoring engine mirrors the TypeScript types using <code>serde(rename_all = "camelCase")</code> so
  the two implementations stay aligned at their JSON boundary.
</p>
<p class="mt-4">
  <a href={agentDoc('full-stack-with-loco-tera-htmx-alpine.md')} target="_blank" rel="noopener noreferrer">Read the Rust stack doc →</a>
</p>

<h2 id="sql" class="mt-10 text-xl font-semibold">SQL migrations</h2>
<p class="mt-4">
  Each form has PostgreSQL migrations in Liquibase SQL format under <code>sql-migrations/</code>. Filenames
  follow <code>NN_create_table_&lt;name&gt;.sql</code>, with <code>COMMENT ON TABLE</code> and <code>COMMENT ON COLUMN</code>
  statements for every column. Primary keys are UUIDv4 and every table has <code>created_at</code> +
  <code>updated_at</code> timestamps.
</p>
<p class="mt-4">
  <a href={agentDoc('sql-migrations.md')} target="_blank" rel="noopener noreferrer">Read the SQL migrations doc →</a>
</p>

<h2 id="xml" class="mt-10 text-xl font-semibold">XML representations</h2>
<p class="mt-4">
  An XML + DTD pair is generated per SQL table entity. The XML schema matches the SQL schema
  one-to-one, providing an alternative wire format for systems that prefer XML over JSON.
</p>
<p class="mt-4">
  <a href={agentDoc('xml-representations.md')} target="_blank" rel="noopener noreferrer">Read the XML representations doc →</a>
</p>

<h2 id="fhir" class="mt-10 text-xl font-semibold">FHIR HL7 R5 representations</h2>
<p class="mt-4">
  Each SQL entity is also represented as a FHIR HL7 R5 JSON resource. This is the interoperability
  format expected by EHR systems and health-information exchanges that have standardized on FHIR R5.
</p>
<p class="mt-4">
  <a href={agentDoc('fhir-r5.md')} target="_blank" rel="noopener noreferrer">Read the FHIR R5 doc →</a>
</p>
