<script lang="ts">
  // Panel — Lily Svelte headless contract. Emits: <section class="panel">.
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

<section class={`panel ${className}`} aria-label={label} {...restProps}>
  {@render children?.()}
</section>
