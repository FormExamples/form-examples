<script lang="ts">
  // Select — Lily Svelte headless contract.
  // Emits: <select class="select">...</select>.
  import type { Snippet } from 'svelte';

  let {
    class: className = '',
    label,
    value = $bindable<string>(''),
    required = false,
    disabled = false,
    children,
    ...restProps
  }: {
    label: string;
    value?: string;
    required?: boolean;
    disabled?: boolean;
    children: Snippet;
    [key: string]: unknown;
  } = $props();
</script>

<select
  class={`select ${className}`}
  aria-label={label}
  bind:value
  {required}
  {disabled}
  {...restProps}
>
  {@render children?.()}
</select>
