<script lang="ts">
  // Hint — Lily Svelte headless contract.
  //
  // Emits: <p class="hint" id="…?">.
  // Mirrors forms/lily-svelte-spec/Hint/Hint.svelte.
  import type { Snippet } from 'svelte';

  let {
    class: className = '',
    id = undefined,
    children,
    ...restProps
  }: {
    id?: string;
    children: Snippet;
    [key: string]: unknown;
  } = $props();
</script>

<p class={`hint ${className}`} {id} {...restProps}>
  {@render children?.()}
</p>
