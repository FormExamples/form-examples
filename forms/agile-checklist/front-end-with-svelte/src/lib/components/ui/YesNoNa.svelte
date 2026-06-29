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
    if (value !== v) return 'bg-base-100 border-base-300 text-base-content/70 hover:bg-base-200';
    if (v === 'yes') return 'bg-success text-success-content border-success';
    if (v === 'no') return 'bg-error text-error-content border-error';
    return 'bg-base-300 text-base-content border-base-300';
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
