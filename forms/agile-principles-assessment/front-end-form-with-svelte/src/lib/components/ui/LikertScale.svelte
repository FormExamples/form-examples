<script lang="ts">
  import type { LikertScore } from '$lib/engine/types.js';

  let {
    name,
    value = $bindable(),
  }: { name: string; value: LikertScore } = $props();

  const OPTIONS: { score: 1 | 2 | 3 | 4 | 5; label: string }[] = [
    { score: 1, label: 'Strongly disagree' },
    { score: 2, label: 'Disagree' },
    { score: 3, label: 'Neutral / partial' },
    { score: 4, label: 'Agree' },
    { score: 5, label: 'Strongly agree' },
  ];

  function pick(s: 1 | 2 | 3 | 4 | 5) {
    value = value === s ? null : s;
  }

  function classFor(s: 1 | 2 | 3 | 4 | 5): string {
    if (value !== s) return 'bg-white border-slate-300 text-slate-700 hover:bg-brand-50';
    if (s <= 2) return 'bg-red-100 border-red-500 text-red-900';
    if (s === 3) return 'bg-yellow-100 border-yellow-500 text-yellow-900';
    return 'bg-green-100 border-green-500 text-green-900';
  }
</script>

<fieldset class="border-0 p-0 m-0">
  <legend class="sr-only">{name}</legend>
  <div class="grid grid-cols-1 sm:grid-cols-5 gap-2" role="radiogroup">
    {#each OPTIONS as opt (opt.score)}
      <button
        type="button"
        role="radio"
        aria-checked={value === opt.score}
        class="border rounded px-3 py-2 text-sm text-left transition-colors {classFor(opt.score)}"
        onclick={() => pick(opt.score)}
      >
        <span class="block font-semibold">{opt.score}</span>
        <span class="block text-xs">{opt.label}</span>
      </button>
    {/each}
  </div>
  <p class="text-xs text-slate-500 mt-1">
    Click a score to select. Click the same score again to clear.
  </p>
</fieldset>
