<script lang="ts">
  // NumberInput — Lily Svelte headless contract.
  let {
    class: className = '',
    label = '',
    name = undefined,
    value = $bindable<number | null>(null),
    min = undefined,
    max = undefined,
    step = 1 as number | string,
    unit = '',
    required = false,
    disabled = false,
    ...restProps
  }: {
    label?: string;
    name?: string;
    value?: number | null;
    min?: number;
    max?: number;
    step?: number | string;
    unit?: string;
    required?: boolean;
    disabled?: boolean;
    [key: string]: unknown;
  } = $props();

  function handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target.value === '') value = null;
    else {
      const num = Number(target.value);
      value = isNaN(num) ? null : num;
    }
  }
</script>

<div class="field">
  {#if label}
    <label class="label" for={name} data-required={required || undefined}>
      {label}{#if unit}<span class="hint" style="display:inline; margin-left:0.25rem;">({unit})</span>{/if}
    </label>
  {/if}
  <input
    class={`number-input ${className}`}
    id={name}
    {name}
    type="number"
    aria-label={label || undefined}
    {min}
    {max}
    {step}
    {required}
    {disabled}
    value={value ?? ''}
    oninput={handleInput}
    {...restProps}
  />
</div>
