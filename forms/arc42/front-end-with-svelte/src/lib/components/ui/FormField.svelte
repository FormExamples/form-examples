<script lang="ts">
  // FormField — Lily Svelte headless contract.
  // Emits <div class="field"><label class="label">…</label>…</div>.
  import type { Snippet } from 'svelte';
  let {
    label,
    id,
    hint = '',
    children,
  }: { label: string; id: string; hint?: string; children: Snippet } = $props();
</script>

<div class="field">
  <label for={id} class="label">{label}</label>
  {@render children()}
  {#if hint}<span class="hint">{hint}</span>{/if}
</div>
