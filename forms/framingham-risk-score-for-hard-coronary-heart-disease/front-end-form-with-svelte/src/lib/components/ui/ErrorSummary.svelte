<script lang="ts">
  // ErrorSummary — Lily Svelte headless contract.
  // Emits: <div class="error-summary" role="alert" tabindex="-1">.
  import type { Snippet } from 'svelte';

  let {
    class: className = '',
    title,
    children,
    ...restProps
  }: {
    title: string;
    children: Snippet;
    [key: string]: unknown;
  } = $props();

  const uid = $props.id();
  const titleId = `error-summary-${uid}`;
</script>

<div
  class={`error-summary ${className}`}
  role="alert"
  aria-labelledby={titleId}
  tabindex="-1"
  {...restProps}
>
  <h2 id={titleId}>{title}</h2>
  {@render children?.()}
</div>
