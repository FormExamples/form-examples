<script lang="ts">
  // TextArea — Lily Svelte headless contract.
  // Emits: <textarea class="text-area-input">.
  let {
    class: className = '',
    label = '',
    name = undefined,
    value = $bindable(''),
    placeholder = '',
    rows = 3,
    required = false,
    disabled = false,
    ...restProps
  }: {
    label?: string;
    name?: string;
    value?: string;
    placeholder?: string;
    rows?: number;
    required?: boolean;
    disabled?: boolean;
    [key: string]: unknown;
  } = $props();
</script>

<div class="field">
  {#if label}
    <label class="label" for={name} data-required={required || undefined}>{label}</label>
  {/if}
  <textarea
    class={`text-area-input ${className}`}
    id={name}
    {name}
    aria-label={label || undefined}
    bind:value
    {placeholder}
    {rows}
    {required}
    {disabled}
    {...restProps}
  ></textarea>
</div>
