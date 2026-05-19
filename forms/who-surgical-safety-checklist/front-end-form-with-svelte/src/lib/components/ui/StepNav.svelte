<script lang="ts">
  import { goto } from '$app/navigation';
  import { STEPS, MIN_STEP, MAX_STEP } from '$lib/config/steps.js';

  let { current }: { current: number } = $props();

  function go(n: number) {
    if (n >= MIN_STEP && n <= MAX_STEP) goto(`/checklist/${n}`);
  }
</script>

<nav class="flex flex-wrap items-center gap-2 mb-4" aria-label="Wizard steps">
  {#each STEPS as s (s.number)}
    <button
      type="button"
      class="px-3 py-1.5 rounded text-sm border transition
        {s.number === current
        ? 'bg-brand-600 text-white border-brand-600'
        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'}"
      aria-current={s.number === current ? 'step' : undefined}
      onclick={() => go(s.number)}
    >
      <span class="font-medium">Step {s.number}</span> · {s.short}
    </button>
  {/each}
</nav>

<div class="flex justify-between gap-2 mt-6 pt-4 border-t border-slate-200">
  <button
    type="button"
    class="px-4 py-2 rounded border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-50"
    disabled={current <= MIN_STEP}
    onclick={() => go(current - 1)}
  >
    ← Previous
  </button>
  <button
    type="button"
    class="px-4 py-2 rounded bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50"
    disabled={current >= MAX_STEP}
    onclick={() => go(current + 1)}
  >
    Next →
  </button>
</div>
