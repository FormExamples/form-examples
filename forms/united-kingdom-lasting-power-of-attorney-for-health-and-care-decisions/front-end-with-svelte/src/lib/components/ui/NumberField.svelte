<script lang="ts">
  // NumberField — Lily Svelte headless contract (number-input).
  interface Props {
    label: string;
    value: number | null;
    min?: number;
    max?: number;
    step?: number;
    hint?: string;
    onchange?: () => void;
  }
  let {
    label,
    value = $bindable(),
    min,
    max,
    step,
    hint = '',
    onchange,
  }: Props = $props();
  const id = `n-${Math.random().toString(36).slice(2, 10)}`;
</script>

<div class="field">
  <label for={id} class="label">{label}</label>
  <input
    {id}
    type="number"
    {min}
    {max}
    {step}
    bind:value
    oninput={() => onchange?.()}
    class="number-input"
  />
  {#if hint}<span class="hint">{hint}</span>{/if}
</div>
