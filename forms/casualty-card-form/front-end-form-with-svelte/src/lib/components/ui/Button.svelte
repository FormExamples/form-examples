<script lang="ts">
  // Button — Lily Svelte headless contract. Emits: <button class="button">.
  import type { Snippet } from 'svelte';

  let {
    class: className = '',
    type = 'button',
    disabled = false,
    pressed = undefined,
    label = undefined,
    onclick = undefined,
    children,
    ...restProps
  }: {
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    pressed?: boolean;
    label?: string;
    onclick?: (event: MouseEvent) => void;
    children: Snippet;
    [key: string]: unknown;
  } = $props();
</script>

<button
  class={`button ${className}`}
  {type}
  {disabled}
  aria-pressed={pressed}
  aria-label={label}
  {onclick}
  {...restProps}
>
  {@render children?.()}
</button>
