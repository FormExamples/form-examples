<script lang="ts">
  // TextAreaInput — Lily Svelte headless contract.
  //
  // Supports the canonical signature and the legacy TextArea signature
  // (`name=`, `placeholder=`) so pre-existing step files migrate by
  // changing only the import statement.
  let {
    class: className = '',
    label,
    name = undefined,
    value = $bindable(''),
    rows = 3,
    placeholder = '',
    required = false,
    disabled = false,
    ...restProps
  }: {
    label: string;
    name?: string;
    value?: string;
    rows?: number;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    [key: string]: unknown;
  } = $props();
</script>

{#if name !== undefined}
  <div class="field">
    <label class="label" for={name} data-required={required || undefined}>{label}</label>
    <textarea
      id={name}
      {name}
      {placeholder}
      {rows}
      {required}
      {disabled}
      class={`text-area-input ${className}`}
      bind:value
      {...restProps}
    ></textarea>
  </div>
{:else}
  <textarea
    class={`text-area-input ${className}`}
    aria-label={label}
    {placeholder}
    {rows}
    {required}
    {disabled}
    bind:value
    {...restProps}
  ></textarea>
{/if}
