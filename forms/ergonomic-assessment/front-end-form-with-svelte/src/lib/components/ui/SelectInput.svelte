<script lang="ts">
  // SelectInput — Lily Svelte headless contract.
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

<div class="field">
  <label class="label" for={name} data-required={required || undefined}>{label}</label>
  <select
    id={name}
    {name}
    {required}
    class="select"
    bind:value
  >
    <option value="">-- Select --</option>
    {#each options as opt}
      <option value={opt.value}>{opt.label}</option>
    {/each}
  </select>
</div>
