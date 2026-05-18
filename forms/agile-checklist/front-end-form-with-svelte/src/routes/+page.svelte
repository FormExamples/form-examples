<script lang="ts">
  import { goto } from '$app/navigation';
  import { store } from '$lib/stores/checklist.svelte.js';
  import { STEPS } from '$lib/config/steps.js';
  import { TOTAL_ITEMS } from '$lib/config/items.js';
  import Step01 from '$lib/components/steps/Step01Respondent.svelte';
  import Step02 from '$lib/components/steps/Step02Teams.svelte';
  import Step03 from '$lib/components/steps/Step03Stakeholders.svelte';
  import Step04 from '$lib/components/steps/Step04Practices.svelte';
  import Step05 from '$lib/components/steps/Step05Summary.svelte';

  const stepComponents = [Step01, Step02, Step03, Step04, Step05];

  const result = $derived(store.result);
  const progressPct = $derived(Math.round((result.answeredCount / TOTAL_ITEMS) * 100));

  function savedAtLabel(iso: string): string {
    if (!iso) return '';
    try {
      const d = new Date(iso);
      return d.toLocaleString(undefined, { hour: 'numeric', minute: '2-digit' });
    } catch {
      return '';
    }
  }
</script>

{#if store.draftRestored}
  <div
    class="mb-4 p-3 border-l-4 border-brand-600 bg-brand-50 rounded flex flex-wrap items-center gap-3"
    role="status"
  >
    <p class="text-sm text-slate-800 flex-1">
      <strong>Draft restored.</strong>
      A previous in-progress checklist was loaded from this browser.
    </p>
    <button
      type="button"
      class="px-3 py-1 text-sm rounded border border-slate-300 bg-white hover:bg-slate-100"
      onclick={() => store.acknowledgeDraft()}
    >
      Keep editing
    </button>
    <button
      type="button"
      class="px-3 py-1 text-sm rounded border border-red-300 bg-white text-red-700 hover:bg-red-50"
      onclick={() => store.discardDraft()}
    >
      Discard draft
    </button>
  </div>
{/if}

<section class="prose max-w-none mb-6">
  <h2 class="text-xl font-semibold">Self-assessment</h2>
  <p class="text-slate-700 my-2">
    Complete all 5 sections below, then generate the report. The tool
    computes a per-section percentage of "yes" answers, derives a composite
    agility maturity level, fires coaching rules per section, and surfaces
    operational flags such as finished-work risk, experimentation-blocked,
    and psychological-safety risk.
  </p>
  <div class="bg-white border border-slate-200 rounded p-3 mt-3">
    <p class="text-sm font-medium text-slate-700 mb-1">
      Progress: {result.answeredCount} of {TOTAL_ITEMS} items answered ({progressPct}%)
      {#if store.lastSavedAt}
        <span class="text-xs text-slate-500 font-normal" data-testid="saved-indicator">
          · saved {savedAtLabel(store.lastSavedAt)}
        </span>
      {/if}
    </p>
    <div class="w-full bg-slate-200 rounded h-2 overflow-hidden">
      <div class="h-2 bg-brand-600" style="width: {progressPct}%"></div>
    </div>
  </div>
</section>

<nav class="mb-6 flex flex-wrap gap-1 text-xs" aria-label="Step navigation">
  {#each STEPS as s (s.number)}
    <a
      href="#step-{s.number}"
      class="px-2 py-1 border border-slate-300 rounded bg-white hover:bg-brand-50"
    >
      {s.number}. {s.short}
    </a>
  {/each}
</nav>

<div class="space-y-6">
  {#each stepComponents as StepComponent, i (i)}
    <div id="step-{i + 1}" class="bg-white p-6 rounded-lg shadow-sm scroll-mt-20">
      <StepComponent />
    </div>
  {/each}
</div>

<div class="mt-8 pt-4 border-t border-slate-200 flex flex-wrap gap-3 justify-end">
  <button
    type="button"
    class="px-4 py-2 rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
    onclick={() => store.reset()}
  >
    Start over
  </button>
  <button
    type="button"
    class="px-4 py-2 rounded bg-brand-600 text-white hover:bg-brand-700"
    onclick={() => goto('/report')}
  >
    Generate report
  </button>
</div>
