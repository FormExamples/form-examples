<script lang="ts">
  import type { YesNo } from '$lib/engine/types.js';
  let {
    label,
    value = $bindable(),
    hint = '',
  }: { label: string; value: YesNo; hint?: string } = $props();
</script>

<label class="block">
  <span class="text-sm text-slate-700">{label}</span>
  <select class="w-full border rounded px-2 py-1" bind:value>
    <option value="">—</option>
    <option value="yes">Yes</option>
    <option value="no">No</option>
  </select>
  {#if hint}<p class="text-xs text-slate-500 mt-1">{hint}</p>{/if}
</label>
