<script lang="ts">
  // TextInput — Lily Svelte headless contract.
  let {
    class: className = '',
    label = '',
    name = undefined,
    value = $bindable(''),
    placeholder = '',
    required = false,
    disabled = false,
    type = 'text',
    ...restProps
  }: {
    label?: string;
    name?: string;
    value?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    type?: 'text' | 'date' | 'email' | 'time' | 'tel';
    [key: string]: unknown;
  } = $props();

  const lilyClass = $derived(
    type === 'email' ? 'email-input' :
    type === 'date' ? 'date-input' :
    type === 'time' ? 'time-input' :
    type === 'tel' ? 'tel-input' :
    'text-input',
  );
</script>

<div class="field">
  {#if label}
    <label class="label" for={name} data-required={required || undefined}>{label}</label>
  {/if}
  <input
    class={`${lilyClass} ${className}`}
    id={name}
    {name}
    {type}
    aria-label={label || undefined}
    bind:value
    {placeholder}
    {required}
    {disabled}
    {...restProps}
  />
</div>
