<script lang="ts">
  // Field — Lily Svelte headless contract.
  // Emits: <div class="field"><label class="label">...</label> <slot/>
  //        <p class="error-message" role="alert">...</p></div>.
  import type { Snippet } from 'svelte';

  let {
    class: className = '',
    label,
    description = undefined,
    error = undefined,
    required = false,
    inputId = undefined,
    children,
    ...restProps
  }: {
    label: string;
    description?: string;
    error?: string;
    required?: boolean;
    inputId?: string;
    children: Snippet;
    [key: string]: unknown;
  } = $props();

  const uid = $props.id();
  const generatedId = `field-${uid}`;
  const fieldId = $derived(inputId ?? generatedId);
  const descId = $derived(`${fieldId}-desc`);
  const errorId = $derived(`${fieldId}-error`);
</script>

<div class={`field ${className}`} data-required={required || undefined} {...restProps}>
  <label class="label" for={fieldId} data-required={required || undefined}>{label}</label>
  {#if description}<p id={descId} class="hint">{description}</p>{/if}
  {@render children?.()}
  {#if error}<p id={errorId} class="error-message" role="alert">{error}</p>{/if}
</div>
