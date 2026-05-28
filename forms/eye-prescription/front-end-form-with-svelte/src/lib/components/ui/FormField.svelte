<script lang="ts">
  // FormField — Lily Svelte headless contract.
  // Emits <div class="field"><label class="label">…</label>…</div>.
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

<div class="field">
  <label class="label" data-required={required || undefined}>
    <span>{label}</span>
    {@render children()}
  </label>
  {#if hint}
    <span class="hint">{hint}</span>
  {/if}
</div>
