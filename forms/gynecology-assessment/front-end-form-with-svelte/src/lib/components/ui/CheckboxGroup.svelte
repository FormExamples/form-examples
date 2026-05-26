<script lang="ts">
  // CheckboxGroup — Lily Svelte headless contract.
  interface Option { value: string; label: string }
  let {
    class: className = '',
    label,
    options,
    values = $bindable<string[]>([]),
    disabled = false,
    ...restProps
  }: {
    label: string;
    options: Option[];
    values?: string[];
    disabled?: boolean;
    [key: string]: unknown;
  } = $props();

  function toggle(val: string) {
    if (values.includes(val)) values = values.filter((v) => v !== val);
    else values = [...values, val];
  }
</script>

<!-- svelte-ignore a11y_no_redundant_roles -->
<fieldset
  class={`checkbox-group ${className}`}
  role="group"
  aria-label={label}
  {disabled}
  {...restProps}
>
  <legend class="label">{label}</legend>
  {#each options as opt (opt.value)}
    <label>
      <input
        type="checkbox"
        class="checkbox-input"
        checked={values.includes(opt.value)}
        onchange={() => toggle(opt.value)}
        {disabled}
      />
      {opt.label}
    </label>
  {/each}
</fieldset>
