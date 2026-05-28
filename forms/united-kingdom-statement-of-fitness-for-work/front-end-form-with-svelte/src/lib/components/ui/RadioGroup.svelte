<script lang="ts" generics="T extends string">
  // RadioGroup — Lily Svelte headless contract.
  interface Option {
    value: T;
    label: string;
  }

  let {
    id,
    name,
    options,
    value = $bindable(),
  }: {
    id: string;
    name: string;
    options: Option[];
    value: T;
  } = $props();
</script>

<div {id} class="radio-group" role="radiogroup">
  {#each options as opt (opt.value)}
    <label class="radio-input" data-checked={value === opt.value || undefined}>
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
</div>
