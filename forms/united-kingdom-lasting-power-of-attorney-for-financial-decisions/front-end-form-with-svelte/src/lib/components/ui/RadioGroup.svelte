<script lang="ts">
  // RadioGroup — Lily Svelte headless contract (radio-group / radio-input).
  interface Option {
    value: string;
    label: string;
  }
  let {
    name,
    options,
    value = $bindable(''),
  }: {
    name: string;
    options: Option[];
    value: string;
  } = $props();
</script>

<fieldset class="radio-group" role="radiogroup">
  {#each options as opt (opt.value)}
    <label class="radio-input">
      <input
        type="radio"
        {name}
        value={opt.value}
        checked={value === opt.value}
        onchange={() => (value = opt.value)}
      />
      <span>{opt.label}</span>
    </label>
  {/each}
</fieldset>
