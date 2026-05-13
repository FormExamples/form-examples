<script lang="ts">
  import type { Snippet } from 'svelte';
  import { page } from '$app/stores';
  import { STEPS } from '$lib/config/steps.js';
  import { store } from '$lib/stores/documentation.svelte.js';
  import { calculateMaturity } from '$lib/grading/maturity-grader.js';

  let { children }: { children: Snippet } = $props();

  const currentStep = $derived(Number($page.params.step));
  const maturity = $derived(calculateMaturity(store.data).computedMaturity);
</script>

<!-- Progress bar -->
<nav class="mb-6">
  <ol class="flex flex-wrap gap-1">
    {#each STEPS as step}
      <li>
        <a
          href="/documentation/{step.number}"
          class="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium border
            {currentStep === step.number
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'}"
          title={step.title}
        >
          {step.number}
        </a>
      </li>
    {/each}
  </ol>
  <p class="text-xs text-slate-500 mt-1">
    Step {currentStep} of {STEPS.length} — live maturity: <strong class="capitalize">{maturity || 'draft'}</strong>
  </p>
</nav>

{@render children()}

<!-- Previous / Next navigation -->
<nav class="mt-8 flex justify-between border-t border-slate-200 pt-4">
  {#if currentStep > 1}
    <a href="/documentation/{currentStep - 1}" class="px-4 py-2 rounded border border-slate-300 text-slate-700 hover:bg-slate-100">
      &larr; Previous
    </a>
  {:else}
    <span></span>
  {/if}
  {#if currentStep < STEPS.length}
    <a href="/documentation/{currentStep + 1}" class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
      Next &rarr;
    </a>
  {:else}
    <a href="/" class="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">
      Finish
    </a>
  {/if}
</nav>
