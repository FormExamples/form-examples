<script lang="ts">
  // SectionCard — Lily Svelte headless contract (fieldset shape).
  // Emits <fieldset class="fieldset"><legend class="fieldset-legend">…</legend>…</fieldset>.
  import type { Snippet } from 'svelte';

  let {
    title,
    description = '',
    children,
  }: {
    title: string;
    description?: string;
    children: Snippet;
  } = $props();
</script>

<fieldset class="fieldset">
  <legend class="fieldset-legend">{title}</legend>
  {#if description}<p class="hint">{description}</p>{/if}
  {@render children()}
</fieldset>
