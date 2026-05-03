<script lang="ts">
  import CategoryTable from '$lib/components/CategoryTable.svelte';
  import { forms } from '$lib/data/forms.generated';
  import { REPO_URL } from '$lib/site';

  function formUrl(slug: string): string {
    return `${REPO_URL}/tree/main/forms/${slug}`;
  }
</script>

<svelte:head>
  <title>Forms — FormExamples</title>
</svelte:head>

<h1 class="text-3xl font-semibold tracking-tight">Forms</h1>
<p class="mt-2 text-slate-600 dark:text-slate-400">All {forms.length} medical-form projects in the monorepo, grouped by category.</p>

<h2 class="mt-10 text-xl font-semibold">Categories</h2>
<CategoryTable />

<h2 class="mt-10 text-xl font-semibold">All forms ({forms.length})</h2>
<ul class="mt-4 columns-1 gap-x-8 sm:columns-2">
  {#each forms as form}
    <li class="break-inside-avoid py-1">
      <a href={formUrl(form.slug)} target="_blank" rel="noopener noreferrer">{form.title}</a>
      <span class="ml-1 text-xs text-slate-500 dark:text-slate-400">{form.slug}</span>
    </li>
  {/each}
</ul>
