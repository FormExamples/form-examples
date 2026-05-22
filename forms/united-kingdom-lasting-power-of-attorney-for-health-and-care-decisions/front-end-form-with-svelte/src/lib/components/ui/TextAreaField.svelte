<script lang="ts">
  interface Props {
    label: string;
    value: string;
    rows?: number;
    placeholder?: string;
    hint?: string;
    onchange?: () => void;
  }
  let {
    label,
    value = $bindable(),
    rows = 4,
    placeholder = '',
    hint = '',
    onchange,
  }: Props = $props();
  const id = `t-${Math.random().toString(36).slice(2, 10)}`;
</script>

<label for={id} class="block">
  <span class="mb-1 block text-sm font-medium text-slate-700">{label}</span>
  <textarea
    {id}
    {rows}
    {placeholder}
    bind:value
    oninput={() => onchange?.()}
    class="w-full rounded border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
  ></textarea>
  {#if hint}<p class="mt-1 text-xs text-slate-500">{hint}</p>{/if}
</label>
