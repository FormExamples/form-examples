<script lang="ts">
  // FormField — Lily Svelte headless contract.
  // Emits: <div class="field"><label class="label">…</label> <slot/>
  //        <p class="hint">…</p></div>.
  import type { Snippet } from 'svelte';
  let {
    label,
    id,
    hint = '',
    required = false,
    children,
  }: { label: string; id: string; hint?: string; required?: boolean; children: Snippet } = $props();
</script>

<div class="field" data-required={required || undefined}>
  <label class="label" for={id} data-required={required || undefined}>{label}</label>
  {@render children()}
  {#if hint}<p class="hint">{hint}</p>{/if}
</div>
