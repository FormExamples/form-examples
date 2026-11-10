<script lang="ts">
  import CodeBlock from '#lib/components/CodeBlock.svelte';
  import { REPO_URL } from '#lib/site.js';
</script>

<h1 class="text-3xl font-semibold tracking-tight">Get started</h1>
<p class="mt-2 text-muted">Clone the monorepo and run a form locally.</p>

<h2 class="mt-10 text-xl font-semibold">Clone</h2>
<CodeBlock>{`git clone ${REPO_URL.replace('https://', '')}.git
cd form-examples`}</CodeBlock>

<h2 class="mt-10 text-xl font-semibold">Set up PostgreSQL</h2>
<p class="mt-4">Create the role, then a database per form (example uses <code>pre_operative_assessment_by_clinician</code>):</p>
<CodeBlock>{`createuser --host=localhost --port=5432 --superuser --pwprompt postgres || :
createdb --host=localhost --port=5432 --username=postgres --owner=postgres pre_operative_assessment_by_clinician_development || :
createdb --host=localhost --port=5432 --username=postgres --owner=postgres pre_operative_assessment_by_clinician_test || :
createdb --host=localhost --port=5432 --username=postgres --owner=postgres pre_operative_assessment_by_clinician_production || :`}</CodeBlock>

<p class="mt-4">Or via psql:</p>
<CodeBlock>{`CREATE USER postgres SUPERUSER PASSWORD 'postgres';
CREATE DATABASE pre_operative_assessment_by_clinician_development OWNER postgres;
CREATE DATABASE pre_operative_assessment_by_clinician_test OWNER postgres;`}</CodeBlock>

<h2 class="mt-10 text-xl font-semibold">Scaffold a new form</h2>
<CodeBlock>{`bin/create-form my-new-form`}</CodeBlock>
<p class="mt-4">This creates <code>forms/my-new-form/</code> with the standard directory layout (index.md, AGENTS.md, spec/, sql/, front-end-with-html/, front-end-with-svelte/, back-end-with-axum/, etc.).</p>

<h2 class="mt-10 text-xl font-semibold">Verify</h2>
<CodeBlock>{`bin/test`}</CodeBlock>
<p class="mt-4">Runs structural validation across all forms.</p>

<p class="mt-10">
  Full setup details are in the
  <a href={`${REPO_URL}#install`} target="_blank" rel="noopener noreferrer">monorepo README</a>.
</p>
