<script lang="ts">
  interface Option {
    value: string;
    label: string;
  }
  interface Props {
    label: string;
    value: string;
    options: Option[];
    hint?: string;
    required?: boolean;
    onchange?: () => void;
  }
  let {
    label,
    value = $bindable(),
    options,
    hint = '',
    required = false,
    onchange,
  }: Props = $props();

  const id = `s-${Math.random().toString(36).slice(2, 10)}`;
</script>

<label for={id} class="block">
  <span class="mb-1 block text-sm font-medium text-slate-700">
    {label}{#if required}<span class="text-red-600" aria-label="required"> *</span>{/if}
  </span>
  <select
    {id}
    bind:value
    onchange={() => onchange?.()}
    class="w-full rounded border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
  >
    <option value="">— select —</option>
    {#each options as opt (opt.value)}
      <option value={opt.value}>{opt.label}</option>
    {/each}
  </select>
  {#if hint}<p class="mt-1 text-xs text-slate-500">{hint}</p>{/if}
</label>
