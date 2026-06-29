<script lang="ts">
  // RadioGroup — Lily Svelte headless contract.
  // Emits: <fieldset class="radio-group" role="radiogroup">...</fieldset>.
  import type { Snippet } from 'svelte';

  let {
    class: className = '',
    label,
    children,
    ...restProps
  }: {
    label: string;
    children: Snippet;
    [key: string]: unknown;
  } = $props();
</script>

<fieldset
  class={`radio-group ${className}`}
  role="radiogroup"
  aria-label={label}
  {...restProps}
>
  {@render children?.()}
</fieldset>
