<script lang="ts">
  // Progress — Lily Svelte headless contract.
  //
  // Emits: <progress class="progress" aria-label="…" value max>.
  //
  // Also supports the legacy ProgressBar `current` + `total` shape so step
  // pages that used <ProgressBar current=… total=…> migrate by changing
  // only the import statement.
  let {
    class: className = '',
    label = 'Wizard progress',
    value = undefined,
    max = 100,
    current = undefined,
    total = undefined,
    ...restProps
  }: {
    label?: string;
    value?: number;
    max?: number;
    current?: number;
    total?: number;
    [key: string]: unknown;
  } = $props();

  const computedValue = $derived(
    value !== undefined
      ? value
      : current !== undefined && total
        ? Math.round((current / total) * 100)
        : undefined,
  );
  const computedMax = $derived(value !== undefined ? max : 100);
  const percent = $derived(
    current !== undefined && total ? Math.round((current / total) * 100) : null,
  );
</script>

{#if current !== undefined && total !== undefined}
  <div class="field" aria-live="polite">
    <div class="hint">
      <span>Step {current} of {total}</span>
      <span> · {percent}%</span>
    </div>
    <progress
      class={`progress ${className}`}
      value={computedValue}
      max={computedMax}
      aria-label={label}
      {...restProps}
    ></progress>
  </div>
{:else}
  <progress
    class={`progress ${className}`}
    aria-label={label}
    value={computedValue}
    max={computedMax}
    {...restProps}
  ></progress>
{/if}
