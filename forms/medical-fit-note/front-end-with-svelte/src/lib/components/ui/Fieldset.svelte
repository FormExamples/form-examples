<script lang="ts">
  // Fieldset — Lily Svelte headless contract.
  //
  // Emits: <fieldset class="fieldset"><legend class="fieldset-legend">…</legend>…</fieldset>.
  // The upstream Lily Fieldset renders a plain <legend>; we add the
  // `fieldset-legend` class so the HTML stylesheet contract applies.
  // Mirrors forms/lily-svelte-spec/Fieldset/Fieldset.svelte.
  import type { Snippet } from 'svelte';

  let {
    class: className = '',
    legend,
    disabled = false,
    children,
    ...restProps
  }: {
    legend: string;
    disabled?: boolean;
    children: Snippet;
    [key: string]: unknown;
  } = $props();
</script>

<fieldset class={`fieldset ${className}`} {disabled} {...restProps}>
  <legend class="fieldset-legend">{legend}</legend>
  {@render children?.()}
</fieldset>
