<script lang="ts">
  let {
    label,
    value = $bindable(),
    options,
    hint = '',
  }: {
    label: string;
    value: string;
    options: { value: string; label: string }[];
    hint?: string;
  } = $props();
</script>

<label class="block">
  <span class="text-sm text-slate-700">{label}</span>
  <select class="w-full border rounded px-2 py-1" bind:value>
    <option value="">—</option>
    {#each options as o (o.value)}
      <option value={o.value}>{o.label}</option>
    {/each}
  </select>
  {#if hint}<p class="text-xs text-slate-500 mt-1">{hint}</p>{/if}
</label>
