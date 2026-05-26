<script lang="ts">
  // NumberField — Lily Svelte headless contract.
  // Emits: <div class="field"><label class="label">...</label>
  //        <input class="number-input"></div>.
  let {
    label,
    value = $bindable(),
    min,
    max,
    step = 'any',
    unit = '',
    hint = '',
    required = false,
  }: {
    label: string;
    value: number | null;
    min?: number;
    max?: number;
    step?: number | 'any';
    unit?: string;
    hint?: string;
    required?: boolean;
  } = $props();
</script>

<div class="field" data-required={required || undefined}>
  <label class="label" data-required={required || undefined}>
    <span>{label}{unit ? ` (${unit})` : ''}</span>
    <input
      type="number"
      {min}
      {max}
      {step}
      class="number-input"
      aria-label={label}
      bind:value
      {required}
    />
  </label>
  {#if hint}<p class="hint">{hint}</p>{/if}
</div>
