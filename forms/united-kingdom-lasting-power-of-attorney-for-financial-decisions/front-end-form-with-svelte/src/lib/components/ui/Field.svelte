<script lang="ts">
  import type { Snippet } from 'svelte';
  let {
    label,
    hint = '',
    children,
  }: { label: string; hint?: string; children: Snippet } = $props();
</script>

<label class="block">
  <span class="text-sm text-slate-700 font-medium">{label}</span>
  {#if hint}
    <span class="text-xs text-slate-500 block mb-1">{hint}</span>
  {/if}
  {@render children()}
</label>
