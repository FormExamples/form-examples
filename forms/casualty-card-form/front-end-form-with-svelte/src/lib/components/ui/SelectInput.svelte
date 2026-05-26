<script lang="ts">
  // SelectInput — Lily Svelte headless contract.
  // Emits: <select class="select">...</select> wrapped in <div class="field">.
  interface Option {
    value: string;
    label: string;
  }
  let {
    class: className = '',
    label = '',
    name = undefined,
    options,
    value = $bindable(''),
    required = false,
    disabled = false,
    ...restProps
  }: {
    label?: string;
    name?: string;
    options: Option[];
    value?: string;
    required?: boolean;
    disabled?: boolean;
    [key: string]: unknown;
  } = $props();
</script>

<div class="field">
  {#if label}
    <label class="label" for={name} data-required={required || undefined}>{label}</label>
  {/if}
  <select
    class={`select ${className}`}
    id={name}
    {name}
    aria-label={label || undefined}
    bind:value
    {required}
    {disabled}
    {...restProps}
  >
    <option value="">-- Select --</option>
    {#each options as opt (opt.value)}
      <option value={opt.value}>{opt.label}</option>
    {/each}
  </select>
</div>
