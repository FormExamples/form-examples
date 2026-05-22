<script lang="ts">
  import type { Snippet } from 'svelte';
  let {
    label,
    hint = '',
    required = false,
    children,
  }: {
    label: string;
    hint?: string;
    required?: boolean;
    children: Snippet;
  } = $props();
</script>

<label class="block mb-3">
  <span class="block text-sm font-medium text-slate-700 mb-1">
    {label}
    {#if required}<span class="text-red-600 ml-0.5">*</span>{/if}
  </span>
  {@render children()}
  {#if hint}
    <span class="block text-xs text-slate-500 mt-1">{hint}</span>
  {/if}
</label>
