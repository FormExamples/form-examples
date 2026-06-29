<script lang="ts">
  // CheckboxGroup — Lily Svelte headless contract.
  //
  // Emits: <fieldset class="checkbox-group" role="group">...</fieldset>.
  // Mirrors forms/lily-svelte-spec/CheckboxGroup/CheckboxGroup.svelte.
  import type { Snippet } from 'svelte';

  let {
    class: className = '',
    label,
    disabled = false,
    children,
    ...restProps
  }: {
    label: string;
    disabled?: boolean;
    children: Snippet;
    [key: string]: unknown;
  } = $props();
</script>

<!-- svelte-ignore a11y_no_redundant_roles -->
<fieldset
  class={`checkbox-group ${className}`}
  role="group"
  aria-label={label}
  {disabled}
  {...restProps}
>
  {@render children?.()}
</fieldset>
