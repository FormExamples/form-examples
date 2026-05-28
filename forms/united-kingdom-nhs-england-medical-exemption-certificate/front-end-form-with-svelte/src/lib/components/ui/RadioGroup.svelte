<script lang="ts">
  // RadioGroup — Lily Svelte headless contract.
  interface Option {
    value: string;
    label: string;
  }
  let {
    label,
    name,
    options,
    value = $bindable(''),
    required = false
  }: {
    label: string;
    name: string;
    options: Option[];
    value: string;
    required?: boolean;
  } = $props();
</script>

<fieldset class="field radio-group" role="radiogroup" aria-label={label}>
  <legend class="label" data-required={required || undefined}>{label}</legend>
  {#each options as opt (opt.value)}
    <label class="radio-input" data-checked={value === opt.value || undefined}>
      <input
        type="radio"
        {name}
        value={opt.value}
        bind:group={value}
        {required}
      />
      <span>{opt.label}</span>
    </label>
  {/each}
</fieldset>
