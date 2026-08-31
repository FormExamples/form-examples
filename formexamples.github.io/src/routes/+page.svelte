<script lang="ts">
  import { SITE_NAME, SITE_TAGLINE, REPO_URL } from '$lib/site';
  import CategoryTable from '$lib/components/CategoryTable.svelte';
  import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<h1 class="text-3xl font-semibold tracking-tight">{SITE_NAME}</h1>
<p class="mt-2 text-lg text-muted">{SITE_TAGLINE}</p>

<p class="mt-6">
  Medical forms monorepo for structured clinical assessments, patient intake,
  cardiovascular risk calculators, administrative healthcare documents,
  privacy notices, and staff training checklists. Each project collects data
  via a single-page, step-by-step questionnaire, applies a validated scoring
  or grading engine, and generates a clinical report with flagged issues.
</p>

<h2 class="mt-10 text-xl font-semibold">What's in the repo</h2>
<ul class="mt-4 list-disc space-y-1 pl-6">
  <li>355 form projects, each in <code>forms/&lt;slug&gt;/</code></li>
  <li>PostgreSQL SQL migrations (Liquibase SQL format) — the source of truth</li>
  <li>Generated XML + DTD, FHIR HL7 R5, Protocol Buffers, and OpenAPI 3.1 representations per SQL entity</li>
  <li>Two front-ends per form (questionnaire + dashboard, each in HTML and SvelteKit — both on the Lily Design System)</li>
  <li>A Rust back-end JSON API per form (axum + Loco; no Tera/HTMX/Alpine/CSS)</li>
</ul>

<h2 class="mt-10 text-xl font-semibold">Form categories</h2>
<CategoryTable />

<h2 class="mt-10 text-xl font-semibold">How a form is structured</h2>
<p class="mt-4">Each form lives in <code>forms/&lt;slug&gt;/</code> with a consistent layout:</p>
<CodeBlock>{`forms/<slug>/
  index.md                       # Form description and scoring details
  README.md -> index.md          # Symlink for GitHub rendering
  AGENTS.md, CLAUDE.md           # Agent instructions for this form
  spec/                          # Living domain spec (index.md)
  sql/                           # PostgreSQL Liquibase migrations (source of truth)
  xml/, fhir/r5/, protobuf/, openapi/   # Generated representations per SQL entity
  examples/                      # Filled-form JSON fixtures + personas + FHIR R5 Bundle
  front-end-with-html/           # Questionnaire + dashboard (HTML, Lily Design System)
  front-end-with-svelte/         # Questionnaire + dashboard (SvelteKit, Lily Design System)
  back-end-with-loco/            # Rust JSON API (axum + Loco)`}</CodeBlock>

<div class="mt-10">
  <a
    href={REPO_URL}
    target="_blank"
    rel="noopener noreferrer"
    class="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 font-medium text-primary-content no-underline hover:opacity-90 hover:text-primary-content"
  >
    Browse on GitHub →
  </a>
</div>
