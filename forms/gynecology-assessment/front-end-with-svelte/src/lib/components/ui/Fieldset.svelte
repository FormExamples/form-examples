<script lang="ts">
  // Fieldset — Lily Svelte headless contract.
  //
  // Emits: <fieldset class="fieldset"><legend class="fieldset-legend">…</legend>…</fieldset>.
  // Accepts `legend` (canonical) or `title` (legacy SectionCard alias) and an
  // optional `description` shown as a `<p class="hint">` between the legend
  // and the children.
  import type { Snippet } from 'svelte';

  let {
    class: className = '',
    legend = undefined,
    title = undefined,
    description = '',
    disabled = false,
    children,
    ...restProps
  }: {
    legend?: string;
    title?: string;
    description?: string;
    disabled?: boolean;
    children: Snippet;
    [key: string]: unknown;
  } = $props();

  const heading = $derived(legend ?? title ?? '');
</script>

<fieldset class={`fieldset ${className}`} {disabled} {...restProps}>
  <legend class="fieldset-legend">{heading}</legend>
  {#if description}<p class="hint">{description}</p>{/if}
  {@render children?.()}
</fieldset>
