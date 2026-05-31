<script lang="ts">
  // StepList — Lily Svelte headless contract.
  import type { Snippet } from 'svelte';

  let {
    class: className = '',
    label = undefined,
    current = undefined,
    children,
    ...restProps
  }: { label?: string; current?: number; children: Snippet; [key: string]: unknown } = $props();
</script>

<ol class={`step-list ${className}`} aria-label={label} data-current={current} {...restProps}>
  {@render children?.()}
</ol>
