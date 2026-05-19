<script lang="ts">
  let {
    label,
    value = $bindable(),
    min,
    max,
    step = 'any',
    unit = '',
    hint = '',
  }: {
    label: string;
    value: number | null;
    min?: number;
    max?: number;
    step?: number | 'any';
    unit?: string;
    hint?: string;
  } = $props();
</script>

<label class="block">
  <span class="text-sm text-slate-700">{label}{unit ? ` (${unit})` : ''}</span>
  <input
    type="number"
    {min}
    {max}
    {step}
    class="w-full border rounded px-2 py-1"
    bind:value
  />
  {#if hint}<p class="text-xs text-slate-500 mt-1">{hint}</p>{/if}
</label>
