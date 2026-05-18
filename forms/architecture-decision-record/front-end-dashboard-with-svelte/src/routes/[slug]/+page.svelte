<script lang="ts">
  import { page } from '$app/state';
  import { onMount } from 'svelte';
  import { fetchAdr, type AdrView } from '$lib/api/adrs.js';

  let adr = $state<AdrView | null>(null);
  let loaded = $state(false);

  onMount(async () => {
    const slug = page.params.slug ?? '';
    adr = slug ? await fetchAdr(slug) : null;
    loaded = true;
  });

  function statusClass(s: string): string {
    const map: Record<string, string> = {
      pending: 'bg-amber-100 text-amber-800 border-amber-200',
      decided: 'bg-blue-100 text-blue-800 border-blue-200',
      approved: 'bg-green-100 text-green-800 border-green-200',
      superseded: 'bg-slate-100 text-slate-700 border-slate-300',
      deprecated: 'bg-red-100 text-red-800 border-red-200'
    };
    return map[s] ?? '';
  }
</script>

<div class="mb-4">
  <a class="text-sm text-blue-700 hover:underline" href="/">← Back to register</a>
</div>

{#if !loaded}
  <p class="text-sm text-slate-500 italic">Loading…</p>
{:else if adr === null}
  <div class="bg-white rounded-lg shadow-sm p-6 max-w-2xl">
    <h2 class="text-lg font-semibold mb-2">ADR not found</h2>
    <p class="text-sm text-slate-600">
      No ADR was found with slug <code>{page.params.slug}</code>. The dashboard
      could not reach the backend, or the slug does not exist.
    </p>
  </div>
{:else}
  <article class="bg-white rounded-lg shadow-sm p-6 space-y-3">
    <header class="flex flex-wrap items-baseline gap-3 pb-3 border-b border-slate-200">
      <span class="font-mono text-sm text-slate-500">
        {adr.number !== null ? String(adr.number).padStart(4, '0') : 'NNNN'}
      </span>
      <h1 class="text-xl font-semibold flex-1">{adr.title}</h1>
      <span class="inline-block px-2 py-0.5 rounded-full border text-xs {statusClass(adr.status)}">
        {adr.status || 'pending'}
      </span>
      {#if adr.decisionGroup}
        <span class="text-xs text-slate-600 bg-slate-100 rounded px-2 py-0.5">{adr.decisionGroup}</span>
      {/if}
    </header>

    <div class="text-xs text-slate-600">
      {#if adr.authorName}<span><strong>Author:</strong> {adr.authorName}</span>{/if}
      {#if adr.decisionDate}<span class="ml-3"><strong>Date:</strong> {adr.decisionDate}</span>{/if}
    </div>

    <pre class="bg-slate-50 border border-slate-200 rounded p-4 text-sm whitespace-pre-wrap overflow-x-auto">{adr.markdown}</pre>
  </article>
{/if}
