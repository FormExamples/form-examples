<script lang="ts">
  // RadioGroup — Lily Svelte headless contract.
  interface Option { value: string; label: string }
  let {
    class: className = '',
    label,
    name = undefined,
    options,
    value = $bindable(''),
    required = false,
    disabled = false,
    ...restProps
  }: {
    label: string;
    name?: string;
    options: Option[];
    value?: string;
    required?: boolean;
    disabled?: boolean;
    [key: string]: unknown;
  } = $props();
</script>

<fieldset
  class={`radio-group ${className}`}
  role="radiogroup"
  aria-label={label}
  {disabled}
  {...restProps}
>
  <legend class="label" data-required={required || undefined}>{label}</legend>
  {#each options as opt (opt.value)}
    <label>
      <input
        type="radio"
        class="radio-input"
        {name}
        value={opt.value}
        bind:group={value}
        {required}
        {disabled}
      />
      {opt.label}
    </label>
  {/each}
</fieldset>
