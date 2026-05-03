<script lang="ts">
  import { SITE_NAME, SITE_TAGLINE, REPO_URL } from '$lib/site';
  import CategoryTable from '$lib/components/CategoryTable.svelte';
  import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<svelte:head>
  <title>{SITE_NAME} — {SITE_TAGLINE}</title>
</svelte:head>

<h1 class="text-3xl font-semibold tracking-tight">{SITE_NAME}</h1>
<p class="mt-2 text-lg text-slate-600 dark:text-slate-400">{SITE_TAGLINE}</p>

<p class="mt-6">
  Medical forms monorepo for structured clinical assessments, patient intake,
  cardiovascular risk calculators, administrative healthcare documents,
  privacy notices, and staff training checklists. Each project collects data
  via a single-page, step-by-step questionnaire, applies a validated scoring
  or grading engine, and generates a clinical report with flagged issues.
</p>

<h2 class="mt-10 text-xl font-semibold">What's in the repo</h2>
<ul class="mt-4 list-disc space-y-1 pl-6">
  <li>116 form projects, each in <code>forms/&lt;slug&gt;/</code></li>
  <li>PostgreSQL SQL migrations (Liquibase SQL format)</li>
  <li>XML + DTD representations per SQL entity</li>
  <li>FHIR HL7 R5 JSON resources per SQL entity</li>
  <li>Four front-end implementations per form (form and dashboard, each in HTML and SvelteKit)</li>
  <li>Full-stack Rust implementation (axum + Loco + Tera + HTMX + Alpine.js)</li>
</ul>

<h2 class="mt-10 text-xl font-semibold">Form categories</h2>
<CategoryTable />

<h2 class="mt-10 text-xl font-semibold">How a form is structured</h2>
<p class="mt-4">Each form lives in <code>forms/&lt;slug&gt;/</code> with a consistent layout:</p>
<CodeBlock>{`forms/<slug>/
  index.md                                  # Form description + scoring system
  AGENTS.md                                 # Agent instructions
  sql-migrations/                           # PostgreSQL Liquibase migrations
  xml-representations/                      # XML + DTD per SQL table entity
  fhir-r5/                                  # FHIR HL7 R5 JSON per SQL entity
  front-end-form-with-html/                 # Patient questionnaire (HTML)
  front-end-form-with-svelte/               # Patient questionnaire (SvelteKit)
  front-end-dashboard-with-html/            # Dashboard (HTML)
  front-end-dashboard-with-svelte/          # Dashboard (SvelteKit)
  full-stack-with-loco-tera-htmx-alpine/    # Full-stack Rust backend`}</CodeBlock>

<div class="mt-10">
  <a
    href={REPO_URL}
    target="_blank"
    rel="noopener noreferrer"
    class="inline-flex items-center gap-2 rounded-md bg-teal-600 px-4 py-2 font-medium text-white no-underline hover:bg-teal-700 hover:text-white"
  >
    Browse on GitHub →
  </a>
</div>
