<script lang="ts">
  let {
    value = $bindable(''),
    rows = 4,
    maxlength = 2000,
    placeholder = '',
  }: {
    value: string;
    rows?: number;
    maxlength?: number;
    placeholder?: string;
  } = $props();
</script>

<textarea
  {rows}
  {maxlength}
  {placeholder}
  bind:value
  class="w-full border border-slate-300 rounded px-2 py-1 focus:outline-none focus:ring focus:ring-brand-500"
></textarea>
<span class="text-xs text-slate-500">{value.length} / {maxlength}</span>
