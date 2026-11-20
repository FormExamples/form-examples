<script lang="ts">
  import CategoryTable from '#lib/components/CategoryTable.svelte';
  import { forms } from '#lib/data/forms.generated.js';
  import { REPO_URL } from '#lib/site.js';

  let query = $state('');
  const shown = $derived(
    forms.filter((f) =>
      `${f.title} ${f.slug} ${f.description}`.toLowerCase().includes(query.trim().toLowerCase()),
    ),
  );

  function formUrl(slug: string): string {
    return `${REPO_URL}/tree/main/forms/${slug}`;
  }
</script>

<h1 class="text-3xl font-semibold tracking-tight">Forms</h1>
<p class="mt-2 text-muted">All {forms.length} medical-form projects in the monorepo, grouped by category.</p>

<h2 class="mt-10 text-xl font-semibold">Categories</h2>
<CategoryTable />

<h2 class="mt-10 text-xl font-semibold">Catalog ({shown.length} of {forms.length})</h2>
<label class="mt-4 block text-sm" for="catalog-search">Search forms</label>
<input
  id="catalog-search"
  type="search"
  bind:value={query}
  placeholder="Title, slug or description"
  class="mt-1 w-full max-w-md rounded border border-current/30 bg-transparent px-3 py-2"
/>
<ul class="mt-6 grid gap-4 sm:grid-cols-2" aria-live="polite">
  {#each shown as form (form.slug)}
    <li class="rounded border border-current/20 p-4">
      {#if form.app}
        <a class="font-medium" href="/{form.slug}/" data-sveltekit-reload>{form.title}</a>
      {:else}
        <a class="font-medium" href={formUrl(form.slug)} target="_blank" rel="noopener noreferrer">{form.title}</a>
      {/if}
      <span class="ml-1 text-xs text-muted">{form.slug}</span>
      {#if form.description}<p class="mt-1 text-sm text-muted">{form.description}</p>{/if}
      <p class="mt-2 text-sm">
        {#if form.app}<a href="/{form.slug}/" data-sveltekit-reload>Try the form</a> ·{/if}
        <a href={formUrl(form.slug)} target="_blank" rel="noopener noreferrer">Source</a>
      </p>
    </li>
  {:else}
    <li class="text-muted">No forms match “{query}”.</li>
  {/each}
</ul>
