<script lang="ts">
  interface Props {
    label: string;
    value: number | null;
    min?: number;
    max?: number;
    step?: number;
    hint?: string;
    onchange?: () => void;
  }
  let {
    label,
    value = $bindable(),
    min,
    max,
    step,
    hint = '',
    onchange,
  }: Props = $props();
  const id = `n-${Math.random().toString(36).slice(2, 10)}`;
</script>

<label for={id} class="block">
  <span class="mb-1 block text-sm font-medium text-slate-700">{label}</span>
  <input
    {id}
    type="number"
    {min}
    {max}
    {step}
    bind:value
    oninput={() => onchange?.()}
    class="w-full rounded border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
  />
  {#if hint}<p class="mt-1 text-xs text-slate-500">{hint}</p>{/if}
</label>
