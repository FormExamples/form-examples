<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    label,
    id,
    hint = '',
    required = false,
    children,
  }: {
    label: string;
    id: string;
    hint?: string;
    required?: boolean;
    children: Snippet;
  } = $props();
</script>

<div class="mb-4">
  <label for={id} class="block text-sm font-medium text-slate-700 mb-1">
    {label}{#if required}<span class="text-red-600" aria-hidden="true"> *</span>{/if}
  </label>
  {@render children()}
  {#if hint}<p class="text-xs text-slate-500 mt-1">{hint}</p>{/if}
</div>
