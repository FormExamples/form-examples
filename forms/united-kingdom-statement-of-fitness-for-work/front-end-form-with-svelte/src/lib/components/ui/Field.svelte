<script lang="ts">
  // Field — Lily Svelte headless contract.
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

<div class="field">
  <label class="label" for={id} data-required={required || undefined}>{label}</label>
  {@render children()}
  {#if hint}<span class="hint">{hint}</span>{/if}
</div>
