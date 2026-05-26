<script lang="ts">
  // Hint — Lily Svelte headless contract. Emits: <p class="hint">.
  import type { Snippet } from 'svelte';

  let {
    class: className = '',
    id = undefined,
    children,
    ...restProps
  }: { id?: string; children: Snippet; [key: string]: unknown } = $props();
</script>

<p class={`hint ${className}`} {id} {...restProps}>{@render children?.()}</p>
