<script lang="ts">
  // Field — Lily Svelte headless contract.
  // Emits <div class="field"><label class="label">…</label>…</div>.
  import type { Snippet } from 'svelte';
  let {
    label,
    hint = '',
    children,
  }: { label: string; hint?: string; children: Snippet } = $props();
</script>

<div class="field">
  <label class="label">
    <span>{label}</span>
    {#if hint}
      <span class="hint">{hint}</span>
    {/if}
    {@render children()}
  </label>
</div>
