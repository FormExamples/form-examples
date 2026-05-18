<script lang="ts">
  import type { Answer } from '$lib/engine/types.js';

  let {
    name,
    value = $bindable(),
  }: { name: string; value: Answer } = $props();

  const OPTIONS: { v: Exclude<Answer, ''>; label: string }[] = [
    { v: 'yes', label: 'Yes' },
    { v: 'no', label: 'No' },
    { v: 'not-applicable', label: 'N/A' },
  ];

  function pick(v: Exclude<Answer, ''>) {
    value = value === v ? '' : v;
  }

  function classFor(v: Exclude<Answer, ''>): string {
    if (value !== v) return 'bg-white border-slate-300 text-slate-700 hover:bg-brand-50';
    if (v === 'yes') return 'bg-green-100 border-green-500 text-green-900';
    if (v === 'no') return 'bg-red-100 border-red-500 text-red-900';
    return 'bg-slate-100 border-slate-500 text-slate-800';
  }
</script>

<fieldset class="border-0 p-0 m-0">
  <legend class="sr-only">{name}</legend>
  <div class="grid grid-cols-3 gap-1 max-w-xs" role="radiogroup">
    {#each OPTIONS as opt (opt.v)}
      <button
        type="button"
        role="radio"
        aria-checked={value === opt.v}
        class="border rounded px-2 py-1 text-sm font-medium transition-colors {classFor(opt.v)}"
        onclick={() => pick(opt.v)}
      >
        {opt.label}
      </button>
    {/each}
  </div>
</fieldset>
